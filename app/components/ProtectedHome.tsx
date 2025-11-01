"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { signOut } from "next-auth/react";

import { Carousel3D } from "./Carousel3D";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { FloatingParticipants } from "./FloatingParticipants";
import type { Participant } from "./types";

const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    name: "Marina Alves",
    gender: "female",
    comment: "Amo começar o dia com um espresso bem encorpado!",
    rating: 5,
  },
  {
    id: "2",
    name: "Lucas Ribeiro",
    gender: "male",
    comment: "Latte com canela é meu ritual da tarde.",
    rating: 4,
  },
  {
    id: "3",
    name: "Sofia Martins",
    gender: "female",
    comment: "Cold brew geladinho salva o verão!",
    rating: 5,
  },
  {
    id: "4",
    name: "Pedro Carvalho",
    gender: "male",
    comment: "Cappuccino com notas de chocolate é imbatível.",
    rating: 5,
  },
  {
    id: "5",
    name: "Bianca Lima",
    gender: "female",
    comment: "Filtro coado na V60 é meu momento zen.",
    rating: 4,
  },
  {
    id: "6",
    name: "Rafael Nunes",
    gender: "male",
    comment: "Affogato é a sobremesa perfeita.",
    rating: 5,
  },
  {
    id: "7",
    name: "Camila Duarte",
    gender: "female",
    comment: "Macchiato com leite vegetal é o meu favorito.",
    rating: 4,
  },
  {
    id: "8",
    name: "Henrique Costa",
    gender: "male",
    comment: "Café passado na prensa francesa tem outro sabor.",
    rating: 5,
  },
  {
    id: "9",
    name: "111111",
    gender: "male",
    comment: "Affogato é a sobremesa perfeita.",
    rating: 5,
  },
  {
    id: "10",
    name: "2222222",
    gender: "female",
    comment: "Macchiato com leite vegetal é o meu favorito.",
    rating: 4,
  },
  {
    id: "11",
    name: "33333333",
    gender: "male",
    comment: "Café passado na prensa francesa tem outro sabor.",
    rating: 5,
  },
  {
    id: "12",
    name: "444444444",
    gender: "male",
    comment: "Café passado na prensa francesa tem outro sabor.",
    rating: 5,
  },
];

const PRESELECTED_WINNER_ID = "4";
const SPIN_DURATION = 10000;

export function ProtectedHome() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));
  const [hasResult, setHasResult] = useState(false);
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [isCloudConverging, setIsCloudConverging] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const spinTimeout = useRef<NodeJS.Timeout | null>(null);
  const revealTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS);
    }, 800);

    const winnerTimeout = setTimeout(() => {
      setWinnerId(PRESELECTED_WINNER_ID);
    }, 1600);

    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(winnerTimeout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (spinTimeout.current) {
        clearTimeout(spinTimeout.current);
      }
      if (revealTimeout.current) {
        clearTimeout(revealTimeout.current);
      }
    };
  }, []);

  const winner = useMemo(
    () => participants.find((person) => person.id === winnerId) ?? null,
    [participants, winnerId],
  );

  const isButtonDisabled = isSpinning || !participants.length || !winnerId;

  const shouldShowCloud =
    (!hasIntroPlayed && participants.length > 0) || isCloudConverging;

  const handleReset = () => {
    if (spinTimeout.current) {
      clearTimeout(spinTimeout.current);
      spinTimeout.current = null;
    }
    if (revealTimeout.current) {
      clearTimeout(revealTimeout.current);
      revealTimeout.current = null;
    }

    setIsSpinning(false);
    setShowConfetti(false);
    setHasResult(false);
    setIsCarouselVisible(false);
    setHasIntroPlayed(false);
    setIsCloudConverging(false);
    setSeed(Math.floor(Math.random() * 100000));
    setCarouselKey((previous) => previous + 1);
  };

  const handleStart = () => {
    if (isButtonDisabled) {
      return;
    }
    if (spinTimeout.current) {
      clearTimeout(spinTimeout.current);
    }

    setShowConfetti(false);
    setHasResult(false);
    setSeed(Math.floor(Math.random() * 100000));
    setIsSpinning(true);

    if (!hasIntroPlayed) {
      setIsCloudConverging(true);

      if (revealTimeout.current) {
        clearTimeout(revealTimeout.current);
      }

      revealTimeout.current = setTimeout(() => {
        setIsCloudConverging(false);
        setHasIntroPlayed(true);
        setIsCarouselVisible(true);
      }, 1100);
    } else {
      setIsCarouselVisible(true);
    }

    spinTimeout.current = setTimeout(() => {
      setIsSpinning(false);
      setHasResult(true);
      setShowConfetti(true);
    }, SPIN_DURATION);
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050816] text-white">
      <button
        type="button"
        onClick={handleLogout}
        className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:bg-white/15 hover:text-white"
      >
        Sair
      </button>

      <FloatingParticipants
        participants={participants}
        showCloud={shouldShowCloud}
        isSpinning={isSpinning}
        hasResult={hasResult}
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 pb-16 pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold md:text-6xl">Sorteio Interno</h1>
          <p className="mt-4 max-w-2xl text-balance text-white/70">
            Gire a roleta e descubra quem leva os prêmios especiais da semana!
            Este ambiente está protegido por autenticação para demonstração.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(14,116,144,0.2)] backdrop-blur">
            <Carousel3D
              key={carouselKey}
              participants={participants}
              winnerId={winnerId}
              isSpinning={isSpinning}
              seed={seed}
              isVisible={isCarouselVisible}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStart}
              disabled={isButtonDisabled}
              className="rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] transition hover:shadow-[0_20px_45px_rgba(59,130,246,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSpinning ? "Girando..." : "Iniciar Sorteio"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Resetar
            </button>
          </div>

          {hasResult && winner && (
            <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-center text-lg text-emerald-100 shadow-[0_10px_40px_rgba(16,185,129,0.25)]">
              🎉 Parabéns, {winner.name}! Você foi o vencedor do sorteio!
            </div>
          )}
        </div>
      </div>

      <ConfettiOverlay isActive={showConfetti} />
    </div>
  );
}
