import type { Metadata } from "next";
import PageMain from "./PageMain";

const baseTitle = "SorteZapp | Sorteios Rápidos e Automáticos pelo WhatsApp";
const baseDescription =
  "Sorteios concierge via WhatsApp que captam leads qualificados, entregam dados higienizados e prova social para impulsionar vendas.";

export const metadata: Metadata = {
  title: baseTitle,
  description: baseDescription,
  keywords: [
    "SorteZapp",
    "sorteio no WhatsApp",
    "captar leads",
    "inteligência de dados",
    "automação humanizada",
    "marketing com sorteio",
    "concierge de sorteios",
    "qualificação de leads",
  ],
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    title: baseTitle,
    description: baseDescription,
    url: "https://sortezapp.com/",
    siteName: "SorteZapp",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: baseDescription,
  },
};

export default function Home() {
  return <PageMain />;
}
