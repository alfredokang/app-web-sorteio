import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { WhatsAppCta } from "@/components/WhatsAppCta";

interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthTemplate({
  title,
  subtitle,
  children,
  footer,
}: AuthTemplateProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[12%] h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-lime-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(74,222,128,0.12),transparent_55%)]" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="mb-10 text-center">
          {/* <h1 className="text-5xl font-semibold font-sans text-blue-300">
            SorteZapp
          </h1> */}
          <div className="flex justify-center mb-10">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="SortZapp"
                width={330}
                height={330}
              />
            </Link>
          </div>
          {/* <p className="mb-10 text-md text-blue-200">
            Sorteios Rápidos e Automáticos pelo WhatsApp
          </p> */}
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
            Bem-vindo
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base text-white/70 md:text-lg">{subtitle}</p>
        </div>

        <div className="relative rounded-4xl border border-white/15 bg-white/10 p-8 shadow-[0_35px_60px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-10">
          <div className="absolute inset-0 rounded-4xl border border-white/10 bg-linear-to-br from-white/15 via-white/8 to-white/5 opacity-90" />
          <div className="relative space-y-8">{children}</div>
        </div>

        <div className="mt-8 text-center text-sm text-white/60">{footer}</div>
        <div className="mt-15 text-center">
          <span className="text-white/70 font-semibold block">
            Aumente suas vendas com sorteios automáticos. Chama no Zapp!
          </span>
          <WhatsAppCta
            trackingId="header-desktop"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:scale-105 hover:bg-emerald-300 mt-3 inline-flex"
          >
            Fale com a gente
          </WhatsAppCta>
        </div>
      </div>
    </div>
  );
}

export default AuthTemplate;
