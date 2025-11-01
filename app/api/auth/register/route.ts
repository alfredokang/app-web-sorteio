import { NextResponse } from "next/server";
import { createMockUser, getUserByEmail } from "@/lib/mock-users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawFullName =
      typeof body?.fullName === "string" ? body.fullName.trim() : undefined;
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const rawPassword =
      typeof body?.password === "string" ? body.password : "";
    const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : undefined;

    if (!rawEmail || !rawPassword) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const normalizedEmail = rawEmail.toLowerCase();

    const existingUser = getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const user = await createMockUser({
      email: normalizedEmail,
      password: rawPassword,
      fullName: rawFullName,
      phone: rawPhone,
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
