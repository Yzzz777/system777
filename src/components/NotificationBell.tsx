"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  }

  async function markAsRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read", notificationId: id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  }

  async function markAllAsRead() {
    try {
      setLoading(true);
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "readAll" }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {} finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Ahora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FF88] text-[10px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-[#121212] shadow-2xl z-50"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs text-[#00FF88] hover:text-[#00CC6A]"
                >
                  <CheckCheck className="h-3 w-3" />
                  Marcar todo leído
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No hay notificaciones
                </div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id);
                    }}
                    className={`w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                      !notif.read ? "bg-[#00FF88]/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.read && (
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#00FF88]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                          <span className="ml-2 flex-shrink-0 text-[10px] text-gray-500">{formatDate(notif.created_at)}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400 truncate">{notif.message}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
