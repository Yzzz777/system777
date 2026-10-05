import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Control",
  description:
    "Panel de control de System 777: permisos de roles, moderación, protección, logs, tickets, economía y ajustes por servidor de Discord.",
  alternates: { canonical: "/bot/dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
