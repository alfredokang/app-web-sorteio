"use client";

import { signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Carousel3D } from "./components/Carousel3D";
import { ConfettiOverlay } from "./components/ConfettiOverlay";
import { FloatingParticipants } from "./components/FloatingParticipants";
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

export default function PageMain() {
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
    [participants, winnerId]
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

  const isResetAvailable = hasResult && !isSpinning;
  const buttonAction = isResetAvailable ? handleReset : handleStart;
  const buttonLabel = isSpinning
    ? "Sorteio em andamento..."
    : isResetAvailable
    ? "Realizar Novo Sorteio"
    : "Iniciar Sorteio";
  const buttonIcon = isSpinning ? "⏳" : isResetAvailable ? "↺" : "▶";
  const baseButtonClasses =
    "group relative flex items-center gap-3 rounded-full px-8 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed";
  const buttonClassName = [
    baseButtonClasses,
    isResetAvailable
      ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-slate-900 shadow-[0_22px_60px_rgba(16,185,129,0.35)] hover:shadow-[0_28px_80px_rgba(6,182,212,0.45)] disabled:opacity-60 disabled:shadow-none"
      : "bg-white/95 text-slate-900 hover:shadow-[0_20px_60px_rgba(148,163,184,0.35)] disabled:bg-white/20 disabled:text-white/50 disabled:shadow-none",
  ].join(" ");
  const buttonIconClassName = [
    "flex h-9 w-9 items-center justify-center rounded-full text-lg transition duration-300 group-hover:scale-110",
    isSpinning
      ? "bg-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.45)]"
      : isResetAvailable
      ? "bg-white/90 text-slate-900 shadow-[0_14px_30px_rgba(16,185,129,0.35)] group-hover:bg-white"
      : "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.4)] group-hover:bg-slate-800",
  ].join(" ");
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <button
        type="button"
        onClick={handleLogout}
        className="absolute right-6 top-6 z-30 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white"
      >
        Sair
      </button>
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
              type="button"
              onClick={buttonAction}
              disabled={isButtonDisabled}
              className={buttonClassName}
            >
              <span className={buttonIconClassName}>{buttonIcon}</span>
              {buttonLabel}
            </button>
            <span className="text-sm text-white/60">
              {isSpinning
                ? "A roleta vai revelar o vencedor em instantes."
                : isResetAvailable
                ? "Sorteio concluído! Clique para reiniciar a magia e girar novamente."
                : winner
                ? "Pronto para girar! O vencedor já foi escolhido pelo backend."
                : "Carregando participantes e resultado..."}
            </span>
          </div>
        </header>

        <section className="mt-16 flex flex-col items-center gap-10">
          <div className="w-full max-w-4xl">
            <div className="relative w-full min-h-[420px]">
              <div
                className={`h-full w-full transition-all duration-700 ease-out ${
                  isCarouselVisible
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-6"
                }`}
              >
                <Carousel3D
                  key={carouselKey}
                  participants={participants}
                  isSpinning={isSpinning}
                  winnerId={winnerId}
                  spinDuration={SPIN_DURATION}
                />
              </div>

              <FloatingParticipants
                participants={participants}
                isVisible={shouldShowCloud}
                isConverging={isCloudConverging}
              />
            </div>
          </div>

          {winner && (
            <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
                {hasResult
                  ? "Vencedor Confirmado"
                  : isCarouselVisible
                  ? "Processando"
                  : "Tudo pronto para o sorteio"}
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {hasResult
                  ? `${winner.name} levou o prêmio!`
                  : isCarouselVisible
                  ? "Aguardando o resultado..."
                  : "Todos os participantes carregados"}
              </h2>
              <p className="max-w-2xl text-base text-zinc-300">
                {hasResult
                  ? `"${winner.comment}" — uma história que vale um brinde com o melhor café.`
                  : isCarouselVisible
                  ? "Assim que a roleta parar, anunciaremos o vencedor escolhido."
                  : "Muito obrigado pela participação em nossa pesquisa e desejamos boa sorte a todos os participantes"}
              </p>
            </div>
          )}
        </section>
      </main>
      <footer className="relative z-10 flex w-full justify-center pb-10 text-xs text-white/40">
        Criado entre sorteios e goles de café — by SorteZapp.
      </footer>
    </div>
  );
}
