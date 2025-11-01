"use client";

import { CSSProperties, useMemo } from "react";
import { Participant } from "./types";

interface FloatingParticipantsProps {
  participants: Participant[];
  isVisible: boolean;
  isConverging: boolean;
}

interface ParticipantLayout {
  participant: Participant;
  translateX: number;
  translateY: number;
  floatX: number;
  floatY: number;
  delay: number;
  duration: number;
  scale: number;
  scaleMid: number;
  rotation: number;
  hue: number;
  opacity: number;
  zIndex: number;
}

const stringToSeed = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }

  return hash;
};

const randomFromSeed = (seed: number) => {
  const result = Math.sin(seed) * 10000;
  return result - Math.floor(result);
};

const randomInRange = (seed: number, min: number, max: number) => {
  return min + randomFromSeed(seed) * (max - min);
};

export function FloatingParticipants({
  participants,
  isVisible,
  isConverging,
}: FloatingParticipantsProps) {
  const layouts = useMemo(() => {
    return participants.map<ParticipantLayout>((participant, index) => {
      const baseSeed = stringToSeed(`${participant.id}-${participant.name}`) + index;
      const translateX = randomInRange(baseSeed + 1, -240, 240);
      const translateY = randomInRange(baseSeed + 2, -180, 200);
      const floatX = randomInRange(baseSeed + 3, 16, 60);
      const floatY = randomInRange(baseSeed + 4, 24, 70);
      const delay = randomInRange(baseSeed + 5, 0, 6);
      const duration = randomInRange(baseSeed + 6, 6, 14);
      const scale = randomInRange(baseSeed + 7, 0.65, 0.95);
      const scaleMid = scale + randomInRange(baseSeed + 8, 0.05, 0.12);
      const rotation = randomInRange(baseSeed + 9, -12, 12);
      const hue = randomInRange(baseSeed + 10, 180, 320);
      const opacity = randomInRange(baseSeed + 11, 0.55, 0.95);
      const zIndex = Math.round(randomInRange(baseSeed + 12, 10, 60));

      return {
        participant,
        translateX,
        translateY,
        floatX,
        floatY,
        delay,
        duration,
        scale,
        scaleMid,
        rotation,
        hue,
        opacity,
        zIndex,
      };
    });
  }, [participants]);

  if (!participants.length || (!isVisible && !isConverging)) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible transition-opacity duration-700 ease-out ${
        isVisible || isConverging ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <div className="relative h-full w-full">
        {layouts.map(({ participant, ...layout }) => {
          const style: CSSProperties & Record<string, string | number> = {
            "--translate-x": `${layout.translateX}px`,
            "--translate-y": `${layout.translateY}px`,
            "--float-x": `${layout.floatX}px`,
            "--float-y": `${layout.floatY}px`,
            "--float-delay": `${layout.delay}s`,
            "--float-duration": `${layout.duration}s`,
            "--scale": layout.scale.toFixed(2),
            "--scale-mid": layout.scaleMid.toFixed(2),
            "--rotate": `${layout.rotation}deg`,
            "--hue": layout.hue.toFixed(0),
            "--initial-opacity": layout.opacity.toFixed(2),
            zIndex: layout.zIndex,
          };

          return (
            <div
              key={participant.id}
              className="floating-card"
              data-converging={isConverging}
              style={style}
            >
              <div className="floating-card-inner">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-[11px] font-semibold text-white/80">
                    {participant.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium text-white/90">
                      {participant.name}
                    </span>
                    <span className="truncate text-[10px] text-white/60">
                      {participant.comment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FloatingParticipants;
