"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import { Participant } from "./types";

interface Carousel3DProps {
  participants: Participant[];
  isSpinning: boolean;
  winnerParticipant: Participant | null;
  spinDuration: number;
}

interface PositionedCard {
  participant: Participant;
  angle: number;
  radius: number;
  depth: number;
  scale: number;
  x: number;
  y: number;
  z: number;
}

export function Carousel3D({
  participants,
  isSpinning,
  winnerParticipant,
  spinDuration,
}: Carousel3DProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isArcLayout, setIsArcLayout] = useState(false);
  const rotationRef = useRef(rotation);
  const targetRotationRef = useRef(rotation);
  const animationFrameRef = useRef<number | null>(null);

  const cards = useMemo(() => {
    if (!participants.length) {
      return [];
    }

    const radius = participants.length < 8 ? 280 : 360;
    const cardAngle = 360 / participants.length;

    return participants.map<PositionedCard>((participant, index) => {
      const baseAngle = index * cardAngle;
      const angleInRadians = (baseAngle * Math.PI) / 180;
      const depth = Math.sin(angleInRadians);
      const scale = 0.75 + 0.25 * (depth + 1) * 0.5;
      const offsetRadius = radius * (0.7 + depth * 0.3);

      return {
        participant,
        angle: baseAngle,
        radius: offsetRadius,
        depth,
        scale,
        x: Math.cos(angleInRadians) * offsetRadius,
        y: Math.sin(angleInRadians) * offsetRadius * 0.2,
        z: depth * 200,
      };
    });
  }, [participants]);

  useEffect(() => {
    setIsArcLayout(participants.length < 4);
  }, [participants.length]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    const targetParticipant = winnerParticipant ?? participants[0];

    if (!targetParticipant) {
      return;
    }

    const targetIndex = participants.findIndex(
      (participant) => participant.id === targetParticipant.id,
    );

    if (targetIndex === -1) {
      return;
    }

    const targetAngle = targetIndex * (360 / participants.length);
    targetRotationRef.current = isArcLayout ? 0 : -targetAngle;
    setActiveCardId(targetParticipant.id);
  }, [participants, winnerParticipant, isArcLayout]);

  useEffect(() => {
    if (!participants.length) {
      return undefined;
    }

    let startRotation = rotationRef.current;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easing = 1 - Math.pow(1 - progress, 3);

      const targetRotation = targetRotationRef.current;
      const nextRotation =
        startRotation + (targetRotation - startRotation) * easing;

      setRotation(nextRotation);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isSpinning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      startRotation = rotationRef.current;
      startTime = null;
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, spinDuration, participants.length]);

  useEffect(() => {
    if (!isSpinning && !isInitialized && participants.length) {
      setIsInitialized(true);
    }
  }, [isSpinning, isInitialized, participants.length]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <div className="absolute inset-0 rounded-[48px] bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-black/80 blur-3xl" />
      <div
        className="relative flex h-full w-full items-center justify-center mt-40 mb-13"
        style={{ perspective: "1200px" }}
      >
        <div
          className={`relative flex h-[620px] w-full max-w-[900px] items-center justify-center transition-all duration-1000 ease-out ${
            isInitialized ? "opacity-100 translate-y-0" : "translate-y-8 opacity-0"
          }`}
          style={{ transform: `rotateX(18deg)` }}
        >
          <div
            className={`absolute inset-0 rounded-full border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-white/0 blur-3xl transition-opacity duration-700 ${
              isSpinning ? "opacity-80" : "opacity-40"
            }`}
          />
          <div className="absolute inset-0 rounded-full bg-black/40 blur-3xl" />
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div className="absolute inset-[60px] rounded-full border border-white/5" />
          <div className="absolute inset-[140px] rounded-full border border-white/5" />

          <div
            className="relative h-[480px] w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex h-1 w-1 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `rotateZ(0deg) translateZ(-240px)` }}
            >
              <span className="animate-ping rounded-full bg-emerald-400/60" />
            </div>

            <div
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `rotateZ(${rotation}deg)` }}
            >
              {cards.map((card) => {
                const isActive = activeCardId === card.participant.id;
                const isHovered = hoveredCardId === card.participant.id;
                const depthFactor = (card.depth + 1) / 2;
                const cardScale = isHovered ? card.scale + 0.08 : card.scale;

                const transform = isArcLayout
                  ? `translate3d(${card.x * 0.9}px, ${
                      card.y + (isHovered ? -20 : 0)
                    }px, ${card.z}px)`
                  : `rotateY(${card.angle}deg) translateZ(${card.radius}px) translateY(${card.y}px)`;

                return (
                  <div
                    key={card.participant.id}
                    className={`absolute left-1/2 top-1/2 h-[300px] w-[220px] -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity,filter] duration-700 ease-out ${
                      isArcLayout ? "origin-bottom" : "origin-center"
                    } ${
                      isActive
                        ? "z-20 opacity-100"
                        : `z-10 opacity-${Math.max(30, Math.round(40 + depthFactor * 40))}`
                    }`}
                    style={{
                      transform,
                      transformStyle: "preserve-3d",
                      transitionDelay: isArcLayout ? `${Math.abs(card.depth) * 120}ms` : undefined,
                    }}
                    onMouseEnter={() => setHoveredCardId(card.participant.id)}
                    onMouseLeave={() => setHoveredCardId((previous) =>
                      previous === card.participant.id ? null : previous,
                    )}
                  >
                    <div
                      className={`transform-gpu transition-[transform,filter] duration-500 ${
                        isHovered ? "scale-[1.06]" : `scale-[${cardScale}]`
                      } ${isActive ? "drop-shadow-[0_20px_45px_rgba(16,185,129,0.45)]" : "drop-shadow-[0_12px_25px_rgba(2,6,23,0.45)]"}`}
                    >
                      <Card participant={card.participant} isActive={isActive} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-[48px] border border-white/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[48px] bg-linear-to-br from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export default Carousel3D;
