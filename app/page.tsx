"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Carousel3D } from "./components/Carousel3D";
import { ConfettiOverlay } from "./components/ConfettiOverlay";
import { Participant } from "./components/types";

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
];

const PRESELECTED_WINNER_ID = "4";
const SPIN_DURATION = 10000;

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));
  const [hasResult, setHasResult] = useState(false);
  const spinTimeout = useRef<NodeJS.Timeout>();

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
    };
  }, []);

  const winner = useMemo(
    () => participants.find((person) => person.id === winnerId) ?? null,
    [participants, winnerId]
  );

  const isButtonDisabled = isSpinning || !participants.length || !winnerId;

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

    spinTimeout.current = setTimeout(() => {
      setIsSpinning(false);
      setHasResult(true);
      setShowConfetti(true);
    }, SPIN_DURATION);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <ConfettiOverlay isVisible={showConfetti} seed={seed} />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 pt-24">
        <header className="flex flex-col gap-6 text-center lg:text-left">
          <span className="mx-auto rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium uppercase tracking-[0.3em] text-white/70 lg:mx-0">
            Sorteio Premium de Café
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Prepare-se para descobrir quem leva o kit exclusivo.
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-zinc-300 lg:mx-0">
            Leads apaixonados por café responderam ao nosso WhatsApp com suas
            histórias aromáticas. Agora é hora de ver a roleta revelar o grande
            vencedor ao vivo.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-center">
            <button
              onClick={handleStart}
              disabled={isButtonDisabled}
              className="group relative flex items-center gap-3 rounded-full bg-white px-8 py-3 text-base font-medium text-slate-900 transition hover:shadow-[0_20px_60px_rgba(148,163,184,0.35)] disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:scale-105 group-hover:bg-slate-800">
                {isSpinning ? "⏳" : "▶"}
              </span>
              {isSpinning ? "Sorteio em andamento..." : "Iniciar Sorteio"}
            </button>
            <span className="text-sm text-white/60">
              {isSpinning
                ? "A roleta vai revelar o vencedor em instantes."
                : winner
                ? "Pronto para girar! O vencedor já foi escolhido pelo backend."
                : "Carregando participantes e resultado..."}
            </span>
          </div>
        </header>

        <section className="mt-16 flex flex-col items-center gap-10">
          <div className="w-full max-w-4xl">
            <Carousel3D
              participants={participants}
              isSpinning={isSpinning}
              winnerId={winnerId}
              spinDuration={SPIN_DURATION}
            />
          </div>

          {winner && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
                Vencedor Confirmado
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {hasResult
                  ? `${winner.name} levou o prêmio!`
                  : "Aguardando o resultado..."}
              </h2>
              <p className="max-w-2xl text-base text-zinc-300">
                {hasResult
                  ? `"${winner.comment}" — uma história que vale um brinde com o melhor café.`
                  : "Assim que a roleta parar, anunciaremos o vencedor escolhido pelo backend."}
              </p>
            </div>
          )}
        </section>
      </main>
      <footer className="relative z-10 flex w-full justify-center pb-10 text-xs text-white/40">
        Feito com Next.js, Tailwind CSS e uma pitada de magia do café.
      </footer>
    </div>
  );
}
