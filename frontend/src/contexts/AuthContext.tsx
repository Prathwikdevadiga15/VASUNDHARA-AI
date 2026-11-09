"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as auth from "@/services/auth";
import type { User } from "@/types";

interface Ctx { user: User | null; loading: boolean; signIn: (e: string, p: string) => Promise<void>; signOut: () => Promise<void> }
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { auth.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const signIn = async (e: string, p: string) => setUser(await auth.login(e, p));
  const signOut = async () => { await auth.logout(); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
