"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Video, Users, Plus, Loader2, Check, X } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Animations";

const upcomingMeetings = [
  { id: "1", title: "Mentoring React Avanzado", description: "Revisión de hooks personalizados, performance optimization y patrones avanzados", date: "2026-07-02", time: "3:00 PM", duration: 60, host: "System 777", attendees: 5, maxAttendees: 10, link: "https://zoom.us/j/system777", type: "mentoring" },
  { id: "2", title: "Revisión de Código Grupal", description: "Trae tu proyecto para que lo revisemos juntos", date: "2026-07-04", time: "7:00 PM", duration: 45, host: "System 777", attendees: 8, maxAttendees: 15, link: "https://zoom.us/j/system777", type: "review" },
  { id: "3", title: "Q&A Ciberseguridad", description: "Preguntas y respuestas sobre hacking ético y seguridad", date: "2026-07-05", time: "5:00 PM", duration: 30, host: "System 777", attendees: 12, maxAttendees: 20, link: "https://zoom.us/j/system777", type: "qa" },
  { id: "4", title: "Workshop: Deploy con Docker", description: "Taller práctico de containers y despliegue", date: "2026-07-08", time: "4:00 PM", duration: 90, host: "System 777", attendees: 3, maxAttendees: 10, link: "https://zoom.us/j/system777", type: "workshop" },
];

const pastMeetings = [
  { id: "5", title: "Intro a Next.js 15", date: "2026-06-25", time: "3:00 PM", duration: 45, attendees: 15, type: "mentoring" },
  { id: "6", title: "Revisión de CV Tech", date: "2026-06-22", time: "6:00 PM", duration: 30, attendees: 8, type: "review" },
];

export default function MeetingsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", description: "", date: "", time: "", duration: "30" });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [joinedMeetings, setJoinedMeetings] = useState<string[]>([]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });
      const data = await res.json();
      if (data.success) {
        setCreated(true);
        setTimeout(() => { setShowCreate(false); setCreated(false); }, 2000);
      }
    } catch {
      alert("Error al crear la reunión");
    } finally {
      setCreating(false);
    }
  };

  const joinMeeting = (id: string) => {
    setJoinedMeetings(prev => [...prev, id]);
    window.open("https://zoom.us/j/system777", "_blank");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mentoring": return { bg: "#00FF8810", text: "#00FF88", label: "Mentoring" };
      case "review": return { bg: "#00C8FF10", text: "#00C8FF", label: "Revisión" };
      case "qa": return { bg: "#7C3AED10", text: "#7C3AED", label: "Q&A" };
      case "workshop": return { bg: "#FFD93D10", text: "#FFD93D", label: "Workshop" };
      default: return { bg: "#00FF8810", text: "#00FF88", label: "Reunión" };
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold text-white">Reuniones y Zoom</h1>
              <p className="mt-2 text-gray-400">Sesiones en vivo con instructores premium</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]"
            >
              <Plus className="h-4 w-4" /> Nueva Reunión
            </button>
          </div>
        </FadeIn>

        {showCreate && (
          <FadeIn>
            <div className="glass rounded-2xl p-6 mb-8">
              {created ? (
                <div className="flex flex-col items-center py-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF88]/10">
                    <Check className="h-8 w-8 text-[#00FF88]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Reunión Creada!</h3>
                  <p className="text-sm text-gray-400 mt-2">Se ha enviado un email con los detalles</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Crear Reunión</h3>
                    <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Título</label>
                      <input type="text" value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Ej: Mentoring React" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Duración (min)</label>
                      <select value={newMeeting.duration} onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50">
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                        <option value="45">45 minutos</option>
                        <option value="60">1 hora</option>
                        <option value="90">1.5 horas</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Fecha</label>
                      <input type="date" value={newMeeting.date} onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">Hora</label>
                      <input type="time" value={newMeeting.time} onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm text-gray-400">Descripción</label>
                      <textarea value={newMeeting.description} onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })} rows={2} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 resize-none" placeholder="De qué trata esta reunión..." />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => setShowCreate(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-400 hover:bg-white/5">Cancelar</button>
                    <button onClick={handleCreate} disabled={creating || !newMeeting.title || !newMeeting.date || !newMeeting.time} className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-50">
                      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                      {creating ? "Creando..." : "Crear Reunión"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.1}>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6">Próximas Reuniones</h2>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {upcomingMeetings.map((meeting) => {
                const typeInfo = getTypeColor(meeting.type);
                const isJoined = joinedMeetings.includes(meeting.id);
                return (
                  <StaggerItem key={meeting.id}>
                    <div className="glass rounded-2xl p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: typeInfo.bg, color: typeInfo.text }}>
                          {typeInfo.label}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" /> {meeting.attendees}/{meeting.maxAttendees}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                      <p className="mt-2 flex-1 text-sm text-gray-400">{meeting.description}</p>
                      <div className="mt-4 space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#00FF88]" /> {new Date(meeting.date).toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}</div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#00FF88]" /> {meeting.time} · {meeting.duration} min</div>
                        <div className="flex items-center gap-2"><Video className="h-4 w-4 text-[#00FF88]" /> Zoom</div>
                      </div>
                      <button
                        onClick={() => joinMeeting(meeting.id)}
                        className={`mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                          isJoined
                            ? "bg-[#00FF88]/10 text-[#00FF88]"
                            : "bg-[#00FF88] text-black hover:bg-[#00CC6A]"
                        }`}
                      >
                        {isJoined ? <><Check className="h-4 w-4" /> Unido</> : <><Video className="h-4 w-4" /> Unirse</>}
                      </button>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Reuniones Pasadas</h2>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => {
                return (
                  <div key={meeting.id} className="glass flex items-center justify-between rounded-xl px-6 py-4 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-500">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{meeting.title}</div>
                        <div className="text-xs text-gray-500">{meeting.date} · {meeting.time} · {meeting.duration}min · {meeting.attendees} asistentes</div>
                      </div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs text-gray-500 bg-white/5">Finalizada</span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
