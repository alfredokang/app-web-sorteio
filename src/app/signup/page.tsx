"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AuthTemplate } from "../components/AuthTemplate";
import { useForm } from "../../lib/react-hook-form";

type SignUpFormValues = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const emailPattern =
  /^(?:[a-zA-Z0-9_'^&+{}-]+(?:\.[a-zA-Z0-9_'^&+{}-]+)*|"(?:[^"\\]|\\.)+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const phonePattern =
  /^(\+?\d{1,3}[\s-]?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/;

export default function SignUpPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields, isSubmitting, isSubmitted },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") as string;

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return 0;
    let strength = 0;
    if (passwordValue.length >= 6) strength += 1;
    if (/[A-Z]/.test(passwordValue)) strength += 1;
    if (/[0-9]/.test(passwordValue)) strength += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) strength += 1;
    return strength;
  }, [passwordValue]);

  const onSubmit = async (values: SignUpFormValues) => {
    setError(null);
    setMessage(null);

    try {
      const trimmedFullName = values.fullName.trim();
      const trimmedPhone = values.phone.trim();
      const trimmedEmail = values.email.trim();
      const normalizedEmail = trimmedEmail.toLowerCase();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedFullName,
          phone: trimmedPhone,
          email: normalizedEmail,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível concluir o cadastro.");
      }

      setMessage(
        `Cadastro criado para ${
          trimmedFullName.split(" ")[0]
        }! Você já pode fazer login.`
      );
      reset({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Não foi possível concluir o cadastro.";
      setError(errorMessage);
    }
  };

  const renderPasswordStrength = () => {
    const labels = ["Muito fraca", "Fraca", "Boa", "Forte"];
    if (!passwordValue) {
      return (
        <p className="text-xs text-white/50">
          Use letras, números e símbolos para criar uma senha forte.
        </p>
      );
    }

    const normalized = Math.min(Math.max(passwordStrength, 1), labels.length);
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70">Força da senha:</span>
        <span
          className={
            normalized <= 1
              ? "text-rose-300"
              : normalized === 2
              ? "text-amber-300"
              : "text-emerald-300"
          }
        >
          {labels[normalized - 1]}
        </span>
      </div>
    );
  };

  return (
    <AuthTemplate
      title="Crie seu acesso exclusivo"
      subtitle="Preencha os dados para liberar o painel do time e acompanhar os resultados em tempo real."
      footer={
        <p>
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-300 hover:text-sky-200"
          >
            Fazer login
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label
              className="text-sm font-medium text-white/80"
              htmlFor="fullName"
            >
              Nome completo
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Como está no crachá"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              {...register("fullName", {
                required: "Informe o nome completo",
                minLength: {
                  value: 4,
                  message: "O nome deve ter ao menos 4 caracteres",
                },
              })}
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && (touchedFields.fullName || isSubmitted) && (
              <p className="text-sm text-rose-300">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/80"
              htmlFor="phone"
            >
              Celular
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="(11) 99999-9999"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              {...register("phone", {
                required: "Informe um celular",
                pattern: {
                  value: phonePattern,
                  message: "Digite um número válido",
                },
              })}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (touchedFields.phone || isSubmitted) && (
              <p className="text-sm text-rose-300">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/80"
              htmlFor="email"
            >
              E-mail corporativo
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              placeholder="nome@empresa.com"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              {...register("email", {
                required: "Informe um e-mail",
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
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
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
              placeholder="Crie uma senha"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              {...register("password", {
                required: "Informe uma senha",
                minLength: {
                  value: 6,
                  message: "Use ao menos 6 caracteres",
                },
              })}
              aria-invalid={Boolean(errors.password)}
            />
            <div>{renderPasswordStrength()}</div>
            {errors.password && (touchedFields.password || isSubmitted) && (
              <p className="text-sm text-rose-300">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/80"
              htmlFor="confirmPassword"
            >
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/40 transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              {...register("confirmPassword", {
                required: "Confirme a senha",
                validate: (value) =>
                  value === passwordValue || "As senhas precisam ser iguais",
              })}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword &&
              (touchedFields.confirmPassword || isSubmitted) && (
                <p className="text-sm text-rose-300">
                  {errors.confirmPassword.message}
                </p>
              )}
          </div>
        </div>

        <button
          type="submit"
          className="cursor-pointer flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition hover:shadow-[0_20px_45px_rgba(59,130,246,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando acesso..." : "Concluir cadastro"}
        </button>

        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
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
