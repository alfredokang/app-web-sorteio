"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { AuthTemplate } from "../components/AuthTemplate";
import { useForm } from "../../lib/react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

const emailPattern =
  /^(?:[a-zA-Z0-9_'^&+{}-]+(?:\.[a-zA-Z0-9_'^&+{}-]+)*|"(?:[^"\\]|\\.)+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/sorteio";
  const callbackSearch = searchParams.get("callbackSearch") ?? "";
  const derivedAuthErrorMessage = useMemo(() => {
    if (!authError) {
      return null;
    }

    return authError === "CredentialsSignin"
      ? "E-mail ou senha inválidos."
      : "Não foi possível fazer login. Tente novamente.";
  }, [authError]);
  const activeError = error ?? derivedAuthErrorMessage;
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

  useEffect(() => {
    if (status === "authenticated") {
      const destination = `${callbackUrl}${callbackSearch}`;
      router.replace(destination);
    }
  }, [status, callbackUrl, callbackSearch, router]);

  useEffect(() => {
    if (!authError) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl);
  }, [authError, pathname, router, searchParams]);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setMessage(null);

    const destination = `${callbackUrl}${callbackSearch}`;
    const trimmedEmail = values.email.trim();
    const normalizedEmail = trimmedEmail.toLowerCase();
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password: values.password,
      redirect: false,
      callbackUrl: destination,
    });

    if (!result || result.error) {
      const friendlyError =
        result?.error === "CredentialsSignin"
          ? "E-mail ou senha inválidos."
          : "Não foi possível fazer login. Verifique seus dados e tente novamente.";
      setError(friendlyError);
      setMessage(null);
      return;
    }

    setMessage(`Bem-vindo de volta, ${trimmedEmail}!`);
    router.replace(result.url ?? destination);
    router.refresh();
  };

  return (
    <AuthTemplate
      title="Faça login para continuar"
      subtitle="Acesse a área interna da equipe e acompanhe os próximos sorteios e relatórios. Acesso apenas a clientes autorizados."
      footer={
        <p>
          Ainda não tem uma conta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Criar cadastro
          </Link>
        </p>
      }
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
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
          className="cursor-pointer flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 via-green-500 to-lime-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.35)] transition hover:shadow-[0_20px_45px_rgba(34,197,94,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>

        {activeError && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {activeError}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}
      </form>
    </AuthTemplate>
  );
}
