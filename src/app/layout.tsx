import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SorteZapp | Sorteios Rápidos e Automáticos pelo WhatsApp",
  description:
    "Realize sorteios automáticos e transparentes pelo WhatsApp com o SorteZapp. Prático, seguro e divertido — ideal para promoções, rifas e eventos.",
  keywords: [
    "sorteio whatsapp",
    "sorteios automáticos",
    "sorteio online",
    "rifas",
    "SorteZapp",
    "sorteio via WhatsApp",
    "sorteios automáticos",
  ],
  openGraph: {
    title: "SorteZapp | Sorteios Rápidos e Automáticos pelo WhatsApp",
    description:
      "Realize sorteios automáticos e transparentes pelo WhatsApp com o SorteZapp. Prático, seguro e divertido — ideal para promoções, rifas e eventos.",
    url: "https://www.sortezapp.com",
    siteName: "SorteZapp",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/web-app-manifest-192x192.png", // coloque sua imagem aqui
        width: 1200,
        height: 630,
      },
    ],
  },
  metadataBase: new URL("https://www.sortezapp.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
