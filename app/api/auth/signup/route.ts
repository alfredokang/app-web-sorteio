import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { addUser, findUserByEmail, toPublicUser } from "@/lib/mockdb";

interface SignupPayload {
  name?: string;
  email?: string;
  password?: string;
}

function validateEmail(email: string): boolean {
  return /^(?:[a-zA-Z0-9_'^&+{}-]+(?:\.[a-zA-Z0-9_'^&+{}-]+)*|"(?:[^"\\]|\\.)+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(
    email,
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupPayload;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const password = body.password ?? "";

    if (!name || name.length < 3) {
      return NextResponse.json(
        { message: "Informe um nome com pelo menos 3 caracteres." },
        { status: 400 },
      );
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { message: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Informe uma senha com pelo menos 6 caracteres." },
        { status: 400 },
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "Já existe um cadastro usando este e-mail." },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 10);
    const user = await addUser({
      name,
      email,
      passwordHash,
      isAuthorized: false,
    });

    return NextResponse.json(
      {
        message:
          "Cadastro criado com sucesso! Aguarde a liberação pela equipe e utilize suas credenciais para acessar o sistema.",
        user: toPublicUser(user),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário mock:", error);
    return NextResponse.json(
      {
        message: "Não foi possível concluir o cadastro agora. Tente novamente em instantes.",
      },
      { status: 500 },
    );
  }
}
