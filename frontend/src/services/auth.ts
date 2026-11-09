import { api } from "@/lib/api";
import type { User } from "@/types";

export const login = (email: string, password: string) =>
  api<User>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const register = (full_name: string, email: string, password: string) =>
  api<User>("/auth/register", { method: "POST", body: JSON.stringify({ full_name, email, password }) });
export const me = () => api<User>("/auth/me");
export const logout = () => api<void>("/auth/logout", { method: "POST" });
