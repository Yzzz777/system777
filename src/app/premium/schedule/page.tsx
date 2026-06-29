"use client";

import { useState } from "react";
import { Calendar, Clock, Video, Check, ArrowLeft, ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/Animations";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM",
  "07:00 PM", "08:00 PM", "09:00 PM",
];

const topics = [
  "Revisión de código y proyectos",
  "Duda sobre curso premium",
  "Sesión de mentoring personalizado",
  "Revisión de curriculum / CV tech",
  "Preparación para entrevista técnica",
  "Orientación de carrera tech",
  "Revisión de proyecto final",
  "Q&A general de programación",
];

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function SchedulePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const days = generateCalendarDays(currentYear, currentMonth);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const isDayDisabled = (day: number | null) => {
    if (!day) return true;
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart || date.getDay() === 0;
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/premium/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
          time: selectedTime,
          topic: selectedTopic,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooked(true);
      } else {
        alert(data.error || "Error al agendar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <FadeIn>
          <div className="glass rounded-3xl p-12 max-w-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF88]/10">
              <Check className="h-8 w-8 text-[#00FF88]" />
            </div>
            <h1 className="text-3xl font-bold text-white">Clase Agendada!</h1>
            <p className="mt-4 text-gray-400">
              Tu sesión de Zoom ha sido agendada para el <span className="text-white font-medium">{selectedDate} de {monthNames[currentMonth]} de {currentYear}</span> a las <span className="text-white font-medium">{selectedTime}</span>.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Recibirás un correo con el enlace de Zoom y los detalles de la sesión.
            </p>
            <div className="mt-6 rounded-xl bg-[#00FF88]/5 p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#00FF88]" /><span className="text-gray-400">Fecha:</span> <span className="text-white">{selectedDate} de {monthNames[currentMonth]} {currentYear}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#00FF88]" /><span className="text-gray-400">Hora:</span> <span className="text-white">{selectedTime}</span></div>
                <div className="flex items-center gap-2"><Video className="h-4 w-4 text-[#00FF88]" /><span className="text-gray-400">Plataforma:</span> <span className="text-white">Zoom</span></div>
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-[#00FF88]" /><span className="text-gray-400">Instructor:</span> <span className="text-white">System 777</span></div>
              </div>
            </div>
            <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
              Ir al Dashboard
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FF88]/10">
              <Video className="h-7 w-7 text-[#00FF88]" />
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Agendar Clase por Zoom</h1>
            <p className="mt-3 text-gray-400">Exclusivo para usuarios Premium. Sesión 1-a-1 con un instructor.</p>
          </div>
        </FadeIn>

        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s ? "bg-[#00FF88] text-black" : "bg-white/5 text-gray-500"
              }`}>{s}</div>
              {s < 3 && <div className={`h-0.5 w-12 ${step > s ? "bg-[#00FF88]" : "bg-white/5"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <FadeIn>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">{monthNames[currentMonth]} {currentYear}</h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={nextMonth} className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                    <div key={d} className="py-2 text-center text-xs font-medium text-gray-500">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => (
                    <button
                      key={i}
                      disabled={isDayDisabled(day)}
                      onClick={() => day && setSelectedDate(day)}
                      className={`aspect-square rounded-lg text-sm transition-all ${
                        day && !isDayDisabled(day)
                          ? selectedDate === day
                            ? "bg-[#00FF88] text-black font-semibold"
                            : "text-gray-300 hover:bg-white/5"
                          : "text-gray-700 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Horarios Disponibles</h2>
                {selectedDate ? (
                  <div className="space-y-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                          selectedTime === time
                            ? "border border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]"
                            : "border border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                        <span className="ml-auto text-xs">30 min</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                    Selecciona un día primero
                  </div>
                )}
                {selectedDate && selectedTime && (
                  <button onClick={() => setStep(2)} className="mt-6 w-full rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tema de la Sesión</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        selectedTopic === topic
                          ? "border-[#00FF88]/30 bg-[#00FF88]/10 text-[#00FF88]"
                          : "border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400 hover:bg-white/5">
                  Atrás
                </button>
                {selectedTopic && (
                  <button onClick={() => setStep(3)} className="flex-1 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Tus Datos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-400">Nombre completo</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-400">Correo electrónico</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-gray-400">Notas adicionales (opcional)</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 resize-none" placeholder="Describe qué te gustaría tratar..." />
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Resumen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Fecha</span><span className="text-white">{selectedDate} de {monthNames[currentYear]} {currentYear}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Hora</span><span className="text-white">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Tema</span><span className="text-white text-right max-w-[200px]">{selectedTopic}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Plataforma</span><span className="text-white">Zoom</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Duración</span><span className="text-white">30 minutos</span></div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400 hover:bg-white/5">Atrás</button>
                <button onClick={handleBook} disabled={loading || !formData.name || !formData.email} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  {loading ? "Agendando..." : "Confirmar Clase Zoom"}
                </button>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
