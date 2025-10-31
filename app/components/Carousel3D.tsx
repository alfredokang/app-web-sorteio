"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import { Participant } from "./types";

interface Carousel3DProps {
  participants: Participant[];
  isSpinning: boolean;
  winnerId: string | null;
  spinDuration?: number;
}

const TOTAL_ROTATIONS = 8;
const MAX_VISIBLE_CARDS = 8;

function normalizeAngle(angle: number) {
  return ((angle + 540) % 360) - 180;
}

export function Carousel3D({
  participants,
  isSpinning,
  winnerId,
  spinDuration = 10000,
}: Carousel3DProps) {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimestamp = useRef<number | null>(null);
  const alignmentRef = useRef<number | null>(null);

  const visibleSlots = useMemo(() => {
    if (participants.length === 0) {
      return 0;
    }

    return Math.min(participants.length, MAX_VISIBLE_CARDS);
  }, [participants.length]);

  const angleBetweenCards = useMemo(() => {
    if (participants.length === 0) {
      return 0;
    }

    const slots = visibleSlots || 1;
    return 360 / slots;
  }, [participants.length, visibleSlots]);

  const visibleItems = useMemo(() => {
    if (participants.length === 0 || visibleSlots === 0 || angleBetweenCards === 0) {
      return [];
    }

    const frontIndexFloat = -rotation / angleBetweenCards;
    const frontIndex = Number.isFinite(frontIndexFloat)
      ? Math.round(frontIndexFloat)
      : 0;
    const frontSlot = ((frontIndex % visibleSlots) + visibleSlots) % visibleSlots;
    const baseSlot = frontIndex - frontSlot;

    return Array.from({ length: visibleSlots }, (_, slotIndex) => {
      const globalIndex = baseSlot + slotIndex;
      const participantIndex =
        ((globalIndex % participants.length) + participants.length) %
        participants.length;
      const slotAngle = slotIndex * angleBetweenCards;
      const actualAngle = normalizeAngle(slotAngle + rotation);

      return {
        participant: participants[participantIndex],
        slotAngle,
        actualAngle,
      };
    });
  }, [angleBetweenCards, participants, rotation, visibleSlots]);

  useEffect(() => {
    if (!isSpinning || participants.length === 0) {
      return;
    }

    cancelAnimationFrame(animationRef.current ?? 0);
    startTimestamp.current = null;

    const animate = (timestamp: number) => {
      if (startTimestamp.current === null) {
        startTimestamp.current = timestamp;
      }
      const elapsed = timestamp - startTimestamp.current;
      const clamped = Math.min(elapsed, spinDuration);
      const progress = clamped / spinDuration;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = easeOut * TOTAL_ROTATIONS * 360;
      setRotation(-currentRotation);

      if (elapsed < spinDuration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current ?? 0);
    };
  }, [isSpinning, participants.length, spinDuration]);

  useEffect(() => {
    if (isSpinning || !winnerId || participants.length === 0) {
      return;
    }

    const winnerIndex = participants.findIndex(
      (person) => person.id === winnerId
    );
    if (winnerIndex === -1) {
      return;
    }

    cancelAnimationFrame(alignmentRef.current ?? 0);
    alignmentRef.current = requestAnimationFrame(() => {
      setRotation((previous) => {
        const targetRotation = -winnerIndex * angleBetweenCards;
        const currentRotation = previous % 360;
        const delta = ((targetRotation - currentRotation + 540) % 360) - 180;
        return previous + delta;
      });
    });

    return () => {
      cancelAnimationFrame(alignmentRef.current ?? 0);
    };
  }, [angleBetweenCards, isSpinning, participants, winnerId]);

  if (participants.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-zinc-300">
        Carregando participantes...
      </div>
    );
  }

  const radius = 320;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <div className="absolute inset-0 rounded-[48px] bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-black/80 blur-3xl" />
      <div
        className="relative flex h-full w-full items-center justify-center mt-40 mb-13"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative h-[360px] w-[360px] transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(18deg) rotateY(${rotation}deg)`,
          }}
        >
          {visibleItems.map(({ participant, slotAngle, actualAngle }) => {
            const isActive = winnerId === participant.id && !isSpinning;
            const isBehind = Math.abs(actualAngle) > 90;
            const depth = radius + (isActive ? 60 : isBehind ? -40 : 0);
            const scale = isActive ? 1.1 : isBehind ? 0.94 : 1;
            const opacity = isActive ? 1 : isBehind ? 0.35 : 0.7;
            const filter = isBehind ? "blur(4px) brightness(0.65)" : undefined;
            const clipPath = isBehind
              ? "inset(0 18% 0 18% round 36px)"
              : undefined;
            const zIndex = isActive ? 100 : Math.max(1, 80 - Math.abs(actualAngle));
            return (
              <div
                key={participant.id}
                className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotateY(${slotAngle}deg) translateZ(${depth}px) scale(${scale})`,
                  opacity,
                  filter,
                  clipPath,
                  zIndex,
                }}
              >
                <Card participant={participant} isActive={isActive} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 rounded-[48px] border border-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-linear-to-br from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export default Carousel3D;
