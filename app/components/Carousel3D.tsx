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
const MAX_VISIBLE_CARDS = 7;

export function Carousel3D({
  participants,
  isSpinning,
  winnerId,
  spinDuration = 10000,
}: Carousel3DProps) {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimestamp = useRef<number | null>(null);
  const alignmentRef = useRef<number | number>(null);

  const anglePerCard = useMemo(() => {
    return participants.length > 0 ? 360 / participants.length : 0;
  }, [participants.length]);

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
        const targetRotation = -winnerIndex * anglePerCard;
        const currentRotation = previous % 360;
        const delta = ((targetRotation - currentRotation + 540) % 360) - 180;
        return previous + delta;
      });
    });

    return () => {
      cancelAnimationFrame(alignmentRef.current ?? 0);
    };
  }, [anglePerCard, isSpinning, participants, winnerId]);

  const radius = 320;

  const visibleCards = useMemo(() => {
    const total = participants.length;
    if (total === 0) {
      return [] as Array<{
        participant: Participant;
        angle: number;
        position: number;
      }>;
    }

    const visibleCount = Math.min(total, MAX_VISIBLE_CARDS);
    const slotAngle = 360 / visibleCount;

    const rawIndex = anglePerCard === 0 ? 0 : -rotation / anglePerCard;
    const normalizedIndex =
      total > 0 ? ((rawIndex % total) + total) % total : 0;

    const centerSlot = (visibleCount - 1) / 2;
    const startIndex = Math.floor(normalizedIndex - centerSlot);
    const offset = normalizedIndex - (startIndex + centerSlot);

    return Array.from({ length: visibleCount }, (_, slot) => {
      const participantIndex =
        ((startIndex + slot) % total + total) % total;
      const participant = participants[participantIndex];
      const position = slot - centerSlot - offset;

      return {
        participant,
        angle: position * slotAngle,
        position,
      };
    });
  }, [anglePerCard, participants, rotation]);

  if (participants.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-zinc-300">
        Carregando participantes...
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <div className="absolute inset-0 rounded-[48px] bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-black/80 blur-3xl" />
      <div
        className="relative flex h-full w-full items-center justify-center mt-40 mb-13"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative h-[360px] w-[360px] overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(18deg)",
          }}
        >
          {visibleCards.map(({ participant, angle, position }) => {
            const isActive = winnerId === participant.id && !isSpinning;

            const maxDistance = Math.max(visibleCards.length - 1, 1) / 2;
            const distanceRatio = Math.min(Math.abs(position) / maxDistance, 1);

            const depth =
              Math.max(radius - distanceRatio * 90, radius * 0.55) +
              (isActive ? 30 : 0);
            const scale = isActive
              ? 1.05
              : 1 - Math.min(distanceRatio * 0.12, 0.18);
            const opacity = isActive
              ? 1
              : 1 - distanceRatio * 0.55;

            return (
              <div
                key={participant.id}
                className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${depth}px) scale(${scale})`,
                  opacity,
                  zIndex: Math.round((1 - distanceRatio) * 100),
                  transition: isSpinning
                    ? undefined
                    : "transform 500ms ease, opacity 500ms ease",
                  pointerEvents: distanceRatio < 0.75 ? "auto" : "none",
                  backfaceVisibility: "hidden",
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
