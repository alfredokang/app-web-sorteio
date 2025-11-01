import { NextResponse } from "next/server";

import {
  CreateUserInput,
  UserAlreadyExistsError,
  createUser,
} from "@/lib/mockdb";

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
};

export async function POST(request: Request) {
  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json(
      {
        message:
          "Corpo da requisição inválido. Envie um JSON com nome, e-mail e senha.",
      },
      { status: 400 },
    );
  }

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      {
        message:
          "Informe nome, e-mail e senha para concluir o cadastro.",
      },
      { status: 400 },
    );
  }

  const payload: CreateUserInput = {
    name: body.name,
    email: body.email,
    password: body.password,
    phone: body.phone,
  };

  try {
    const user = await createUser(payload);
    return NextResponse.json(
      {
        message:
          "Cadastro criado com sucesso! Aguarde a autorização interna para liberar o acesso completo.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return NextResponse.json(
        { message: error.message },
        { status: 409 },
      );
    }

    console.error("Erro ao criar usuário mock:", error);
    return NextResponse.json(
      { message: "Não foi possível concluir o cadastro agora." },
      { status: 500 },
    );
  }
}
