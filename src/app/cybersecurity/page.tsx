"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Wifi, Search, Bug, FileWarning, Network, Fingerprint, Cpu, Key } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale, GlowPulse } from "@/components/ui/Animations";

const areas = [
  { icon: Shield, title: "Anti-Phishing", desc: "Deteccion y bloqueo automatico de intentos de phishing en Discord y web.", color: "#00FF88" },
  { icon: Lock, title: "Proteccion de Servidores", desc: "Anti-raid, anti-nuke, auto-mod y whitelist configurable para servidores.", color: "#5865F2" },
  { icon: Eye, title: "Monitoreo de Amenazas", desc: "VPS monitor, deteccion de IPs sospechosas y alertas en tiempo real.", color: "#00C8FF" },
  { icon: Bug, title: "Testing de Seguridad", desc: "Auditorias de vulnerabilidades, testing de penetracion y hardening.", color: "#ED4245" },
  { icon: Server, title: "Hardening de Servidores", desc: "Configuracion segura de Ubuntu, firewalls, SSH y servicios.", color: "#7C3AED" },
  { icon: Network, title: "Seguridad de Red", desc: "Analisis de puertos, configuracion de firewalls y segmentacion.", color: "#EB459E" },
  { icon: Fingerprint, title: "OSINT Defensivo", desc: "Inteligencia abierta para identificar amenazas y vulnerabilidades.", color: "#FF6B6B" },
  { icon: FileWarning, title: "Deteccion de Alts", desc: "Sistema anti-alt para detectar cuentas alternativas en servidores.", color: "#FEE75C" },
  { icon: Wifi, title: "Seguridad WiFi", desc: "Auditorias de redes inalambricas, WPA cracking y proteccion.", color: "#FF8C42" },
  { icon: Search, title: "Analisis Forense", desc: "Investigacion digital, recovery de datos y analisis de evidencia.", color: "#57F287" },
  { icon: Cpu, title: "Automatizacion", desc: "Scripts de seguridad, automatizacion de respuestas y herramientas custom.", color: "#00C8FF" },
  { icon: Key, title: "Autenticacion", desc: "OAuth, JWT, MFA y sistemas de autenticacion seguros.", color: "#9B59B6" },
];

const tools = [
  { name: "Nmap", desc: "Scanner de puertos y servicios", cat: "Recon" },
  { name: "Wireshark", desc: "Analisis de trafico de red", cat: "Analisis" },
  { name: "Burp Suite", desc: "Testing de aplicaciones web", cat: "Web" },
  { name: "Metasploit", desc: "Framework de exploits", cat: "Exploit" },
  { name: "John the Ripper", desc: "Cracking de contrasenas", cat: "Crypto" },
  { name: "Hashcat", desc: "GPU password cracking", cat: "Crypto" },
  { name: "Nikto", desc: "Scanner de vulnerabilidades web", cat: "Web" },
  { name: "SQLMap", desc: "Automatizacion de SQL injection", cat: "Web" },
  { name: "Aircrack-ng", desc: "Auditoria WiFi", cat: "Red" },
  { name: "Gobuster", desc: "Fuzzing de directorios", cat: "Recon" },
  { name: "Hydra", desc: "Brute force de credenciales", cat: "Fuerza bruta" },
  { name: "OSINT Framework", desc: "Recopilacion de inteligencia", cat: "OSINT" },
];

const catColors: Record<string, string> = {
  Recon: "#00FF88",
  Analisis: "#00C8FF",
  Web: "#5865F2",
  Exploit: "#ED4245",
  Crypto: "#FEE75C",
  Red: "#EB459E",
  "Fuerza bruta": "#FF6B6B",
  OSINT: "#7C3AED",
};

export default function CybersecurityPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Cybersecurity</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Proteccion, deteccion y respuesta ante amenazas digitales</p>
          </div>
        </FadeIn>

        {/* Areas */}
        <FadeIn delay={0.1}>
          <h2 className="mt-16 mb-8 text-2xl font-bold text-white">Areas de Especializacion</h2>
        </FadeIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas.map((a) => (
            <StaggerItem key={a.title}>
              <HoverScale>
                <div className="glass rounded-2xl p-6 h-full">
                  <motion.div whileHover={{ rotate: 5 }} className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: a.color + "15" }}>
                    <a.icon className="h-6 w-6" style={{ color: a.color }} />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{a.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{a.desc}</p>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tools */}
        <FadeIn delay={0.2}>
          <h2 className="mt-16 mb-8 text-2xl font-bold text-white">Herramientas</h2>
        </FadeIn>
        <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <StaggerItem key={t.name}>
              <div className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: catColors[t.cat] }} />
                <div>
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
                </div>
                <div className="ml-auto text-xs rounded-full px-2 py-0.5" style={{ backgroundColor: catColors[t.cat] + "15", color: catColors[t.cat] }}>
                  {t.cat}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-20">
            <GlowPulse className="rounded-3xl">
              <div className="glass rounded-3xl p-10 text-center">
                <h3 className="text-2xl font-bold text-white">System 777 — Proteccion Integrada</h3>
                <p className="mx-auto mt-3 max-w-xl text-gray-400">El bot incluye anti-phishing, anti-alt, VPS monitor y alertas de seguridad automaticas.</p>
              </div>
            </GlowPulse>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
