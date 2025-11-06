"use client";

import Image from "next/image";
import { Participant } from "./types";

interface CardProps {
  participant: Participant;
  isActive?: boolean;
}

const avatarByGender: Record<Participant["avatar"], string> = {
  Masculino: "/avatars/male.svg",
  Feminino: "/avatars/female.svg",
};

export function Card({ participant, isActive = false }: CardProps) {
  const stars = Array.from(
    { length: 5 },
    (_, index) => index < participant?.questionThree?.minasCafeRate
  );

  return (
    <div
      className={`group relative rounded-3xl border bg-linear-to-br p-6 shadow-[0_22px_48px_rgba(6,78,59,0.35)] backdrop-blur-xl transition duration-500 ${
        isActive
          ? "border-emerald-300/70 from-emerald-500/20 via-emerald-400/16 to-emerald-300/10 scale-105"
          : "border-emerald-400/20 from-emerald-500/10 via-slate-900/60 to-emerald-400/8 scale-100 hover:scale-[1.03] hover:border-emerald-300/40"
      }`}
    >
      <div
        className={`absolute inset-0 rounded-3xl blur-xl transition-opacity duration-500 ${
          isActive
            ? "bg-emerald-400/30 opacity-50 group-hover:opacity-70"
            : "bg-emerald-400/20 opacity-0 group-hover:opacity-45"
        }`}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <Image
              src={
                avatarByGender[participant.avatar || "Masculino"] ||
                "/avatars/male.svg"
              }
              alt={`Avatar de ${participant.name}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">
              {participant.name.formatFullName}
            </span>
            <div className="flex items-center gap-1 text-sm text-emerald-200">
              {stars.map((filled, index) => (
                <span key={index}>{filled ? "★" : "☆"}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-200">
          “{participant.questionThree.followUp}”
        </p>
      </div>
    </div>
  );
}

export default Card;
