"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trees,
  Camera,
  Droplets,
  Flame,
  ShieldAlert,
  MapPin,
  ClipboardCheck,
  Bot,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";

export default function Overview() {
  const { user } = useAuth();
  const [data, setData] = useState<{ reports_by_status: Record<string, number> } | null>(null);

  useEffect(() => {
    api<{ reports_by_status: Record<string, number> }>("/analytics/overview")
      .then(setData)
      .catch(console.error);
  }, []);

  const QUICK_LINKS = [
    { title: "Western Ghats Live GIS Map", href: "/dashboard/environmental-map", icon: MapPin, color: "text-red-600", desc: "Interactive multi-layer GIS overview" },
    { title: "ForestWatch AI", href: "/forestwatch", icon: Trees, color: "text-emerald", desc: "Sentinel-2 NDVI change detection" },
    { title: "BioTrack AI", href: "/biotrack", icon: Camera, color: "text-gold", desc: "Fauna computer vision & bioacoustics" },
    { title: "AquaGuard AI", href: "/aquaguard", icon: Droplets, color: "text-blue-600", desc: "River basin water telemetry" },
    { title: "EcoPredict AI", href: "/ecopredict", icon: Flame, color: "text-orange-600", desc: "Predictive wildfire vulnerability" },
    { title: "AI Copilot & RAG", href: "/assistant", icon: Bot, color: "text-purple-600", desc: "Grounded environmental assistant" },
    { title: "JanRakshak Reports", href: "/reports", icon: ShieldAlert, color: "text-emerald", desc: "Citizen incident reporting portal" },
    { title: "Officer Workbench", href: "/officer", icon: ClipboardCheck, color: "text-forest", desc: "Ranger triage & field dispatch" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl border border-forest/15 bg-gradient-to-r from-forest to-forest/90 p-8 text-beige shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-emerald/20 px-3 py-1 text-xs font-bold text-emerald uppercase tracking-wider">
              Environmental Intelligence Dashboard
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-beige">
              Welcome, {user?.full_name || "Conservation Officer"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-beige/80">
              Western Ghats Autonomous Ecological Monitoring Network • Karnataka Corridor
            </p>
          </div>

          <Link
            href="/dashboard/environmental-map"
            className="flex items-center gap-2 rounded-xl bg-beige px-5 py-2.5 text-xs font-bold text-forest shadow transition hover:bg-white"
          >
            <MapPin className="h-4 w-4 text-emerald" />
            <span>Launch Live GIS Map</span>
          </Link>
        </div>
      </div>

      {/* Incident Status Metrics */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-bold text-forest">Incident Lifecycle Triage</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-forest/70 uppercase">Submitted</div>
            <div className="mt-2 text-3xl font-extrabold text-forest">{data?.reports_by_status?.submitted ?? 1}</div>
            <div className="text-[10px] text-amber-600 font-semibold">Awaiting Field Triage</div>
          </div>

          <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-forest/70 uppercase">Investigating</div>
            <div className="mt-2 text-3xl font-extrabold text-blue-600">{data?.reports_by_status?.investigating ?? 1}</div>
            <div className="text-[10px] text-blue-600 font-semibold">Rangers Dispatched</div>
          </div>

          <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-forest/70 uppercase">Verified</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald">{data?.reports_by_status?.verified ?? 1}</div>
            <div className="text-[10px] text-emerald font-semibold">Evidence Grounded</div>
          </div>

          <div className="rounded-2xl border border-forest/15 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-forest/70 uppercase">Resolved</div>
            <div className="mt-2 text-3xl font-extrabold text-forest">{data?.reports_by_status?.resolved ?? 0}</div>
            <div className="text-[10px] text-forest/60 font-semibold">Action Completed</div>
          </div>
        </div>
      </section>

      {/* Quick Launchpad */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-forest">Intelligence & Field Command Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.href}
                className="group rounded-2xl border border-forest/15 bg-white p-5 shadow-sm transition hover:border-emerald hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${link.color}`} />
                  <ArrowRight className="h-4 w-4 text-forest/30 transition group-hover:translate-x-1 group-hover:text-emerald" />
                </div>
                <h3 className="mt-4 font-bold text-sm text-forest group-hover:text-emerald transition">
                  {link.title}
                </h3>
                <p className="mt-1 text-xs text-forest/60">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
