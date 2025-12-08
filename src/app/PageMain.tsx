"use client";

import { WhatsAppCta } from "@/components/WhatsAppCta";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const comparisonBlocks = [
  {
    title: "Marketing de Interrupção",
    subtitle: "O VELHO JEITO",
    description:
      "Você tenta vender para quem não pediu. O cliente se sente incomodado, ignora o seu anúncio e sua marca perde prestígio.",
    icon: "📣",
    tone: "from-black/80 to-slate-900/60",
  },
  {
    title: "Marketing de Reciprocidade",
    subtitle: "O JEITO SORTEZAPP",
    description:
      "Você oferece um prêmio desejado. O cliente entra os dados feliz em troca da chance de ganhar. Resultado: Um lead grato e aberto a ouvir você.",
    icon: "🤝",
    tone: "from-emerald-600/80 to-emerald-400/50",
  },
];

const executionPillars = [
  {
    title: "O Dia do Sorteio",
    description:
      "Acompanhamento profissional no momento da ação. Garantia técnica de que tudo vai rodar liso.",
    icon: "🗓️",
  },
  {
    title: "Experiência 360º",
    description:
      "Suporte garantido tanto para o empresário quanto para garantir que a experiência do participante no WhatsApp seja fluida e sem falhas.",
    icon: "🧭",
  },
  {
    title: "Tecnologia + Cuidado Humano",
    description:
      "Combinamos o melhor da automação com o toque pessoal que faz a diferença.",
    icon: "💚",
  },
];

const intelligenceDeliverables = [
  {
    title: "Relatório de Marketing com Análise Gráfica",
    description:
      "Insights detalhados sobre o comportamento do público. Entenda quem respondeu, o que respondeu e por quê.",
    icon: "📊",
  },
  {
    title: "Planilha de Contatos Higienizada e Organizada",
    description:
      "Todos os dados organizados, validados e prontos para ação. Sem duplicatas, sem ruído.",
    icon: "🗂️",
  },
  {
    title: "Arquivo Compatível com CRM",
    description:
      "Integração direta com seu CRM favorito para começar a vender imediatamente.",
    icon: "🔗",
  },
];

const conciergeHighlights = [
  {
    title: "Engenharia de Perguntas",
    description:
      "Nosso especialista estuda seu nicho e cria o fluxo conversacional perfeito para garimpar as informações que você realmente precisa.",
    extra:
      "Benefício: o empresário não perde tempo configurando, nem erra na estratégia.",
    icon: "⚙️",
  },
  {
    title: "Suporte Dedicado",
    description:
      "Você não está sozinho. Temos especialistas prontos para orientar cada passo.",
    icon: "👨‍💼",
  },
];

const attentionCrisis = [
  {
    title: "Fadiga de Anúncios",
    description:
      "Seu público está saturado. As pessoas ignoram propagandas e seguem rolando o feed.",
    icon: "⚠️",
  },
  {
    title: "Leads Desqualificados",
    description:
      "Você paga caro por cliques, mas recebe contatos que nunca vão comprar. Tempo e dinheiro desperdiçados.",
    icon: "📉",
  },
  {
    title: "CPL em Alta",
    description:
      "O custo por lead (CPL) não para de subir enquanto a qualidade dos contatos despenca.",
    icon: "💸",
  },
  {
    title: "Falta de Engajamento",
    description:
      "Seu público não interage com suas campanhas. Como furar essa bolha de atenção?",
    icon: "🎯",
  },
];

const finaleBullets = [
  "Conteúdo viral para redes sociais.",
  "Prova de legitimidade do processo.",
  "Aumento de autoridade da marca.",
  "Engajamento orgânico.",
];

const easyModeBullets = [
  "Você não configura nada.",
  "Nós cuidamos de tudo.",
  "Você vende mais!",
];

const heroStats = [
  { value: "4x", label: "Leads mais qualificados" },
  { value: "98%", label: "Participantes satisfeitos" },
  { value: "63%", label: "Aceitação de notificações pós sorteio" },
];

const heroCarouselSlides = [
  {
    image: "/images/foto-sorteio-um.png",
    alt: "Tela do sorteio com todos os participantes carregados",
    badge: "Preparação",
    title: "Todos os participantes carregados",
    description:
      "Momento inicial em que o SorteZapp valida cada lead e deixa tudo pronto para girar.",
  },
  {
    image: "/images/sorteio-sendo-realizado.png",
    alt: "Visual do sorteio em processamento aguardando resultado",
    badge: "Processando",
    title: "Aguardando o resultado",
    description:
      "A roleta entra em ação, garantindo transparência e auditabilidade em tempo real.",
  },
  {
    image: "/images/sorteio-ganhador.png",
    alt: "Confirmação do vencedor com destaque para o prêmio",
    badge: "Vencedor confirmado",
    title: "Resultado entregue",
    description:
      "Comunicação instantânea do ganhador com relatório auditável para compartilhar com o público.",
  },
];

const faqItems = [
  {
    question: "Como vocês garantem a segurança dos dados dos participantes?",
    answer:
      "Seguimos rigorosamente a LGPD. Todos os dados são criptografados, armazenados no Brasil e trafegam apenas pela API oficial do WhatsApp, garantindo conformidade total.",
  },
  {
    question: "O sorteio é realmente transparente e auditável?",
    answer:
      "Sim! Entregamos animação em tempo real para gravar e postar, além de certificado digital com timestamp e hash único para comprovar o ganhador.",
  },
  {
    question: "Preciso ter conhecimento técnico para usar a plataforma?",
    answer:
      "Não. Nosso serviço concierge cuida de tudo: estratégia, engenharia de perguntas, configuração técnica e acompanhamento no dia do sorteio.",
  },
  {
    question: "Como funciona a integração com WhatsApp?",
    answer:
      "Utilizamos exclusivamente a API Oficial do WhatsApp Business, garantindo segurança, conformidade e alta entregabilidade, sem risco de banimento.",
  },
  {
    question: "Posso integrar os leads capturados com meu CRM?",
    answer:
      "Sim. Exportamos CSV/Excel compatíveis para você utilizar nos CRMs (RD, HubSpot, Pipedrive etc) que sejam de sua preferência.",
  },
  {
    question: "E se eu tiver dúvidas durante o processo?",
    answer:
      "Você conta com suporte humanizado em todas as etapas. Nossa equipe acompanha do planejamento ao pós-sorteio para garantir uma experiência 360º.",
  },
];

const navItems = [
  //   { label: "Início", href: "#hero" },
  { label: "Estratégia", href: "#estrategia" },
  { label: "Execução", href: "#execucao" },
  { label: "Inteligência", href: "#inteligencia" },
  { label: "Concierge", href: "#concierge" },
  //   { label: "Gran Finale", href: "#prova" },
  { label: "Diagnóstico", href: "#diagnostico" },
];

function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function PageMain() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const currentYear = new Date().getFullYear();
  const { ref: heroRef, visible: heroVisible } = useReveal<HTMLElement>();
  const { ref: strategyRef, visible: strategyVisible } =
    useReveal<HTMLElement>();
  const { ref: executionRef, visible: executionVisible } =
    useReveal<HTMLElement>();
  const { ref: intelligenceRef, visible: intelligenceVisible } =
    useReveal<HTMLElement>();
  const { ref: conciergeRef, visible: conciergeVisible } =
    useReveal<HTMLElement>();
  const { ref: finaleRef, visible: finaleVisible } = useReveal<HTMLElement>();
  const { ref: faqRef, visible: faqVisible } = useReveal<HTMLElement>();
  const { ref: diagnosticRef, visible: diagnosticVisible } =
    useReveal<HTMLElement>();
  const heroSlidesCount = heroCarouselSlides.length;
  const activeHeroSlide = heroCarouselSlides[heroCarouselIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroCarouselIndex((prevIndex) => (prevIndex + 1) % heroSlidesCount);
    }, 4000); // tempo maior entre cada slide para leitura confortável

    return () => window.clearInterval(timer);
  }, [heroSlidesCount]);

  return (
    <main className="text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#010a07cc] px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between items-center gap-4">
          {/* <div className="text-lg font-semibold text-white">SorteZapp</div> */}
          <Image
            src="/images/logo2.png"
            alt="SorteZapp"
            width={200}
            height={200}
          />
          <nav className="hidden flex-1 items-center text-sm text-slate-200 md:flex">
            <ul className="flex flex-1 items-center gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-full px-3 py-1 transition hover:bg-emerald-400/20 hover:text-emerald-100 font-semibold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white"
            >
              Entrar
            </a>
            <WhatsAppCta
              trackingId="header-desktop"
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Fale com a gente
            </WhatsAppCta>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`inline-flex items-center justify-center text-xl leading-none ${
                menuOpen ? "" : "-translate-y-[2px]"
              }`}
            >
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        <div className={`md:hidden ${menuOpen ? "mt-4 space-y-4" : "hidden"}`}>
          <nav className="flex flex-col gap-2 text-sm text-slate-100">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-3">
            <a
              href="/login"
              className="rounded-full border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-white"
              onClick={() => setMenuOpen(false)}
            >
              Entrar
            </a>
            <WhatsAppCta
              trackingId="header-mobile"
              className="rounded-full bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
              onClick={() => setMenuOpen(false)}
            >
              Fale com a gente
            </WhatsAppCta>
          </div>
        </div>
      </header>
      <div className="relative isolate overflow-hidden px-4 pb-20 pt-10 sm:px-6 lg:px-0">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-emerald-950/80 via-emerald-900/70 to-black" />
        <div className="absolute -left-32 top-28 -z-10 h-64 w-64 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="absolute right-0 top-96 -z-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-[140px]" />

        <section
          id="hero"
          ref={heroRef}
          className={`scroll-mt-32 mx-auto grid max-w-6xl gap-12 rounded-[40px] border border-white/5 bg-white/5 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-700 lg:grid-cols-[1.05fr,0.95fr] lg:p-12 ${
            heroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-medium uppercase tracking-wide text-emerald-100">
              SorteZapp • Sorteios por WhatsApp
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                SorteZapp: Sorteios Rápidos e Automáticos pelo WhatsApp
              </h1>
              <p className="text-lg text-slate-200 sm:text-xl">
                A solução completa para criar, conduzir e validar sorteios pelo
                WhatsApp — com automação, inteligência de dados e transparência
                total.
              </p>
            </div>
            <ul className="space-y-3 text-base text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/30 text-emerald-100">
                  ●
                </span>
                Fluxo de perguntas inteligente e sorteio transparente em tempo
                real pelo WhatsApp.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/30 text-emerald-100">
                  ●
                </span>
                Dados higienizados e prontos para ativar seu CRM ou próxima
                campanha de vendas.
              </li>
            </ul>
            <div className="flex flex-col gap-4 sm:flex-row">
              <WhatsAppCta
                trackingId="hero-primary"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-base font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
              >
                Quero meu próximo sorteio
              </WhatsAppCta>
              <WhatsAppCta
                trackingId="hero-secondary"
                variant="outline"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold"
              >
                Solicite uma demonstração
              </WhatsAppCta>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 right-4 hidden h-16 w-16 rounded-full bg-emerald-400/40 blur-3xl sm:block" />
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-emerald-800/30 to-emerald-600/30 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
              <div className="space-y-6">
                {/* <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-emerald-200">
                      Próximo sorteio
                    </p>
                    <p className="text-lg font-semibold text-white">
                      LeadStorm Network
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-300">08</p>
                    <p className="text-xs uppercase text-slate-400">Dezembro</p>
                  </div>
                </div> */}
                {/* <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    Fluxo Conversacional
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Fluxo de perguntas inteligente e personalizado, validando os dados dos participantes em tempo real.",
                      "Sorteio transparente, automatizado e auditável, realizado diretamente pelo WhatsApp.",
                      "Relatório completo + análise por IA, com insights acionáveis para decisões rápidas.",
                      "CSV com todos os leads higienizados, pronto para importar no seu CRM, automação ou time comercial.",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                      >
                        <div className="flex items-center gap-3 text-sm text-slate-200">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200">
                            {index + 1}
                          </span>
                          {step}
                        </div>
                        <span className="text-xs text-emerald-200">OK</span>
                      </div>
                    ))}
                  </div>
                </div> */}
                <div className="grid grid-cols-1 gap-3 text-left text-sm sm:grid-cols-3 sm:text-center">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    Experiência visual SorteZapp
                  </p>
                  <div
                    className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#010a07]"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    {heroCarouselSlides.map((slide, index) => (
                      <div
                        key={slide.image}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          index === heroCarouselIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          sizes="(min-width: 1024px) 520px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
                      {activeHeroSlide.badge}
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {activeHeroSlide.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {activeHeroSlide.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {heroCarouselSlides.map((_, index) => (
                      <span
                        key={`hero-indicator-${index}`}
                        className={`h-1.5 w-6 rounded-full transition ${
                          index === heroCarouselIndex
                            ? "bg-emerald-400"
                            : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="estrategia"
          ref={strategyRef}
          className={`scroll-mt-32 mx-auto mt-16 max-w-6xl space-y-8 transition-all duration-700 ${
            strategyVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Estratégia
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              O Poder da Reciprocidade
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {comparisonBlocks.map((block) => (
              <div
                key={block.title}
                className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${block.tone} p-6 shadow-[0_25px_90px_rgba(2,6,23,0.55)]`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-3">
                    <span className="h-12 w-1 rounded-full bg-gradient-to-b from-emerald-300/70 to-transparent" />
                    <span className="text-2xl">{block.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                      {block.subtitle}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">
                      {block.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-base text-slate-200">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row">
            <WhatsAppCta
              trackingId="strategy-primary"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Quero aplicar essa estratégia
            </WhatsAppCta>
            {/* <WhatsAppCta
              trackingId="strategy-secondary"
              variant="outline"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold"
            >
              Ver entregáveis de dados
            </WhatsAppCta> */}
          </div>
        </section>

        <section
          id="execucao"
          ref={executionRef}
          className={`scroll-mt-32 mx-auto mt-20 max-w-6xl rounded-[32px] border border-white/5 bg-emerald-950/50 p-10 shadow-[0_35px_120px_rgba(0,0,0,0.45)] transition-all duration-700 ${
            executionVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <header className="space-y-3 text-left">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Operação
            </p>
            <h2 className="text-3xl font-semibold">
              Execução Impecável e Suporte Humanizado
            </h2>
          </header>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {executionPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
                  Pilar 0{index + 1}
                </p>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{pillar.title}</h3>
                  <span className="text-2xl">{pillar.icon}</span>
                </div>
                <p className="text-sm text-slate-300">{pillar.description}</p>
                <div className="mt-auto h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row">
            <WhatsAppCta
              trackingId="execution-primary"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Quero suporte do concierge
            </WhatsAppCta>
            <a
              href="#faq"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-100"
            >
              Ver perguntas frequentes
            </a>
          </div>
        </section>

        <section
          id="inteligencia"
          ref={intelligenceRef}
          className={`scroll-mt-32 mx-auto mt-20 max-w-6xl space-y-8 transition-all duration-700 ${
            intelligenceVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Inteligência
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Inteligência de Negócios: O Que Você Recebe
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {intelligenceDeliverables.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-emerald-200">
                  <span>Entregável 0{index + 1}</span>
                  <span className="text-base tracking-normal">{item.icon}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {item.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-emerald-200">
                  <span className="h-px w-8 bg-emerald-400/60" />
                  Pronto para ativar
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row">
            <WhatsAppCta
              trackingId="intelligence-primary"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Receber uma amostra do relatório
            </WhatsAppCta>
            <WhatsAppCta
              trackingId="intelligence-secondary"
              variant="outline"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold"
            >
              Entender o serviço completo
            </WhatsAppCta>
          </div>
        </section>

        <section
          id="concierge"
          ref={conciergeRef}
          className={`scroll-mt-32 mx-auto mt-20 max-w-6xl grid gap-8 transition-all duration-700 lg:grid-cols-[1.05fr,0.95fr] ${
            conciergeVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="rounded-[38px] bg-transparent pb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Concierge
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Mais que uma Ferramenta: Um Serviço Concierge
            </h2>
            <p className="mt-4 text-base text-slate-200">
              Não entregamos uma ferramenta para você se virar sozinho. Nós
              fazemos por você.
            </p>
            <div className="mt-8 space-y-6">
              {conciergeHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-[28px] border border-white/10 bg-transparent p-6"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-emerald-200">
                    <span>Concierge ativo</span>
                    <span className="text-lg tracking-normal">
                      {highlight.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {highlight.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300">
                    {highlight.description}
                  </p>
                  {highlight.extra && (
                    <p className="mt-2 text-sm font-medium text-emerald-200">
                      {highlight.extra}
                    </p>
                  )}
                  <div className="mt-5 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                </div>
              ))}
            </div>
            <WhatsAppCta
              trackingId="concierge-primary"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-base font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Quero um especialista cuidando do meu sorteio
            </WhatsAppCta>
          </div>
          <div className="rounded-[38px] border border-white/5 bg-slate-950/80 p-10">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Mercado
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              ❌ Você esta gastando muito para ser ignorado
            </h2>
            <p className="mt-4 text-base text-slate-200">
              É preciso entregar experiências novas para conquistar atenção
              real. As estratégias antigas não funcionam mais: feeds saturados,
              anúncios iguais e um público imune a promessas vazias. Pare de
              interromper o seu cliente e comece a atraí-lo de verdade.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {attentionCrisis.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/5 via-emerald-500/5 to-transparent p-6 shadow-[0_25px_90px_rgba(0,0,0,0.35)]"
                >
                  <div className="inline-flex items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-base text-emerald-200">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {item.description}
                  </p>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-emerald-400/40 to-transparent" />
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row">
              <WhatsAppCta
                trackingId="market-primary"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
              >
                Quero resolver isto agora
              </WhatsAppCta>
              {/* <WhatsAppCta
                trackingId="market-secondary"
                variant="outline"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold"
              >
                Quero resolver isto agora
              </WhatsAppCta> */}
            </div>
          </div>
        </section>

        <section
          id="prova"
          ref={finaleRef}
          className={`scroll-mt-32 mx-auto mt-20 max-w-6xl grid items-center gap-10 rounded-[38px] border border-white/5 bg-white/5 p-10 transition-all duration-700 lg:grid-cols-2 ${
            finaleVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Prova Social
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              O Gran Finale: Prova Social e Transparência
            </h2>
            <p className="mt-4 text-base text-slate-200">
              A ferramenta gera uma animação bonita do sorteio que serve como
              conteúdo para redes sociais. Isso gera autoridade e prova a
              idoneidade do processo. Seus clientes veem que o sorteio é
              legítimo e transparente.
            </p>
            <ul className="mt-6 space-y-3 text-base text-slate-200">
              {finaleBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-3 inline-flex h-[2px] w-8 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500" />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row">
              <WhatsAppCta
                trackingId="prova-primary"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
              >
                Quero gerar essa prova social
              </WhatsAppCta>
              <WhatsAppCta
                trackingId="prova-secondary"
                variant="outline"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold"
              >
                Ver como funciona
              </WhatsAppCta>
            </div>
          </div>
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-emerald-600/50 via-emerald-400/20 to-emerald-300/10 blur-3xl" />
            <div className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/90 via-emerald-900/50 to-emerald-700/30 p-2 shadow-[0_45px_140px_rgba(0,0,0,0.55)]">
              {/* <div className="space-y-4">
                {heroStats.map((stat) => (
                  <div
                    key={`finale-${stat.label}`}
                    className="rounded-2xl border border-white/5 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Indicador
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-300">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div> */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16 / 16" }}
                >
                  <Image
                    src="/images/sorteio-ganhador.png"
                    alt="Mock da animação final do SorteZapp"
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              {/* <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                Conteúdo pronto para viralizar, com gráficos, números e todos os
                elementos visuais que reforçam a confiança do sorteio.
              </div> */}
            </div>
          </div>
        </section>

        <section
          id="faq"
          ref={faqRef}
          className={`scroll-mt-32 mx-auto mt-20 max-w-4xl space-y-6 transition-all duration-700 ${
            faqVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <header className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Perguntas que mais recebemos antes do diagnóstico
            </h2>
          </header>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.question}
                  className="rounded-3xl border border-white/10 bg-white/5"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 px-6 py-4 text-left"
                    onClick={() =>
                      setOpenFaq((prev) => (prev === index ? null : index))
                    }
                  >
                    <div>
                      {/* <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
                        FAQ 0{index + 1}
                      </p> */}
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {item.question}
                      </h3>
                    </div>
                    <span className="text-2xl text-emerald-300">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/10 px-6 py-4 text-sm text-slate-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <WhatsAppCta
              trackingId="faq-primary"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-base font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300"
            >
              Ainda ficou dúvida? Chame nosso time
            </WhatsAppCta>
          </div>
        </section>

        <section
          id="diagnostico"
          ref={diagnosticRef}
          className={`scroll-mt-32 mx-auto mt-24 max-w-6xl grid gap-10 rounded-[42px] border border-white/5 bg-emerald-950/80 p-10 transition-all duration-700 lg:grid-cols-[1.05fr,0.95fr] ${
            diagnosticVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
              Sem complicação
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Deixe a Parte Chata com a Gente
            </h2>
            <p className="mt-4 text-base text-slate-200">
              Deixe a parte chata e técnica com a SorteZapp e foque apenas em
              vender para os leads qualificados que vamos te entregar.
            </p>
            <div className="mt-8 space-y-4">
              {easyModeBullets.map((bullet) => (
                <div
                  key={bullet}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  {/* <span className="inline-flex h-[2px] w-8 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500" /> */}
                  <p className="text-base font-medium text-white">
                    <span className="mr-2 text-emerald-300">✓</span>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-slate-300">
              Vamos entender seus desafios e mostrar como o SorteZapp pode
              transformar sua captação de leads.
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">
                Próximo passo
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Agende uma Reunião de Diagnóstico para Seu Próximo Sorteio
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Escolha seu melhor horário, receba um plano de ação e saia da
                call com o cronograma pronto para lançar.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <WhatsAppCta
                trackingId="diagnostico-primary"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-emerald-400 px-8 py-4 text-base font-semibold text-emerald-950 transition hover:scale-[1.02] hover:bg-emerald-300"
              >
                <span role="img" aria-hidden>
                  💬
                </span>
                Falar com um especialista agora
              </WhatsAppCta>
              <a
                href="mailto:contato@sortezapp.com"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                <span role="img" aria-hidden>
                  ✉️
                </span>
                Quero receber o plano por e-mail
              </a>
            </div>
          </div>
        </section>
        <footer className="font-semibold mx-auto mt-16 flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-6 text-center text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} SorteZapp. Todos os direitos reservados.</p>
          <p>
            Contato:
            <a
              href="mailto:contato@sortezapp.com"
              className="ml-1 text-emerald-200 underline-offset-4 hover:underline"
            >
              contato@sortezapp.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
