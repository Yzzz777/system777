import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "System 777, jrsystem7777.com, YZ Terminal, IP Tracker y AutoMod: código, estructura real y estados verificados.",
  alternates: { canonical: "/projects" },
};

export default function SegmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
