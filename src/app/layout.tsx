import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemePicker from "@/components/ThemePicker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Ángel — Yzzz 777",
  description: "Portafolio personal de Ángel. Programación, ciberseguridad, proyectos y System 777.",
  keywords: ["Ángel", "Yzzz 777", "programación", "ciberseguridad", "portafolio", "System 777", "Discord bot"],
  openGraph: {
    title: "Ángel — Yzzz 777",
    description: "Programación, ciberseguridad, proyectos y System 777",
    url: "https://jrsystem7777.com",
    siteName: "Yzzz 777",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased" style={{ background: "var(--color-background, #0A0A0A)", color: "var(--color-text, #e5e7eb)" }}>
        <Providers>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
            <ThemePicker />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
