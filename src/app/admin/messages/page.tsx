"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Mail,
  MailOpen,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
} from "lucide-react";

const adminNav = [
  { label: "Panel", icon: LayoutDashboard, href: "/admin" },
  { label: "Usuarios", icon: Users, href: "/admin/users" },
  { label: "Cursos", icon: BookOpen, href: "/admin/courses" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Mensajes", icon: MessageSquare, href: "/admin/messages" },
  { label: "Tienda", icon: ShoppingCart, href: "/admin/store" },
  { label: "Analíticas", icon: BarChart3, href: "/admin/analytics" },
  { label: "Seguridad", icon: Shield, href: "/admin/security" },
  { label: "Configuración", icon: Settings, href: "/admin/settings" },
];

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    name: "María García",
    email: "maria@ejemplo.com",
    subject: "Consulta sobre cursos premium",
    message: "Hola, me gustaría saber si los cursos premium incluyen certificado de finalización. También quería preguntar sobre las opciones de pago disponibles. ¿Aceptan criptomonedas? Gracias de antemano.",
    date: "2024-05-15 14:30",
    read: false,
  },
  {
    id: 2,
    name: "Alex Chen",
    email: "alex@ejemplo.com",
    subject: "Problema con mi cuenta",
    message: "No puedo iniciar sesión desde hace dos días. He intentado restablecer mi contraseña pero no recibo el email. Mi email registrado es alex@ejemplo.com. ¿Podrían ayudarme?",
    date: "2024-05-14 09:15",
    read: true,
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah@ejemplo.com",
    subject: "Propuesta de colaboración",
    message: "Soy instructora de diseño UI/UX con 5 años de experiencia. Me gustaría proponer una colaboración para crear cursos exclusivos para su plataforma. ¿A quién debería contactar?",
    date: "2024-05-13 16:45",
    read: false,
  },
  {
    id: 4,
    name: "Carlos Ruiz",
    email: "carlos@ejemplo.com",
    subject: "Feedback del curso de Python",
    message: "Excelente curso de Python. Los ejercicios prácticos son muy útiles. Solo una sugerencia: sería bueno agregar más ejercicios de DOM para principiantes. El contenido es muy completo.",
    date: "2024-05-12 11:20",
    read: true,
  },
  {
    id: 5,
    name: "Laura Martínez",
    email: "laura@ejemplo.com",
    subject: "Solicitud de reembolso",
    message: "Necesito solicitar un reembolso del curso de Machine Learning por motivos personales. Lo compré hace 3 días y no he completado más del 10%. Mi número de orden es #ORD-2847.",
    date: "2024-05-11 08:50",
    read: false,
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId !== id) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    }
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-white/5 bg-[#0A0A0A] lg:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-bold">
            <Shield className="h-5 w-5 text-[#00FF88]" />
            <span className="text-white">Panel Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                item.href === "/admin/messages"
                  ? "bg-[#00FF88]/10 text-[#00FF88]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/5 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Mensajes de Contacto</h1>
          <p className="mt-1 text-sm text-gray-400">
            {messages.length} mensajes &middot; {unreadCount} sin leer
          </p>
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleExpand(msg.id)}
                className="flex w-full items-center gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00FF88]/10">
                  {msg.read ? (
                    <MailOpen className="h-5 w-5 text-[#00FF88]" />
                  ) : (
                    <Mail className="h-5 w-5 text-[#00FF88]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className={`font-medium ${msg.read ? "text-gray-300" : "text-white"}`}>
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="inline-block h-2 w-2 rounded-full bg-[#00FF88]" />
                    )}
                    <span className="text-xs text-gray-500">{msg.email}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-sm ${msg.read ? "text-gray-400" : "text-white font-medium"}`}>
                      {msg.subject}
                    </span>
                  </div>
                  {expandedId !== msg.id && (
                    <p className="mt-1 text-xs text-gray-500 truncate max-w-md">{msg.message}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <div className="text-xs text-gray-500">{msg.date}</div>
                  </div>
                  {expandedId === msg.id ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedId === msg.id && (
                <div className="border-t border-white/5 px-4 sm:px-5 pb-4 sm:pb-5 pt-4">
                  <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 sm:hidden">
                    <Clock className="h-3 w-3" />
                    {msg.date}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300">{msg.message}</p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`mailto:${msg.email}`}
                      className="rounded-lg bg-[#00FF88]/10 px-4 py-2 text-xs font-medium text-[#00FF88] hover:bg-[#00FF88]/20"
                    >
                      Responder
                    </a>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex items-center gap-1 rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="glass rounded-2xl py-16 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-4 text-sm text-gray-500">No hay mensajes.</p>
          </div>
        )}
      </main>
    </div>
  );
}
