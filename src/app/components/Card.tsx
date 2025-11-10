"use client";

import Image from "next/image";
import { Participant } from "./types";

interface CardProps {
  participant: Participant;
  isActive?: boolean;
}

const FALLBACK_AVATAR = "/avatars/male.svg";

function getAvatarSrc(participant: Participant) {
  const fromAvatarUrl = participant.avatarUrl?.trim();
  if (fromAvatarUrl) {
    return fromAvatarUrl;
  }

  const avatarValue =
    typeof participant.avatar === "string" ? participant.avatar.trim() : "";

  if (
    avatarValue &&
    (avatarValue.startsWith("http://") ||
      avatarValue.startsWith("https://") ||
      avatarValue.startsWith("/"))
  ) {
    return avatarValue;
  }

  return FALLBACK_AVATAR;
}

export function Card({ participant, isActive = false }: CardProps) {
  const stars = Array.from(
    { length: 5 },
    (_, index) => index < participant?.questionThree?.minasCafeRate
  );

  const avatarSrc = getAvatarSrc(participant);

  return (
    <div
      className={`group relative rounded-3xl border bg-linear-to-br p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 ${
        isActive
          ? "border-white/40 from-white/15 via-white/20 to-white/10 scale-105"
          : "border-white/10 from-white/5 via-white/10 to-white/5 scale-100 hover:scale-[1.02]"
      }`}
    >
      <div
        className={`absolute inset-0 rounded-3xl blur-xl transition-opacity duration-500 ${
          isActive
            ? "bg-white/10 opacity-40 group-hover:opacity-60"
            : "bg-white/5 opacity-0 group-hover:opacity-40"
        }`}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <Image
              src={avatarSrc}
              alt={`Avatar de ${participant.name.formatFullName}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">
              {participant.name.formatFullName}
            </span>
            <div className="flex items-center gap-1 text-sm text-amber-400">
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
