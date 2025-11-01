import { randomUUID } from "node:crypto";
import * as bcrypt from "bcrypt-ts";

export interface MockUser {
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

const users = new Map<string, MockUser>();

const DEFAULT_USER_EMAIL = "mock@example.com";
const DEFAULT_USER_PASSWORD = "Mock@1234";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function registerDefaultUser() {
  const email = normalizeEmail(DEFAULT_USER_EMAIL);
  if (users.has(email)) {
    return;
  }

  const passwordHash = bcrypt.hashSync(DEFAULT_USER_PASSWORD, 10);

  const defaultUser: MockUser = {
    id: randomUUID(),
    email,
    passwordHash,
    fullName: "Mock User",
    phone: undefined,
    isAuthorized: true,
    createdAt: new Date().toISOString(),
  };

  users.set(email, defaultUser);
}

registerDefaultUser();

export async function createMockUser({
  email,
  password,
  fullName,
  phone,
  isAuthorized = true,
}: CreateUserInput) {
  const normalizedEmail = normalizeEmail(email);
  if (users.has(normalizedEmail)) {
    throw new Error("Já existe um usuário cadastrado com este e-mail.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: MockUser = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    fullName,
    phone,
    isAuthorized,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, newUser);

  return newUser;
}

export function getUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = users.get(normalizedEmail);
  if (!user) return null;

  return { ...user };
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword || !user.isAuthorized) {
    return null;
  }

  return user;
}

export function listMockUsers() {
  return Array.from(users.values()).map((user) => ({ ...user }));
}
