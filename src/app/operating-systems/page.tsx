"use client";

import { useState } from "react";
import { ExternalLink, Monitor, Cpu } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const distros = [
  { name: "Ubuntu", desc: "La distribución Linux más popular para escritorios y servidores. Basada en Debian con enfoque en usabilidad.", features: ["Gestor de Paquetes APT", "Escritorio GNOME", "Versiones LTS", "Gran Comunidad"], official: "https://ubuntu.com", color: "#E95420" },
  { name: "Debian", desc: "El sistema operativo universal conocido por su estabilidad. Base para muchas otras distribuciones.", features: ["Gestor de Paquetes APT", "Enfoque en Estabilidad", "Software Libre", "30+ Arquitecturas"], official: "https://debian.org", color: "#A80030" },
  { name: "Fedora", desc: "Plataforma innovadora respaldada por Red Hat. Tecnología de vanguardia y liderazgo de código abierto.", features: ["Gestor de Paquetes DNF", "SELinux", "Soporte Flatpak", "Display Wayland"], official: "https://fedora.org", color: "#294172" },
  { name: "Arch Linux", desc: "Distribución simple y ligera para usuarios avanzados. Modelo de lanzamiento continuo.", features: ["Gestor Pacman", "Repositorio AUR", "Lanzamiento Continuo", "Filosofía DIY"], official: "https://archlinux.org", color: "#1793D1" },
  { name: "Kali Linux", desc: "Distribución para pruebas de penetración y auditoría de seguridad por Offensive Security.", features: ["600+ Herramientas de Seguridad", "Frameworks Pre-instalados", "Kernel Personalizado", "Modo Forense"], official: "https://kali.org", color: "#557C94" },
  { name: "Linux Mint", desc: "Distribución elegante y moderna basada en Ubuntu. Ideal para principiantes en Linux.", features: ["Escritorio Cinnamon", "Amigable al Usuario", "Soporte Multimedia", "Gestor de Software"], official: "https://linuxmint.com", color: "#87A541" },
  { name: "Rocky Linux", desc: "Sistema operativo empresarial impulsado por la comunidad. Reemplazo de CentOS.", features: ["Compatible con RHEL", "Preparado para Empresas", "Soporte a Largo Plazo", "Gratis"], official: "https://rockylinux.org", color: "#10B981" },
  { name: "AlmaLinux", desc: "Distribución empresarial de propiedad comunitaria. Binariamente compatible con RHEL.", features: ["Compatible con RHEL", "Preparado para Empresas", "Lanzamientos Rápidos", "Imágenes Cloud"], official: "https://almalinux.org", color: "#000000" },
  { name: "OpenSUSE", desc: "Distribución versátil con excelente herramienta de configuración YaST.", features: ["Centro de Control YaST", "Snapshots Btrfs", "Tumbleweed Rolling", "Leap Estable"], official: "https://opensuse.org", color: "#73BA25" },
  { name: "Manjaro", desc: "Distribución amigable basada en Arch Linux. Ideal para principiantes en Arch.", features: ["Basado en Arch", "Instalador GUI", "Múltiples DEs", "Detección de Hardware"], official: "https://manjaro.org", color: "#33BF8E" },
  { name: "Pop!_OS", desc: "Distribución basada en Ubuntu por System76. Optimizada para productividad y gaming.", features: ["Mosaico Automático", "Soporte NVIDIA", "UI Moderna", "Tienda de Apps"], official: "https://pop.system76.com", color: "#48B9C7" },
  { name: "Zorin OS", desc: "Distribución basada en Ubuntu diseñada para usuarios de Windows/macOS.", features: ["Diseño tipo Windows", "Soporte Wine", "Tienda de Software", "Amigable al Usuario"], official: "https://zorin.com", color: "#0075D2" },
];

const windowsVersions = [
  { name: "Windows 7", year: "2009", status: "Fin de Vida", features: ["UI Aero", "DirectX 11", "BitLocker", "Windows Media Center"], requirements: "CPU 1 GHz, 1 GB RAM, 16 GB Almacenamiento" },
  { name: "Windows 8.1", year: "2013", status: "Fin de Vida", features: ["UI Moderna", "Apps Snap", "Windows Store", "Inicio Mejorado"], requirements: "CPU 1 GHz, 2 GB RAM, 20 GB Almacenamiento" },
  { name: "Windows 10", year: "2015", status: "Soportado (EOL Oct 2025)", features: ["Cortana", "Escritorios Virtuales", "WSL", "DirectX 12", "Windows Hello"], requirements: "CPU 1 GHz, 4 GB RAM, 64 GB Almacenamiento" },
  { name: "Windows 11 Pro", year: "2021", status: "Activo", features: ["UI Rediseñada", "Snap Layouts", "Integración Teams", "Apps Android", "TPM 2.0"], requirements: "CPU 1 GHz, 4 GB RAM, 64 GB Almacenamiento, TPM 2.0, UEFI" },
];

export default function OperatingSystemsPage() {
  const [activeTab, setActiveTab] = useState<"linux" | "windows">("linux");

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF88]/10"><Monitor className="h-6 w-6 text-[#00FF88]" /></div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Hub de Sistemas Operativos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Guía completa de distribuciones Linux y versiones de Windows</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => setActiveTab("linux")} className={`rounded-xl px-6 py-3 text-sm font-medium transition-colors ${activeTab === "linux" ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:text-white"}`}>Distribuciones Linux</button>
            <button onClick={() => setActiveTab("windows")} className={`rounded-xl px-6 py-3 text-sm font-medium transition-colors ${activeTab === "windows" ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:text-white"}`}>Colección Windows</button>
          </div>
        </FadeIn>

        {activeTab === "linux" && (
          <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {distros.map((d) => (
              <StaggerItem key={d.name}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: d.color + "20", border: `2px solid ${d.color}40` }} />
                      <div><h3 className="text-lg font-bold text-white">{d.name}</h3><div className="text-xs text-gray-500">Distribución Linux</div></div>
                    </div>
                    <p className="mt-3 text-sm text-gray-400 line-clamp-2">{d.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{d.features.map((f) => <span key={f} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{f}</span>)}</div>
                    <div className="mt-4">
                      <a href={d.official} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 w-fit">
                        <ExternalLink className="h-3 w-3" /> Sitio Oficial
                      </a>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {activeTab === "windows" && (
          <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2">
            {windowsVersions.map((w) => (
              <StaggerItem key={w.name}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C8FF]/10"><Cpu className="h-5 w-5 text-[#00C8FF]" /></div>
                        <div><h3 className="text-lg font-bold text-white">{w.name}</h3><div className="text-xs text-gray-500">Lanzado en {w.year}</div></div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${w.status === "Activo" ? "bg-[#00FF88]/10 text-[#00FF88]" : w.status.includes("EOL") ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>{w.status}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">{w.features.map((f) => <span key={f} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{f}</span>)}</div>
                    <div className="mt-3 text-xs text-gray-500"><strong>Requisitos:</strong> {w.requirements}</div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
