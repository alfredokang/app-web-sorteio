"use client";

import { signOut } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Carousel3D } from "./components/Carousel3D";
import { ConfettiOverlay } from "./components/ConfettiOverlay";
import { FloatingParticipants } from "./components/FloatingParticipants";
import { Participant } from "./components/types";
import { firestore } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";

const SPIN_DURATION = 10000; // 10 segundos
const WEBHOOK_DELAY = 10000; // 10 segundos

export default function PageMain() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winnerParticipant, setWinnerParticipant] =
    useState<Participant | null>(null);
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
  const [reload, setReload] = useState(false);
  const [hasSentWebhook, setHasSentWebhook] = useState(false);

  // Carrega participantes do Firestore
  useEffect(() => {
    async function loadParticipants() {
      try {
        const colRef = collection(firestore, "participants");
        const q = query(colRef, where("chosen", "==", false));

        const snapshot = await getDocs(q);

        const participantsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Participant[];

        setParticipants(participantsData);
      } catch (error) {
        console.error("Erro ao carregar participantes:", error);
      }
    }

    setReload(false);

    loadParticipants();
  }, [reload]);

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

  // Envia o webhook automaticamente quando o sorteio finaliza e há um vencedor
  useEffect(() => {
    if (!hasResult || !winnerParticipant || hasSentWebhook) return;

    const delay = setTimeout(async () => {
      try {
        const response = await fetch(
          "https://webhook.mindbyte.com.br/webhook/envia-msg-vencedor",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(winnerParticipant),
          }
        );

        if (response.ok) {
          setHasSentWebhook(true);
        } else {
          console.error("Erro ao enviar webhook:", await response.text());
        }
      } catch (error) {
        console.error("Erro ao disparar webhook:", error);
      }
    }, WEBHOOK_DELAY); // dispara 10s após o confete aparecer

    return () => clearTimeout(delay);
  }, [hasResult, winnerParticipant, hasSentWebhook]);

  const isButtonDisabled = isSpinning || !participants.length;

  const shouldShowCloud =
    (!hasIntroPlayed && participants.length > 0) || isCloudConverging;

  const handleReset = () => {
    setReload(true);
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

  const handleStart = async () => {
    if (isButtonDisabled) return;

    // Reseta timeouts e estados
    if (spinTimeout.current) clearTimeout(spinTimeout.current);
    if (revealTimeout.current) clearTimeout(revealTimeout.current);

    setIsSpinning(true); // começa a girar IMEDIATAMENTE
    setShowConfetti(false);
    setHasResult(false);
    setSeed(Math.floor(Math.random() * 100000));
    setHasSentWebhook(false);

    try {
      // Chama a API de sorteio enquanto a roleta já está girando
      const response = await fetch(
        "https://webhook.mindbyte.com.br/webhook/sorteia-participante",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro na API:", data);
        alert(data.message || "Erro ao sortear participante.");
        setIsSpinning(false);
        return;
      }

      if (data) {
        const winnerData = data as Participant;
        setWinnerParticipant(winnerData);

        // Atualiza lista local (opcional)
        setParticipants((prev) => [
          ...prev.filter((p) => p.id !== winnerData.id),
          winnerData,
        ]);

        // Continua girando mais 10s APÓS receber o vencedor
        if (spinTimeout.current) clearTimeout(spinTimeout.current);
        spinTimeout.current = setTimeout(() => {
          setIsSpinning(false);
          setHasResult(true);
          setShowConfetti(true);
        }, 10000); // 10 segundos extras após o vencedor chegar
      }
    } catch (error) {
      console.error("Erro ao chamar webhook de sorteio:", error);
      setIsSpinning(false);
    }
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
    "cursor-pointer group relative flex items-center gap-3 rounded-full px-8 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed";
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
        className="absolute right-6 top-6 z-30 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition hover:bg-white/20 hover:text-white cursor-pointer"
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
                : participants
                ? "Pronto para girar! Vamos iniciar o sorteio"
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
                  winnerParticipant={winnerParticipant}
                  spinDuration={SPIN_DURATION}
                />
              </div>
              {participants.length > 0 ? (
                <FloatingParticipants
                  participants={participants}
                  isVisible={shouldShowCloud}
                  isConverging={isCloudConverging}
                />
              ) : (
                <div className="flex justify-center">
                  <span className="text-sm text-white/60">
                    Carregando participantes, aguarde...
                  </span>
                </div>
              )}
            </div>
          </div>

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
                ? `${winnerParticipant?.name?.formatFullName} levou o prêmio!`
                : isCarouselVisible
                ? "Aguardando o resultado..."
                : "Todos os participantes carregados"}
            </h2>
            <p className="max-w-2xl text-base text-zinc-300">
              {hasResult
                ? `${
                    winnerParticipant?.questionThree?.followUp
                      ? `${winnerParticipant.questionThree.followUp} — uma história que vale um brinde com o melhor café.`
                      : "Uma história que vale um brinde com o melhor café."
                  }`
                : isCarouselVisible
                ? "Assim que a roleta parar, anunciaremos o vencedor escolhido."
                : "Muito obrigado pela participação em nossa pesquisa e desejamos boa sorte a todos os participantes"}
            </p>
          </div>
        </section>
      </main>
      <footer className="relative z-10 flex w-full justify-center pb-10 text-xs text-white/40">
        Criado entre sorteios e goles de café — by SorteZapp.
      </footer>
    </div>
  );
}
