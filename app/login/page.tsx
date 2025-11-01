"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AuthTemplate } from "../components/AuthTemplate";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

const emailPattern =
  /^(?:[a-zA-Z0-9_'^&+{}-]+(?:\.[a-zA-Z0-9_'^&+{}-]+)*|"(?:[^"\\]|\\.)+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting, isSubmitted },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setMessage(null);
    setError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result) {
      setError("Não foi possível realizar o login agora. Tente novamente.");
      return;
    }

    if (result.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Não foi possível confirmar suas credenciais. Verifique os dados e tente novamente."
          : result.error,
      );
      return;
    }

    setMessage("Login realizado com sucesso! Redirecionando...");
    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user.isAuthorized) {
      router.replace("/");
    }
  }, [status, session?.user.isAuthorized, router]);

  return (
    <AuthTemplate
      title="Faça login para continuar"
      subtitle="Use as credenciais fornecidas pela equipe para acessar a área interna."
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80" htmlFor="email">
            E-mail corporativo
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder="nome@empresa.com"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            {...register("email", {
              required: "Informe seu e-mail",
              pattern: {
                value: emailPattern,
                message: "Digite um e-mail válido",
              },
            })}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (touchedFields.email || isSubmitted) && (
            <p className="text-sm text-rose-300">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white/80"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            {...register("password", {
              required: "Informe sua senha",
              minLength: {
                value: 6,
                message: "A senha precisa ter pelo menos 6 caracteres",
              },
            })}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (touchedFields.password || isSubmitted) && (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition hover:shadow-[0_20px_45px_rgba(59,130,246,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
          <p>
            Utilize o e-mail <code className="font-mono text-white">mock@example.com</code> e a senha
            <code className="ml-1 font-mono text-white">Mock@1234</code> para testar o fluxo completo.
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        {session && (
          <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
            <p>
              Sessão ativa para <strong>{session.user.email}</strong>.
            </p>
            <p>
              Status de autorização:{" "}
              {session.user.isAuthorized
                ? "liberado para acessar as áreas internas."
                : "aguardando aprovação da equipe."}
            </p>
          </div>
        )}
      </form>
    </AuthTemplate>
  );
}
