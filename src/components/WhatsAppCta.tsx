"use client";

import { whatsappLink } from "@/config/whatsappLink";
import { trackWhatsAppClick } from "@/utils/trackWhatsAppClick";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type WhatsAppCtaProps = {
  trackingId: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function WhatsAppCta({
  trackingId,
  children,
  className = "",
  variant = "primary",
  ...rest
}: WhatsAppCtaProps) {
  const baseStyles =
    variant === "outline"
      ? "text-center inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
      : "text-center inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-400/40 transition hover:-translate-y-1 hover:bg-emerald-300";

  return (
    <a
      {...rest}
      href={whatsappLink}
      onClick={(event) => {
        event.preventDefault();
        rest.onClick?.(event);
        trackWhatsAppClick(trackingId);
        setTimeout(() => {
          window.open(whatsappLink, "_blank", "noopener,noreferrer");
        }, 200);
      }}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${className}`.trim()}
    >
      {children}
    </a>
  );
}
