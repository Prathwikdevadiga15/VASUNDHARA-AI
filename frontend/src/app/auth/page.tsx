"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import {
  Trees,
  ShieldCheck,
  UserCheck,
  ClipboardCheck,
  User,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function AuthPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const DEMO_ACCOUNTS = [
    {
      role: "Super Admin",
      email: "admin@vasundhara.gov.in",
      pass: "Vasundhara@2026",
      desc: "Full system control, RBAC governance, and security audit log access.",
      icon: ShieldCheck,
      color: "border-amber-200 bg-amber-50/70 text-amber-900 hover:border-amber-300",
    },
    {
      role: "Forest Officer",
      email: "officer@vasundhara.gov.in",
      pass: "Vasundhara@2026",
      desc: "Incident verification, field ranger squad dispatch, and tamper-proof evidence triage.",
      icon: ClipboardCheck,
      color: "border-emerald/20 bg-emerald/5 text-emerald hover:border-emerald/40",
    },
    {
      role: "Citizen / Volunteer",
      email: "citizen@vasundhara.org",
      pass: "Vasundhara@2026",
      desc: "Community incident reporting, GPS geotagging, and camera trap sightings.",
      icon: User,
      color: "border-blue-200 bg-blue-50/70 text-blue-900 hover:border-blue-300",
    },
  ];

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsRegister(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify({ full_name: fullName, email, password }),
        });
        setSuccess("Citizen account created! Signing you in...");
        await signIn(email, password);
        router.push("/reports");
      } else {
        await signIn(email, password);
        if (email.includes("admin")) {
          router.push("/admin/dashboard");
        } else if (email.includes("officer")) {
          router.push("/officer");
        } else {
          router.push("/dashboard/overview");
        }
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 rounded-3xl border border-forest/15 bg-white p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-beige">
              <Trees className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-forest">
                {isRegister ? "Join The Vasundhara Initiative" : "Access Environmental Command"}
              </h1>
              <p className="text-xs text-forest/70">
                {isRegister
                  ? "Self-register as a verified citizen guardian for Western Ghats."
                  : "Sign in with your role-governed credentials."}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-xs font-semibold text-emerald">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest/75 mb-1.5">
                  Full Name / Organization
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Hegde"
                    className="w-full rounded-xl border border-forest/20 bg-forest/5 pl-10 pr-4 py-2.5 text-xs text-forest placeholder:text-forest/40 focus:border-emerald focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/75 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.gov.in"
                  className="w-full rounded-xl border border-forest/20 bg-forest/5 pl-10 pr-4 py-2.5 text-xs text-forest placeholder:text-forest/40 focus:border-emerald focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/75 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-forest/20 bg-forest/5 pl-10 pr-4 py-2.5 text-xs text-forest placeholder:text-forest/40 focus:border-emerald focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-xs font-bold uppercase tracking-wider text-beige shadow-lg hover:bg-forest/90 transition disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : isRegister ? "Create Citizen Account" : "Sign In to Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-forest/10 pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs font-semibold text-emerald hover:underline"
            >
              {isRegister
                ? "Already have an assigned role? Sign In instead"
                : "Need to submit community reports? Create a free Citizen Account"}
            </button>
          </div>
        </div>

        {/* Right Column: One-Click Demo Role Accounts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-forest/15 bg-white/90 p-6 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald">
              <Sparkles className="h-4 w-4" />
              <span>National Hackathon Evaluation</span>
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-forest">
              1-Click Demo Profiles
            </h2>
            <p className="mt-1 text-xs text-forest/70">
              Click any role below to automatically populate pre-seeded credentials and test the role-based workflows:
            </p>

            <div className="mt-4 space-y-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isSelected = email === acc.email;

                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemoSelect(acc.email, acc.pass)}
                    className={`w-full text-left rounded-2xl border p-3.5 transition ${acc.color} ${
                      isSelected ? "ring-2 ring-forest" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Icon className="h-4 w-4" />
                        <span>{acc.role}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">Vasundhara@2026</span>
                    </div>
                    <div className="mt-1 text-[11px] font-mono opacity-90">{acc.email}</div>
                    <p className="mt-1.5 text-[10px] leading-relaxed opacity-75">{acc.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

