import { ReactNode } from "react";

interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthTemplate({ title, subtitle, children, footer }: AuthTemplateProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[12%] h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-rose-500/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(236,72,153,0.12),transparent_55%)]" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
            Bem-vindo
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-white md:text-4xl">{title}</h1>
          <p className="mt-3 text-base text-white/70 md:text-lg">{subtitle}</p>
        </div>

        <div className="relative rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-[0_35px_60px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-10">
          <div className="absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/15 via-white/8 to-white/5 opacity-90" />
          <div className="relative space-y-8">{children}</div>
        </div>

        <div className="mt-8 text-center text-sm text-white/60">{footer}</div>
      </div>
    </div>
  );
}

export default AuthTemplate;
