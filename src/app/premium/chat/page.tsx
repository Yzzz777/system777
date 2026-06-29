"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical, Smile, Image as ImageIcon, Circle } from "lucide-react";

const mockContacts = [
  { id: "1", name: "System 777", role: "Instructor", avatar: "S7", online: true, lastMessage: "¡Hola! ¿En qué puedo ayudarte?", time: "Ahora", unread: 2 },
  { id: "2", name: "Alex Rodriguez", role: "Estudiante Pro", avatar: "AR", online: true, lastMessage: "Gracias por la mentoría!", time: "5 min", unread: 0 },
  { id: "3", name: "María Santos", role: "Instructora", avatar: "MS", online: false, lastMessage: "La clase es mañana a las 3pm", time: "1h", unread: 1 },
  { id: "4", name: "Carlos Méndez", role: "Estudiante", avatar: "CM", online: false, lastMessage: "¿Cuándo es la próxima reunión?", time: "3h", unread: 0 },
  { id: "5", name: "Soporte SYSTEM 777", role: "Admin", avatar: "S7", online: true, lastMessage: "Tu suscripción está activa", time: "1d", unread: 0 },
];

const mockMessages: Record<string, { id: string; sender: string; content: string; time: string; isMe: boolean }[]> = {
  "1": [
    { id: "1", sender: "System 777", content: "¡Bienvenido a SYSTEM 777! Soy tu instructor principal.", time: "10:00 AM", isMe: false },
    { id: "2", sender: "Me", content: "Hola! Quiero empezar con el curso de React", time: "10:05 AM", isMe: true },
    { id: "3", sender: "System 777", content: "¡Genial! Te recomiendo empezar con el Curso Completo de React. ¿Tienes acceso premium?", time: "10:06 AM", isMe: false },
    { id: "4", sender: "Me", content: "Sí, acabo de comprar el plan Pro", time: "10:10 AM", isMe: true },
    { id: "5", sender: "System 777", content: "¡Perfecto! Tienes acceso a todos los cursos premium. ¿Te gustaría agendar una sesión de mentoring por Zoom?", time: "10:11 AM", isMe: false },
    { id: "6", sender: "System 777", content: "¡Hola! ¿En qué puedo ayudarte?", time: "Ahora", isMe: false },
  ],
  "2": [
    { id: "1", sender: "Alex Rodriguez", content: "Hola, terminé el curso de JavaScript!", time: "9:00 AM", isMe: false },
    { id: "2", sender: "Me", content: "¡Felicidades! ¿Cómo te fue?", time: "9:15 AM", isMe: true },
    { id: "3", sender: "Alex Rodriguez", content: "¡Genial! Gracias por la mentoría!", time: "9:20 AM", isMe: false },
  ],
  "3": [
    { id: "1", sender: "María Santos", content: "La clase es mañana a las 3pm, no olvides preparar tus preguntas", time: "Hoy", isMe: false },
  ],
  "4": [
    { id: "1", sender: "Carlos Méndez", content: "¿Cuándo es la próxima reunión grupal?", time: "Ayer", isMe: false },
    { id: "2", sender: "Me", content: "La próxima semana, te aviso por aquí", time: "Ayer", isMe: true },
  ],
  "5": [
    { id: "1", sender: "Soporte SYSTEM 777", content: "Tu suscripción Pro está activa. Próximo cobro: 15 de julio.", time: "28 jun", isMe: false },
  ],
};

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);

  const filteredContacts = mockContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact) return;
    const newMsg = { id: Date.now().toString(), sender: "Me", content: newMessage, time: "Ahora", isMe: true };
    setMessages(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMsg],
    }));
    setNewMessage("");

    setTimeout(() => {
      const autoReply = { id: (Date.now() + 1).toString(), sender: mockContacts.find(c => c.id === selectedContact)?.name || "", content: "Gracias por tu mensaje. Te responderé pronto! 🚀", time: "Ahora", isMe: false };
      setMessages(prev => ({
        ...prev,
        [selectedContact]: [...(prev[selectedContact] || []), autoReply],
      }));
    }, 1500);
  };

  const activeContact = mockContacts.find(c => c.id === selectedContact);

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-80 border-r border-white/5 bg-[#0A0A0A] lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-white/5 p-4">
          <Link href="/dashboard" className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-lg font-semibold text-white">Chat Premium</h2>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                selectedContact === contact.id ? "bg-[#00FF88]/5 border-r-2 border-[#00FF88]" : ""
              }`}
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">
                  {contact.avatar}
                </div>
                {contact.online && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-[#00FF88]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{contact.name}</span>
                  <span className="text-[10px] text-gray-500">{contact.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">{contact.lastMessage}</span>
                  {contact.unread > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00FF88] px-1 text-[10px] font-bold text-black">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-white/5 p-3">
          <div className="rounded-xl bg-[#00FF88]/5 p-3 text-center">
            <p className="text-xs text-gray-400">Chat exclusivo para</p>
            <p className="text-sm font-semibold text-[#00FF88]">Usuarios Premium</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {selectedContact && activeContact ? (
          <>
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">
                    {activeContact.avatar}
                  </div>
                  {activeContact.online && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-[#00FF88]" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{activeContact.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Circle className="h-2 w-2 fill-[#00FF88] text-[#00FF88]" />
                    {activeContact.online ? "En línea" : "Desconectado"} · {activeContact.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/premium/calls" className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-[#00FF88]">
                  <Phone className="h-5 w-5" />
                </Link>
                <Link href="/premium/calls?type=video" className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-[#00FF88]">
                  <Video className="h-5 w-5" />
                </Link>
                <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages[selectedContact]?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.isMe
                      ? "bg-[#00FF88] text-black rounded-br-sm"
                      : "bg-white/5 text-white rounded-bl-sm"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.isMe ? "text-black/50" : "text-gray-500"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                  <Smile className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="rounded-xl bg-[#00FF88] p-2.5 text-black transition-all hover:bg-[#00CC6A] disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#00FF88]/10">
              <Send className="h-8 w-8 text-[#00FF88]" />
            </div>
            <h3 className="text-xl font-bold text-white">Chat Premium</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
              Habla directamente con instructores y otros estudiantes premium. Soporte en tiempo real.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4">
                <Phone className="mx-auto h-6 w-6 text-[#00FF88]" />
                <p className="mt-2 text-xs text-gray-400">Llamadas</p>
              </div>
              <div className="glass rounded-xl p-4">
                <Video className="mx-auto h-6 w-6 text-[#00C8FF]" />
                <p className="mt-2 text-xs text-gray-400">Videollamadas</p>
              </div>
              <div className="glass rounded-xl p-4">
                <ImageIcon className="mx-auto h-6 w-6 text-[#7C3AED]" />
                <p className="mt-2 text-xs text-gray-400">Archivos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
