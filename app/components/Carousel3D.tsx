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
const IDEAL_SLOT_ANGLE = 360 / 8;

const normalizeAngle = (value: number) => {
  const wrapped = ((value % 360) + 360) % 360;
  return wrapped > 180 ? wrapped - 360 : wrapped;
};

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
      return [];
    }

    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const spacingMultiplier =
      anglePerCard > 0 && anglePerCard < IDEAL_SLOT_ANGLE
        ? IDEAL_SLOT_ANGLE / anglePerCard
        : 1;

    const entries = participants.map((participant, index) => {
      const baseAngle = index * anglePerCard;
      const relativeAngle = normalizeAngle(baseAngle + normalizedRotation);
      const distance = Math.abs(relativeAngle);

      return {
        participant,
        index,
        relativeAngle,
        distance,
        displayAngle: relativeAngle * spacingMultiplier,
      };
    });

    if (total <= MAX_VISIBLE_CARDS) {
      return entries
        .slice()
        .sort((a, b) => a.displayAngle - b.displayAngle);
    }

    return entries
      .slice()
      .sort((a, b) => {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return a.relativeAngle - b.relativeAngle;
      })
      .slice(0, MAX_VISIBLE_CARDS)
      .sort((a, b) => a.displayAngle - b.displayAngle);
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
          className="relative h-[360px] w-[360px] transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(18deg)",
          }}
        >
          {visibleCards.map(({ participant, displayAngle }) => {
            const isActive = winnerId === participant.id && !isSpinning;
            const depth = radius + (isActive ? 30 : 0);

            return (
              <div
                key={participant.id}
                className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotateY(${displayAngle}deg) translateZ(${depth}px)`,
                  opacity: isActive ? 1 : 0.6,
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
