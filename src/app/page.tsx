import type { Metadata } from "next";
import PageMain from "./PageMain";

const baseTitle =
  "SorteZapp | Automação de Sorteios e Captação de Leads no WhatsApp";
const baseDescription =
  "Cansado de leads ruins? Use o SorteZapp para gerar leads qualificados através de sorteios virais no WhatsApp.";

export const metadata: Metadata = {
  title: baseTitle,
  description: baseDescription,
  keywords: [
    "SorteZapp",
    "sorteio no WhatsApp",
    "ferramenta de sorteio",
    "captar leads qualificados",
    "gerar leads WhatsApp",
    "inteligência de dados",
    "automação humanizada",
    "marketing de reciprocidade",
    "concierge de sorteios",
    "marketing com sorteio",
    "baixar CPL",
    "sistema de sorteio online",
    "estratégia de gamificação",
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
