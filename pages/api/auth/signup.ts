import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response
      .status(405)
      .json({ message: "Método não permitido para esta rota." });
  }

  const body = request.body as SignupBody;

  if (!body.name || !body.email || !body.password) {
    return response
      .status(400)
      .json({ message: "Informe nome, e-mail e senha para concluir o cadastro." });
  }

  const payload: CreateUserInput = {
    name: body.name,
    email: body.email,
    password: body.password,
    phone: body.phone,
  };

  try {
    const user = await createUser(payload);
    return response.status(201).json({
      message:
        "Cadastro criado com sucesso! Aguarde a autorização interna para liberar o acesso completo.",
      user,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).json({ message: error.message });
    }

    console.error("Erro ao criar usuário mock:", error);
    return response
      .status(500)
      .json({ message: "Não foi possível concluir o cadastro agora." });
  }
}

