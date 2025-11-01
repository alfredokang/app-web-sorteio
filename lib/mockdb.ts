import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATABASE_DIR = path.join(process.cwd(), "data");
const DATABASE_PATH = path.join(DATABASE_DIR, "mock-users.json");

export interface StoredMockUser {
  id: string;
  name: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicMockUser {
  id: string;
  name: string;
  email: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
}

async function ensureDatabaseFile(): Promise<void> {
  await mkdir(DATABASE_DIR, { recursive: true });

  try {
    await readFile(DATABASE_PATH, "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      await writeFile(DATABASE_PATH, "[]", "utf8");
      return;
    }

    throw error;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function readAllUsers(): Promise<StoredMockUser[]> {
  await ensureDatabaseFile();
  const rawContent = await readFile(DATABASE_PATH, "utf8");

  try {
    const users = JSON.parse(rawContent) as StoredMockUser[];
    if (!Array.isArray(users)) {
      return [];
    }
    return users;
  } catch {
    await writeFile(DATABASE_PATH, "[]", "utf8");
    return [];
  }
}

export async function findUserByEmail(email: string): Promise<StoredMockUser | null> {
  const normalized = normalizeEmail(email);
  const users = await readAllUsers();

  return users.find((user) => user.emailNormalized === normalized) ?? null;
}

export async function addUser(params: {
  name: string;
  email: string;
  passwordHash: string;
  isAuthorized?: boolean;
}): Promise<StoredMockUser> {
  const users = await readAllUsers();
  const normalizedEmail = normalizeEmail(params.email);
  const now = new Date().toISOString();

  const newUser: StoredMockUser = {
    id: randomUUID(),
    name: params.name.trim(),
    email: params.email.trim(),
    emailNormalized: normalizedEmail,
    passwordHash: params.passwordHash,
    isAuthorized: params.isAuthorized ?? false,
    createdAt: now,
    updatedAt: now,
  };

  users.push(newUser);
  await writeFile(DATABASE_PATH, JSON.stringify(users, null, 2), "utf8");

  return newUser;
}

export function toPublicUser(user: StoredMockUser): PublicMockUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAuthorized: user.isAuthorized,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export { normalizeEmail };
