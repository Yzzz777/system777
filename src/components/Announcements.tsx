"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, AlertCircle, Shield, Star, Clock, Users, Lock, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { FadeIn, FadeInUp, GlowPulse } from "@/components/ui/Animations";

const announcements = [
  { id: 1, title: "Nueva actualización del bot System 777", content: "Se han añadido 9 sistemas de whitelist granular. Más información en /whitelist", type: "success" },
  { id: 2, title: "Mantenimiento programado", content: "El domingo 20 de octubre, 20:00-22:00 UTC. Servicios disponibles con interrupciones menores", type: "warning" },
  { id: 3, title: "Nuevo plan Pro disponible", content: "Recursos ilimitados y sesiones de mentoría incluidos. $29.99/mes", type: "info" },
  { id: 4, title: "Parche de seguridad crítico", content: "Actualización urgente de seguridad aplicada. Recomendamos actualizar el bot", type: "critical" },
  { id: 5, title: "Nuevo curso de Linux añadido", content: "Academia Linux ahora tiene 35 cursos prácticos. ¡Empieza hoy!", type: "success" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
};

const typeStyles: Record<string, { bg: string; color: string; icon: string }> = {
  success: { bg: "#00FF88", color: "black", icon: "CheckCircle" },
  warning: { bg: "#FEE75C", color: "black", icon: "AlertCircle" },
  info: { bg: "#7C3AED", color: "white", icon: "Info" },
  critical: { bg: "#FF6B6B", color: "white", icon: "AlertTriangle" },
};

export default function AnnouncementsPage() {
  const [announcementsList, setAnnouncementsList] = useState(announcements);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Anuncios</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Avisos y actualizaciones importantes
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 space-y-4">
          {announcementsList.map((ann) => {
            const style = typeStyles[ann.type] || typeStyles.info;
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: announcementsList.indexOf(ann) * 0.1 }}
                className={`glass rounded-2xl p-6 border-l-4 ${style.bg}/50`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <motion.span
                      className={`h-6 w-6 rounded-full ${style.bg}`}
                    >
                      {React.createElement(iconMap[style.icon] || AlertCircle, { className: `h-6 w-6 text-${style.color}` })}
                    </motion.span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{ann.title}</h3>
                    <p className="mt-2 text-gray-300 line-clamp-3">{ann.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}