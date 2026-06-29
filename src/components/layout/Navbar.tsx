"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Terminal, LogOut, User, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { siteConfig, navLinks } from "@/lib/config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-lg shadow-black/20" : "border-transparent bg-[#0A0A0A]/50 backdrop-blur-sm"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00FF88]/10">
            <Terminal className="h-4 w-4 text-[#00FF88]" />
          </motion.div>
          <span className="bg-gradient-to-r from-[#00FF88] to-[#00C8FF] bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href={link.href} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                {link.label}
                {link.children && (
                  <motion.div animate={{ rotate: activeDropdown === link.label ? 180 : 0 }}>
                    <ChevronDown className="h-3 w-3" />
                  </motion.div>
                )}
              </Link>
              <AnimatePresence>
                {link.children && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-white/10 bg-[#121212] p-2 shadow-2xl"
                  >
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00FF88]/20 text-xs font-bold text-[#00FF88]">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">{session.user?.name || session.user?.email}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#121212] p-2 shadow-2xl"
                  >
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                      <LayoutDashboard className="h-4 w-4" /> Panel
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                      <User className="h-4 w-4" /> Mi Cuenta
                    </Link>
                    {session.user?.role === "OWNER" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#00FF88] hover:bg-white/5">
                        <Terminal className="h-4 w-4" /> Admin
                      </Link>
                    )}
                    <hr className="my-1 border-white/10" />
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/5">
                      <LogOut className="h-4 w-4" /> Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:text-white">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="rounded-lg bg-[#00FF88] px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">
                Registrarse
              </Link>
            </>
          )}
        </div>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-300 hover:bg-white/5 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#0A0A0A] px-4 py-4 md:hidden"
          >
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                  {link.label}
                </Link>
                {link.children?.map((child) => (
                  <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="block rounded-lg px-6 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-300">Panel</Link>
                  {session.user?.role === "OWNER" && (
                    <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-[#00FF88]">Admin</Link>
                  )}
                  <button onClick={() => { signOut(); setOpen(false); }} className="rounded-lg px-3 py-2 text-left text-sm text-red-400">Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-300">Iniciar Sesión</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="rounded-lg bg-[#00FF88] px-3 py-2 text-center text-sm font-semibold text-black">Registrarse</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
