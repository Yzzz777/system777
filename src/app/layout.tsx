import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Providers from "@/components/Providers";
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
  title: "SYSTEM 777 - Academia Tecnológica Profesional",
  description: "Domina Programación, Ciberseguridad, Linux y Desarrollo Discord. Aprende con proyectos prácticos, cursos premium y una comunidad activa.",
  keywords: ["programación", "ciberseguridad", "linux", "discord", "desarrollo web", "academia"],
  openGraph: {
    title: "SYSTEM 777 - Academia Tecnológica Profesional",
    description: "Domina Programación, Ciberseguridad, Linux y Desarrollo Discord",
    url: "https://jrsystem7777.com",
    siteName: "SYSTEM 777",
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
      <body className="min-h-screen bg-[#0A0A0A] text-gray-300 antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
