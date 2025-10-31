"use client";

import { useMemo } from "react";

interface ConfettiOverlayProps {
  isVisible: boolean;
  seed: number;
}

type Piece = {
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  background: string;
};

export function ConfettiOverlay({ isVisible, seed }: ConfettiOverlayProps) {
  const pieces = useMemo<Piece[]>(() => {
    const random = mulberry32(seed);
    return Array.from({ length: 120 }, () => ({
      left: random(),
      delay: random() * 1.5,
      duration: 3 + random() * 2,
      rotation: random() * 360,
      background: `linear-gradient(135deg, ${pickColor(random)} 0%, ${pickColor(random)} 100%)`,
    }));
  }, [seed]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${piece.left * 100}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            background: piece.background,
          }}
        />
      ))}
    </div>
  );
}

function pickColor(random: () => number) {
  const palette = ["#4ade80", "#60a5fa", "#f97316", "#f472b6", "#a855f7", "#facc15"];
  return palette[Math.floor(random() * palette.length)];
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default ConfettiOverlay;
