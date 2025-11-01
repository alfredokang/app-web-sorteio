import { NextResponse } from "next/server";
import { createMockUser, getUserByEmail } from "@/lib/mock-users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const user = await createMockUser({
      email,
      password,
      fullName,
      phone,
      isAuthorized: true,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register mock user error", error);
    return NextResponse.json(
      { error: "Não foi possível processar o cadastro." },
      { status: 500 }
    );
  }
}
