"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ShieldAlert,
  Trees,
  Camera,
  Droplets,
  Flame,
  Bot,
  MapPin,
  ClipboardCheck,
  BookOpen,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [intelOpen, setIntelOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/15 bg-beige/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-beige shadow-inner transition group-hover:scale-105">
              <Trees className="h-6 w-6 text-emerald" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-forest">
                <span>VASUNDHARA</span>
                <span className="rounded bg-emerald/15 px-1.5 py-0.5 text-xs font-semibold text-emerald">AI</span>
              </div>
              <p className="hidden text-[10px] font-medium tracking-wide text-forest/70 sm:block">
                Western Ghats Biodiversity Shield
              </p>
            </div>
          </Link>

          {/* Pilot Beacon */}
          <div className="hidden items-center gap-1.5 rounded-full border border-forest/15 bg-forest/5 px-2.5 py-1 text-xs font-medium text-forest lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald"></span>
            </span>
            <span>Pilot: Karnataka Corridor</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          <Link
            href="/"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              pathname === "/" ? "bg-forest/10 text-forest" : "text-forest/80 hover:bg-forest/5 hover:text-forest"
            }`}
          >
            Home
          </Link>

          {/* Intelligence Modules Dropdown */}
          <div className="relative" onMouseLeave={() => setIntelOpen(false)}>
            <button
              onClick={() => setIntelOpen(!intelOpen)}
              onMouseEnter={() => setIntelOpen(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-forest/80 transition hover:bg-forest/5 hover:text-forest"
            >
              <span>AI Intelligence</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {intelOpen && (
              <div className="absolute left-0 mt-1 w-64 rounded-xl border border-forest/10 bg-white p-2 shadow-xl ring-1 ring-black/5">
                <Link
                  href="/forestwatch"
                  onClick={() => setIntelOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <Trees className="mt-0.5 h-4 w-4 text-emerald" />
                  <div>
                    <div className="text-xs font-semibold text-forest">ForestWatch AI</div>
                    <div className="text-[11px] text-forest/60">Sentinel-2 NDVI & canopy loss</div>
                  </div>
                </Link>
                <Link
                  href="/biotrack"
                  onClick={() => setIntelOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <Camera className="mt-0.5 h-4 w-4 text-gold" />
                  <div>
                    <div className="text-xs font-semibold text-forest">BioTrack AI</div>
                    <div className="text-[11px] text-forest/60">Fauna CV & bioacoustic threats</div>
                  </div>
                </Link>
                <Link
                  href="/aquaguard"
                  onClick={() => setIntelOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <Droplets className="mt-0.5 h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-semibold text-forest">AquaGuard AI</div>
                    <div className="text-[11px] text-forest/60">River basins & anomaly sensors</div>
                  </div>
                </Link>
                <Link
                  href="/ecopredict"
                  onClick={() => setIntelOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <Flame className="mt-0.5 h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs font-semibold text-forest">EcoPredict AI</div>
                    <div className="text-[11px] text-forest/60">XGBoost fire risk early warning</div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/environmental-map"
                  onClick={() => setIntelOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <MapPin className="mt-0.5 h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-xs font-semibold text-forest">Live Ecosystem GIS Map</div>
                    <div className="text-[11px] text-forest/60">Western Ghats multi-layer GIS</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Action Portals Dropdown */}
          <div className="relative" onMouseLeave={() => setActionsOpen(false)}>
            <button
              onClick={() => setActionsOpen(!actionsOpen)}
              onMouseEnter={() => setActionsOpen(true)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-forest/80 transition hover:bg-forest/5 hover:text-forest"
            >
              <span>Portals & Action</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {actionsOpen && (
              <div className="absolute left-0 mt-1 w-64 rounded-xl border border-forest/10 bg-white p-2 shadow-xl ring-1 ring-black/5">
                <Link
                  href="/reports"
                  onClick={() => setActionsOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <ShieldAlert className="mt-0.5 h-4 w-4 text-emerald" />
                  <div>
                    <div className="text-xs font-semibold text-forest">JanRakshak Portal</div>
                    <div className="text-[11px] text-forest/60">Multilingual GPS incident report</div>
                  </div>
                </Link>
                <Link
                  href="/officer"
                  onClick={() => setActionsOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <ClipboardCheck className="mt-0.5 h-4 w-4 text-forest" />
                  <div>
                    <div className="text-xs font-semibold text-forest">Forest Officer Workbench</div>
                    <div className="text-[11px] text-forest/60">Incident triage & field dispatch</div>
                  </div>
                </Link>
                <Link
                  href="/researcher"
                  onClick={() => setActionsOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <BookOpen className="mt-0.5 h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs font-semibold text-forest">Research & Data Centre</div>
                    <div className="text-[11px] text-forest/60">Open environmental datasets</div>
                  </div>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setActionsOpen(false)}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-forest/5"
                >
                  <UserCheck className="mt-0.5 h-4 w-4 text-amber-700" />
                  <div>
                    <div className="text-xs font-semibold text-forest">Super Admin Center</div>
                    <div className="text-[11px] text-forest/60">Integrations, RBAC & system logs</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* AI Assistant Link */}
          <Link
            href="/assistant"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              pathname === "/assistant"
                ? "bg-forest/10 text-forest"
                : "text-forest/80 hover:bg-forest/5 hover:text-forest"
            }`}
          >
            <Bot className="h-4 w-4 text-emerald" />
            <span>AI Copilot</span>
            <span className="rounded-full bg-emerald/20 px-1 text-[9px] font-bold text-emerald">RAG</span>
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/reports"
            className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-beige shadow transition hover:bg-forest/90"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-gold" />
            <span>Report Incident</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-forest/20 bg-forest/5 px-2.5 py-1 text-xs font-semibold text-forest">
                {user.roles[0] || "Citizen"}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest/70 transition hover:bg-forest/5 hover:text-forest"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg border border-forest/25 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest/5"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-forest hover:bg-forest/10 md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-forest/15 bg-white p-4 shadow-lg md:hidden">
          <div className="grid gap-2 text-sm font-medium text-forest">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">Home</Link>
            <Link href="/forestwatch" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">ForestWatch AI (Satellite NDVI)</Link>
            <Link href="/biotrack" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">BioTrack AI (Wildlife & Audio)</Link>
            <Link href="/aquaguard" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">AquaGuard AI (Water Quality)</Link>
            <Link href="/ecopredict" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">EcoPredict AI (Fire Risk)</Link>
            <Link href="/dashboard/environmental-map" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">Live Ecosystem GIS Map</Link>
            <Link href="/assistant" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">AI Environmental Assistant</Link>
            <Link href="/reports" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">JanRakshak Citizen Reporting</Link>
            <Link href="/officer" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">Forest Officer Workbench</Link>
            <Link href="/researcher" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">Research & Datasets</Link>
            <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="rounded p-2 hover:bg-forest/5">Admin Operations</Link>
            <div className="pt-2">
              <Link
                href="/reports"
                onClick={() => setMobileOpen(false)}
                className="block w-full rounded-full bg-forest py-2 text-center text-xs font-semibold text-beige"
              >
                Report Environmental Incident
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
