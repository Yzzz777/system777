"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  username?: string;
}

interface Session {
  user: SessionUser | null;
  expires: string | null;
}

interface SessionContextType {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: "loading",
  update: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export async function signOut(opts?: { callbackUrl?: string }) {
  await fetch("/api/auth/signout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callbackUrl: opts?.callbackUrl || "/login" }),
  });
  window.location.href = opts?.callbackUrl || "/login";
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data && data.user) {
        setSession(data);
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <SessionContext.Provider value={{ data: session, status, update: fetchSession }}>
      {children}
    </SessionContext.Provider>
  );
}
