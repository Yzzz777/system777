import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Inicia sesión con Discord para acceder al dashboard de System 777.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
