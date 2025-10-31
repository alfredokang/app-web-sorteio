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
  const virtualizationActive = totalParticipants > MAX_SLOT_COUNT;

  const [slotAssignments, setSlotAssignments] = useState<Participant[]>(() =>
    participants.slice(0, slotCount)
  );
  const slotAssignmentsRef = useRef<Participant[]>(slotAssignments);
  const hiddenStateRef = useRef<boolean[]>([]);
  const rangeStartRef = useRef(0);
  const rangeEndRef = useRef(0);
  const rotationDirectionRef = useRef<"forward" | "backward">("forward");
  const previousRotationRef = useRef(0);
  const lastParticipantsKeyRef = useRef<string | null>(null);
  const lastVirtualizationRef = useRef<boolean>(virtualizationActive);
  const previousParticipantsRef = useRef<Participant[] | null>(null);

  const participantsKey = useMemo(
    () => participants.map((participant) => participant.id).join("|"),
    [participants]
  );

  const anglePerCard = useMemo(() => {
    return slotCount > 0 ? 360 / slotCount : 0;
  }, [slotCount]);

  useEffect(() => {
    slotAssignmentsRef.current = slotAssignments;
  }, [slotAssignments]);

  useEffect(() => {
    const previous = previousRotationRef.current;
    const delta = rotation - previous;
    if (delta !== 0) {
      rotationDirectionRef.current = delta < 0 ? "forward" : "backward";
    }
    previousRotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    const arrayChanged = previousParticipantsRef.current !== participants;
    previousParticipantsRef.current = participants;

    const keyChanged = lastParticipantsKeyRef.current !== participantsKey;
    const virtualizationChanged =
      lastVirtualizationRef.current !== virtualizationActive;

    if (!arrayChanged && !keyChanged && !virtualizationChanged) {
      return;
    }

    lastParticipantsKeyRef.current = participantsKey;
    lastVirtualizationRef.current = virtualizationActive;

    if (!virtualizationActive) {
      slotAssignmentsRef.current = participants;
      hiddenStateRef.current = [];
      rangeStartRef.current = 0;
      rangeEndRef.current = totalParticipants;
      return;
    }

    if (totalParticipants === 0) {
      slotAssignmentsRef.current = [];
      hiddenStateRef.current = [];
      rangeStartRef.current = 0;
      rangeEndRef.current = 0;
      return;
    }

    const initialAssignments = Array.from({ length: slotCount }, (_, index) => {
      const participantIndex = index % totalParticipants;
      return participants[participantIndex];
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlotAssignments(initialAssignments);
    slotAssignmentsRef.current = initialAssignments;
    hiddenStateRef.current = new Array(slotCount).fill(false);
    rangeStartRef.current = 0;
    rangeEndRef.current = slotCount % totalParticipants;
  }, [
    participants,
    participantsKey,
    slotCount,
    totalParticipants,
    virtualizationActive,
  ]);

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

    const resolveWinnerIndex = () => {
      if (virtualizationActive) {
        const assignments = slotAssignmentsRef.current;
        if (assignments.length === slotCount) {
          const slotIndex = assignments.findIndex(
            (participant) => participant.id === winnerId
          );

          if (slotIndex !== -1) {
            return slotIndex;
          }
        }
      }

      return participants.findIndex((participant) => participant.id === winnerId);
    };

    const winnerIndex = resolveWinnerIndex();

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
  }, [
    anglePerCard,
    isSpinning,
    participants,
    slotAssignments,
    slotCount,
    virtualizationActive,
    winnerId,
  ]);

  const radius = 320;
  const maxVisibleStep = slotCount > 7 ? 3 : slotCount / 2;
  const fadeWidthInSteps = slotCount > 7 ? 0.5 : 0;

  const cardsSource =
    virtualizationActive && slotAssignments.length === slotCount
      ? slotAssignments
      : virtualizationActive
      ? participants.slice(0, slotCount)
      : participants;

  const hiddenStateTemplate = useMemo(
    () =>
      virtualizationActive
        ? Array.from({ length: slotCount }, () => false)
        : [],
    [slotCount, virtualizationActive]
  );

  const currentHiddenStates = hiddenStateTemplate.slice();

  const cardElements = cardsSource.map((participant, slotIndex) => {
    const isActive = winnerId === participant.id && !isSpinning;
    const depth = radius + (isActive ? 30 : 0);
    let opacityValue = isActive ? 1 : 0.6;

    if (anglePerCard > 0) {
      const cardAngle = slotIndex * anglePerCard + rotation;
      let normalizedAngle = ((cardAngle % 360) + 360) % 360;
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

    if (virtualizationActive && slotIndex < currentHiddenStates.length) {
      currentHiddenStates[slotIndex] = isEffectivelyHidden;
    }

    return (
      <div
        key={virtualizationActive ? `slot-${slotIndex}` : participant.id}
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

  const hiddenSignature = virtualizationActive
    ? currentHiddenStates.map((value) => (value ? "1" : "0")).join("")
    : "";

  useEffect(() => {
    if (!virtualizationActive || totalParticipants === 0) {
      hiddenStateRef.current = virtualizationActive
        ? new Array(slotCount).fill(false)
        : [];
      return;
    }

    if (slotAssignmentsRef.current.length !== slotCount) {
      return;
    }

    const previousHidden = hiddenStateRef.current;
    const updatedAssignments = [...slotAssignmentsRef.current];
    const latestHiddenStates = currentHiddenStates;
    let hasChanges = false;

    for (let index = 0; index < slotCount; index += 1) {
      const wasHidden = previousHidden[index] ?? false;
      const isHidden = latestHiddenStates[index] ?? false;

      if (isHidden && !wasHidden) {
        const direction = rotationDirectionRef.current;

        if (direction === "forward") {
          const participantIndex = rangeEndRef.current;
          const participant = participants[participantIndex];

          if (participant) {
            updatedAssignments[index] = participant;
            rangeStartRef.current =
              (rangeStartRef.current + 1) % totalParticipants;
            rangeEndRef.current =
              (rangeEndRef.current + 1) % totalParticipants;
            hasChanges = true;
          }
        } else {
          rangeStartRef.current =
            (rangeStartRef.current - 1 + totalParticipants) %
            totalParticipants;
          rangeEndRef.current =
            (rangeEndRef.current - 1 + totalParticipants) % totalParticipants;

          const participantIndex = rangeStartRef.current;
          const participant = participants[participantIndex];

          if (participant) {
            updatedAssignments[index] = participant;
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      slotAssignmentsRef.current = updatedAssignments;
      setSlotAssignments(updatedAssignments);
    }

    hiddenStateRef.current = [...latestHiddenStates];
  }, [
    hiddenSignature,
    currentHiddenStates,
    participants,
    slotCount,
    totalParticipants,
    virtualizationActive,
  ]);

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
            transform: `rotateX(18deg) rotateY(${rotation}deg)`
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
