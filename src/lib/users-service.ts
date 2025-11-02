// Usado no frontend

import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt-ts";
import { firestore } from "@/firebase/client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  Timestamp,
} from "firebase/firestore";

// Tipos
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName?: string;
  phone?: string;
  isAuthorized: boolean;
  createdAt: string;
}

interface CreateUserInput {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  isAuthorized?: boolean;
}

// Coleção do Firestore
const usersCollection = collection(firestore, "users");

// Normalização
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * 🔹 Cria um novo usuário
 */
export async function createUser({
  email,
  password,
  fullName,
  phone,
  isAuthorized = false,
}: CreateUserInput): Promise<User> {
  const normalizedEmail = normalizeEmail(email);

  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Já existe um usuário cadastrado com este e-mail.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    fullName,
    phone,
    isAuthorized,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(usersCollection, newUser.id), newUser);

  return newUser;
}

/**
 * 🔹 Busca usuário por e-mail
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = normalizeEmail(email);

  const q = query(usersCollection, where("email", "==", normalizedEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const data = snapshot.docs[0].data() as User;
  return data;
}

/**
 * 🔹 Verifica credenciais de login
 */
export async function verifyUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword || !user.isAuthorized) return null;

  return user;
}

/**
 * 🔹 Lista todos os usuários
 */
export async function listUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map((d) => d.data() as User);
}
