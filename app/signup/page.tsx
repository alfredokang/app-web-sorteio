"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthTemplate } from "../components/AuthTemplate";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const emailPattern =
  /^(?:[a-zA-Z0-9_'^&+{}-]+(?:\.[a-zA-Z0-9_'^&+{}-]+)*|"(?:[^"\\]|\\.)+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function SignupPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, touchedFields, isSubmitting, isSubmitted },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setMessage(null);
    setError(null);

    if (values.password !== values.confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Não foi possível concluir o cadastro agora.");
        return;
      }

      setMessage(
        data.message ??
          "Cadastro realizado com sucesso! Assim que for autorizado pela equipe você poderá acessar a área restrita.",
      );
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Erro ao enviar cadastro mock", err);
      setError("Ocorreu um erro inesperado. Tente novamente em instantes.");
    }
  };

  return (
    <AuthTemplate
      title="Crie seu acesso de demonstração"
      subtitle="Cadastre um usuário para testes internos. As contas ficam pendentes até serem autorizadas manualmente."
      footer={
        <p>
          Já possui acesso? <Link href="/login" className="font-semibold text-white">Volte para o login</Link>.
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80" htmlFor="name">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Como deseja ser identificado"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            {...register("name", {
              required: "Informe seu nome",
              minLength: {
                value: 3,
                message: "O nome deve ter pelo menos 3 caracteres",
              },
            })}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (touchedFields.name || isSubmitted) && (
            <p className="text-sm text-rose-300">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            placeholder="voce@empresa.com"
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
          <label className="text-sm font-medium text-white/80" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Crie uma senha segura"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            {...register("password", {
              required: "Informe uma senha",
              minLength: {
                value: 6,
                message: "A senha deve ter pelo menos 6 caracteres",
              },
            })}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (touchedFields.password || isSubmitted) && (
            <p className="text-sm text-rose-300">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80" htmlFor="confirmPassword">
            Confirme a senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repita a senha escolhida"
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            {...register("confirmPassword", {
              required: "Confirme sua senha",
              validate: (value) =>
                value === getValues("password") || "As senhas precisam ser iguais",
            })}
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword && (touchedFields.confirmPassword || isSubmitted) && (
            <p className="text-sm text-rose-300">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition hover:shadow-[0_20px_45px_rgba(59,130,246,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </button>

        <p className="text-xs text-white/60">
          Os usuários criados aqui são armazenados apenas em um arquivo local de mock. Ao reiniciar o projeto os cadastros são
          limpos automaticamente.
        </p>

        {message && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        )}
      </form>
    </AuthTemplate>
  );
}
