"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg hover:border-[var(--color-primary)]/30 transition-colors"
        style={{ color: "var(--color-primary)" }}
      >
        <Palette className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-4 bottom-20 z-50 w-80 max-h-[80vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-white/5 bg-[#121212] p-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#00FF88]" />
                  <h3 className="font-semibold text-white">Temas</h3>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-white/5 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 space-y-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all ${
                      currentTheme.id === theme.id
                        ? "bg-white/10 border border-white/10"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: theme.colors.primary + "20" }}>
                      {theme.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">{theme.name}</div>
                      <div className="flex gap-1 mt-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.background }} />
                      </div>
                    </div>
                    {currentTheme.id === theme.id && (
                      <Check className="h-4 w-4 text-[#00FF88]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/5 p-4">
                <p className="text-xs text-gray-500 text-center">Tu tema se guarda automáticamente</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
