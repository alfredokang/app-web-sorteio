import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import bcrypt from "bcryptjs";

export const MOCK_USER_EMAIL = "mock@example.com";
export const MOCK_USER_PASSWORD = "Mock@1234";

const DATABASE_DIRECTORY = path.join(process.cwd(), "data");
const DATABASE_FILE = path.join(DATABASE_DIRECTORY, "mock-users.json");

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAuthorized: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
};

export type PublicUser = Omit<StoredUser, "passwordHash">;

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Já existe um usuário cadastrado com o e-mail ${email}.`);
    this.name = "UserAlreadyExistsError";
  }
}

async function ensureDatabaseFile(): Promise<void> {
  await fs.mkdir(DATABASE_DIRECTORY, { recursive: true });

  try {
    await fs.access(DATABASE_FILE);
  } catch {
    await fs.writeFile(DATABASE_FILE, "[]", "utf-8");
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureDatabaseFile();

  const raw = await fs.readFile(DATABASE_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await ensureDatabaseFile();
  await fs.writeFile(
    DATABASE_FILE,
    JSON.stringify(users, null, 2),
    "utf-8",
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | undefined> {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  return users.find((user) => user.email === normalizedEmail);
}

export async function ensureMockUser(): Promise<StoredUser> {
  const users = await readUsers();
  const normalizedMockEmail = normalizeEmail(MOCK_USER_EMAIL);
  const existing = users.find((user) => user.email === normalizedMockEmail);

  if (existing) {
    if (!existing.isAuthorized) {
      existing.isAuthorized = true;
      existing.updatedAt = new Date().toISOString();
      existing.metadata = {
        ...existing.metadata,
        note: "Conta mock sempre autorizada",
      };
      await writeUsers(users);
    }

    return existing;
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(MOCK_USER_PASSWORD, 10);

  const mockUser: StoredUser = {
    id: "mock-user",
    name: "Usuário Mock",
    email: normalizedMockEmail,
    passwordHash,
    isAuthorized: true,
    createdAt: now,
    updatedAt: now,
    metadata: {
      isMock: true,
      note: "Conta de demonstração persistida localmente.",
    },
  };

  users.push(mockUser);
  await writeUsers(users);
  return mockUser;
}

export async function createUser(
  input: CreateUserInput,
): Promise<PublicUser> {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(input.email);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new UserAlreadyExistsError(input.email);
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(input.password, 10);

  const newUser: StoredUser = {
    id: randomUUID(),
    name: input.name,
    email: normalizedEmail,
    passwordHash,
    isAuthorized: false,
    createdAt: now,
    updatedAt: now,
    metadata: {
      phone: input.phone,
      isMock: false,
    },
  };

  users.push(newUser);
  await writeUsers(users);

  return toPublicUser(newUser);
}

export function toPublicUser(user: StoredUser): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function getAllUsers(): Promise<PublicUser[]> {
  const users = await readUsers();
  return users.map(toPublicUser);
}

export async function updateUser(
  updatedUser: StoredUser,
): Promise<void> {
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index === -1) {
    throw new Error("Usuário não encontrado para atualização.");
  }

  users[index] = updatedUser;
  await writeUsers(users);
}

