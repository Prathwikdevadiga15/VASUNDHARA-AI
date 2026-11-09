"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { await signIn(email, password); router.push("/dashboard/overview"); }
    catch (err) { setError(err instanceof Error ? err.message : "Sign in failed."); }
  }
  return (
    <main className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl font-semibold">Sign in</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <label className="grid gap-1">Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border p-2" /></label>
        <label className="grid gap-1">Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border p-2" /></label>
        <Button type="submit">Sign in</Button>{error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}
