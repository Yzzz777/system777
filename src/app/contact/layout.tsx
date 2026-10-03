import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbeme por Discord o usa el formulario: el mensaje llega directo al owner del sitio.",
  alternates: { canonical: "/contact" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
