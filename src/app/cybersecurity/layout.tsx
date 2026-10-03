import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity",
  description: "Áreas de seguridad con nivel honesto: anti-raid, automod y monitoreo en producción; autenticación, hardening y red en práctica/estudio.",
  alternates: { canonical: "/cybersecurity" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
