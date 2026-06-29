"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Filter, CreditCard, DollarSign, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

interface Payment {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  method: string;
  status: string;
  reference: string;
  proof_url: string;
  type: string;
  plan_or_course: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch {} finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "all" ? payments : payments.filter(p => p.status === filter);
  const totalRevenue = payments.filter(p => p.status === "approved").reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter(p => p.status === "pending").length;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 rounded-full bg-[#00FF88]/10 px-2.5 py-1 text-xs font-medium text-[#00FF88]"><CheckCircle className="h-3 w-3" /> Aprobado</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"><XCircle className="h-3 w-3" /> Rechazado</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400"><Clock className="h-3 w-3" /> Pendiente</span>;
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Pagos</h1>
            <p className="text-sm text-gray-400 mt-1">Administra las solicitudes de pago de usuarios</p>
          </div>
          <button onClick={fetchPayments} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF88]/10">
                <DollarSign className="h-5 w-5 text-[#00FF88]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Ingresos Totales</p>
                <p className="text-xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pendientes</p>
                <p className="text-xl font-bold text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C8FF]/10">
                <CreditCard className="h-5 w-5 text-[#00C8FF]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Pagos</p>
                <p className="text-xl font-bold text-white">{payments.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#00FF88]/10 text-[#00FF88]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : f === "approved" ? "Aprobados" : "Rechazados"}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-[#00FF88]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No hay pagos {filter !== "all" ? `con estado "${filter}"` : ""}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Nombre</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Monto</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Método</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Estado</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Fecha</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((payment) => (
                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-sm text-white font-medium">{payment.name}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{payment.email}</td>
                      <td className="px-5 py-4 text-sm text-[#00FF88] font-bold">${payment.amount.toFixed(2)}</td>
                      <td className="px-5 py-4 text-sm text-gray-400 capitalize">{payment.method}</td>
                      <td className="px-5 py-4">{getStatusBadge(payment.status)}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{formatDate(payment.created_at)}</td>
                      <td className="px-5 py-4">
                        {payment.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateStatus(payment.id, "approved")}
                              disabled={updating === payment.id}
                              className="rounded-lg bg-[#00FF88]/10 px-3 py-1.5 text-xs font-medium text-[#00FF88] hover:bg-[#00FF88]/20 disabled:opacity-50 transition-colors"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => updateStatus(payment.id, "rejected")}
                              disabled={updating === payment.id}
                              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
