import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemePicker from "@/components/ThemePicker";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Ángel — Yzzz 777 · Developer, Systems & Cybersecurity",
    template: "%s · Yzzz 777",
  },
  description:
    "Portafolio personal de Ángel (Yzzz 777): desarrollo web, sistemas, Linux y ciberseguridad aplicada. Creador de System 777, bot de Discord con moderación, protección e infraestructura propia.",
  keywords: [
    "Yzzz 777",
    "Ángel",
    "portafolio",
    "desarrollador",
    "Next.js",
    "Linux",
    "ciberseguridad",
    "System 777",
    "Discord bot",
  ],
  authors: [{ name: "Ángel — Yzzz 777", url: siteConfig.url }],
  creator: "Ángel — Yzzz 777",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    siteName: "Yzzz 777",
    title: "Ángel — Yzzz 777 · Developer, Systems & Cybersecurity",
    description:
      "Desarrollo web, sistemas, Linux y ciberseguridad aplicada. Creador de System 777.",
    images: [{ url: "/angel.webp", width: 432, height: 576, alt: "Ángel — Yzzz 777" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ángel — Yzzz 777",
    description: "Developer · Systems · Cybersecurity. Creador de System 777.",
    images: ["/angel.webp"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Providers>
          <ThemeProvider>
            <ScrollProgress />
            <Navbar />
            <main id="contenido" className="pt-16">
              {children}
            </main>
            <Footer />
            <ThemePicker />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
