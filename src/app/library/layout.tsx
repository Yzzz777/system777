import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Repositorios, referencia de comandos y páginas públicas de System 777 y de este portafolio.",
  alternates: { canonical: "/library" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
