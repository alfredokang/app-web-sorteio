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
const MAX_SLOT_COUNT = 8;

const modulo = (value: number, divisor: number) => {
  if (divisor === 0) {
    return 0;
  }

  const remainder = value % divisor;
  return remainder < 0 ? remainder + divisor : remainder;
};

const resolveFrontStep = (rotation: number, anglePerCard: number) => {
  if (anglePerCard === 0) {
    return 0;
  }

  const stepExact = -rotation / anglePerCard;
  return stepExact >= 0 ? Math.floor(stepExact) : Math.ceil(stepExact);
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
  const alignmentRef = useRef<number | null>(null);

  const totalParticipants = participants.length;
  const slotCount =
    totalParticipants > MAX_SLOT_COUNT ? MAX_SLOT_COUNT : totalParticipants;

  const anglePerCard = useMemo(() => {
    return slotCount > 0 ? 360 / slotCount : 0;
  }, [slotCount]);

  useEffect(() => {
    if (!isSpinning || totalParticipants === 0) {
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
  }, [isSpinning, spinDuration, totalParticipants]);

  useEffect(() => {
    if (isSpinning || !winnerId || totalParticipants === 0 || anglePerCard === 0) {
      return;
    }

    const targetParticipantIndex = participants.findIndex(
      (participant) => participant.id === winnerId
    );

    if (targetParticipantIndex === -1) {
      return;
    }

    cancelAnimationFrame(alignmentRef.current ?? 0);
    alignmentRef.current = requestAnimationFrame(() => {
      setRotation((previous) => {
        const currentFrontStep = resolveFrontStep(previous, anglePerCard);
        let stepDifference = targetParticipantIndex - currentFrontStep;

        if (totalParticipants > 0) {
          const moduloDiff = modulo(stepDifference, totalParticipants);
          const altDiff = moduloDiff - totalParticipants;

          if (Math.abs(moduloDiff) < Math.abs(stepDifference)) {
            stepDifference = moduloDiff;
          }

          if (Math.abs(altDiff) < Math.abs(stepDifference)) {
            stepDifference = altDiff;
          }
        }

        return previous - stepDifference * anglePerCard;
      });
    });

    return () => {
      cancelAnimationFrame(alignmentRef.current ?? 0);
    };
  }, [
    anglePerCard,
    isSpinning,
    participants,
    totalParticipants,
    winnerId,
  ]);

  const radius = 320;
  const maxVisibleStep = slotCount > 7 ? 3 : slotCount / 2;
  const fadeWidthInSteps = slotCount > 7 ? 0.5 : 0;

  if (totalParticipants === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-zinc-300">
        Carregando participantes...
      </div>
    );
  }

  const frontStep = resolveFrontStep(rotation, anglePerCard);
  const frontSlotIndex = slotCount > 0 ? modulo(frontStep, slotCount) : 0;
  const frontParticipantIndex = modulo(frontStep, totalParticipants);

  const cardElements = Array.from({ length: slotCount }, (_, slotIndex) => {
    const slotOffsetRaw = modulo(slotIndex - frontSlotIndex, slotCount);
    let slotOffset = slotOffsetRaw;

    if (slotCount > 0 && slotOffset > slotCount / 2) {
      slotOffset -= slotCount;
    }

    const participantIndex = modulo(
      frontParticipantIndex + slotOffset,
      totalParticipants
    );

    const participant = participants[participantIndex];

    if (!participant) {
      return null;
    }

    const isActive = winnerId === participant.id && !isSpinning;
    const depth = radius + (isActive ? 30 : 0);
    let opacityValue = isActive ? 1 : 0.6;

    if (anglePerCard > 0) {
      const cardAngle = slotIndex * anglePerCard + rotation;
      let normalizedAngle = modulo(cardAngle, 360);

      if (normalizedAngle > 180) {
        normalizedAngle -= 360;
      }

      const stepsFromFront = Math.abs(normalizedAngle) / anglePerCard;

      if (slotCount > 7 && stepsFromFront > maxVisibleStep + fadeWidthInSteps) {
        opacityValue = 0;
      } else if (
        slotCount > 7 &&
        fadeWidthInSteps > 0 &&
        stepsFromFront > maxVisibleStep
      ) {
        const fadeProgress = Math.min(
          (stepsFromFront - maxVisibleStep) / fadeWidthInSteps,
          1
        );
        opacityValue *= 1 - fadeProgress;
      }
    }

    const finalOpacity = Math.max(0, opacityValue);
    const isEffectivelyHidden = finalOpacity <= 0.01;

    return (
      <div
        key={`slot-${slotIndex}-${participant.id}`}
        className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `rotateY(${slotIndex * anglePerCard}deg) translateZ(${depth}px)`,
          opacity: finalOpacity,
          visibility: isEffectivelyHidden ? "hidden" : "visible",
          transition: "opacity 300ms ease",
        }}
      >
        <Card participant={participant} isActive={isActive} />
      </div>
    );
  });

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
          {cardElements}
        </div>
      </div>
      <div className="absolute inset-0 rounded-[48px] border border-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-linear-to-br from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export default Carousel3D;
