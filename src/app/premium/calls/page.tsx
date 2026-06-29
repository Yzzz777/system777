"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Video, PhoneOff, Mic, MicOff, Camera, CameraOff, Clock } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const onlineUsers = [
  { name: "System 777", role: "Instructor", avatar: "S7", status: "Disponible para llamadas" },
  { name: "Alex Rodriguez", role: "Estudiante Pro", avatar: "AR", status: "En línea" },
  { name: "Soporte", role: "Admin", avatar: "S7", status: "Disponible" },
];

const recentCalls = [
  { name: "System 777", type: "video" as const, duration: "25:30", date: "Hoy, 3:00 PM", avatar: "S7" },
  { name: "Alex Rodriguez", type: "audio" as const, duration: "12:15", date: "Ayer, 7:30 PM", avatar: "AR" },
  { name: "Soporte", type: "video" as const, duration: "8:45", date: "27 Jun, 11:00 AM", avatar: "S7" },
];

export default function CallsPage() {
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);
  const [callUser, setCallUser] = useState("");
  const [callTimer, setCallTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setActiveCall(null);
    setCallUser("");
    setCallTimer(0);
    setMuted(false);
    setCameraOff(false);
    setHasPermission(null);
  }, [localStream]);

  const startCall = async (name: string, type: "audio" | "video") => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === "video" ? { width: 1280, height: 720, facingMode: "user" } : false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setHasPermission(true);
      setCallUser(name);
      setActiveCall(type);
      setCallTimer(0);
    } catch (err) {
      console.error("Media access error:", err);
      setHasPermission(false);
      setCallUser(name);
      setActiveCall(type);
    }
  };

  useEffect(() => {
    if (localStream && localVideoRef.current && !cameraOff) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, cameraOff]);

  useEffect(() => {
    if (activeCall) {
      timerRef.current = setInterval(() => setCallTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeCall]);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => { track.enabled = !muted; });
    }
  }, [muted, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => { track.enabled = !cameraOff; });
    }
  }, [cameraOff, localStream]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (activeCall) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] p-4">
        <div className="relative w-full max-w-4xl">
          {activeCall === "video" && !cameraOff && hasPermission !== false && (
            <div className="aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-[#00FF88]/10 to-[#00C8FF]/10 relative">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{callUser}</p>
                  <p className="text-sm text-[#00FF88]">Videollamada en curso</p>
                </div>
              </div>
            </div>
          )}

          {(activeCall === "audio" || cameraOff || hasPermission === false) && (
            <div className="aspect-video rounded-3xl bg-[#121212] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#00FF88]/10 text-5xl font-bold text-[#00FF88]">
                  {callUser.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="text-2xl font-semibold text-white">{callUser}</p>
                <p className="text-sm text-[#00FF88] mt-1">{activeCall === "audio" ? "Llamada de voz" : cameraOff ? "Cámara desactivada" : "Conectando..."}</p>
              </div>
            </div>
          )}

          {activeCall === "video" && (
            <div className="absolute bottom-24 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-white/10 bg-[#0A0A0A]">
              {localStream && !cameraOff ? (
                <video ref={(el) => { if (el && localStream) el.srcObject = localStream; }} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#121212]">
                  <CameraOff className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
            <button onClick={() => setMuted(!muted)} className={`rounded-full p-4 transition-all ${muted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            {activeCall === "video" && (
              <button onClick={() => setCameraOff(!cameraOff)} className={`rounded-full p-4 transition-all ${cameraOff ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white hover:bg-white/20"}`}>
                {cameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
              </button>
            )}
            <button onClick={cleanupCall} className="rounded-full bg-red-500 p-4 text-white transition-all hover:bg-red-600">
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute top-6 left-6 rounded-xl bg-black/50 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-white">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <Clock className="h-4 w-4 text-[#00FF88]" />
              {formatTime(callTimer)}
            </div>
          </div>

          <div className="absolute top-6 right-6 rounded-xl bg-black/50 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm text-white font-medium">{callUser}</p>
            <p className="text-xs text-gray-400">{activeCall === "video" ? "Video" : "Audio"} · En curso</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/premium/chat" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Chat
        </Link>

        <FadeIn>
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FF88]/10">
              <Phone className="h-7 w-7 text-[#00FF88]" />
            </div>
            <h1 className="text-3xl font-bold text-white">Llamadas Premium</h1>
            <p className="mt-3 text-gray-400">Llamadas de voz y videollamadas con cámara y micrófono reales</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Usuarios en Línea</h2>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.name} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">{user.avatar}</div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#121212] bg-[#00FF88]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startCall(user.name, "audio")} className="rounded-lg bg-[#00FF88]/10 p-2 text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button onClick={() => startCall(user.name, "video")} className="rounded-lg bg-[#00C8FF]/10 p-2 text-[#00C8FF] hover:bg-[#00C8FF]/20 transition-colors">
                      <Video className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Historial de Llamadas</h2>
            <div className="space-y-3">
              {recentCalls.map((call, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">{call.avatar}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{call.name}</div>
                      <div className="text-xs text-gray-500">{call.date} · {call.type === "video" ? "Video" : "Audio"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{call.duration}</span>
                    <button onClick={() => startCall(call.name, call.type)} className="rounded-lg bg-[#00FF88]/10 p-2 text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors">
                      {call.type === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
