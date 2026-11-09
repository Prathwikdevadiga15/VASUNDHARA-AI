"use client";
import Link from "next/link";
import {
  Trees,
  Camera,
  Droplets,
  Flame,
  ShieldAlert,
  Bot,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const MODULES = [
    {
      title: "ForestWatch AI",
      tagline: "Satellite Vegetation Change & Canopy Loss",
      desc: "Analyzes Sentinel-2 multispectral surface reflectance (Red & NIR) to identify early canopy loss candidates before clear-cutting matures.",
      href: "/forestwatch",
      icon: Trees,
      color: "text-emerald",
      bg: "bg-emerald/10",
      border: "border-emerald/20",
    },
    {
      title: "BioTrack AI",
      tagline: "Wildlife Computer Vision & Bioacoustics",
      desc: "Identifies Western Ghats fauna from camera traps and screens forest acoustic telemetry for illegal chainsaws, gunshots, and animal distress.",
      href: "/biotrack",
      icon: Camera,
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/20",
    },
    {
      title: "AquaGuard AI",
      tagline: "Watershed Purity & Sensor Network",
      desc: "Monitors Netravati, Kali, Sharavathi, and Kaveri river basins with in-situ electrochemical sensors and rolling Z-score contamination anomaly detection.",
      href: "/aquaguard",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "EcoPredict AI",
      tagline: "Explainable Wildfire Risk Forecasting",
      desc: "Combines microclimate telemetry with satellite fuel dryness to predict ecological hazard with transparent, explainable feature attribution weights.",
      href: "/ecopredict",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    {
      title: "JanRakshak Portal",
      tagline: "Citizen Conservation & Reporting",
      desc: "Empowers local communities with Kannada, English, and Hindi geo-tagged incident reporting, connecting citizens directly with forest rangers.",
      href: "/reports",
      icon: ShieldAlert,
      color: "text-emerald",
      bg: "bg-emerald/10",
      border: "border-emerald/20",
    },
    {
      title: "AI Copilot & RAG",
      tagline: "Grounded Environmental Intelligence",
      desc: "Conversational environmental agent grounded strictly on Forest Survey of India (ISFR 2023) and Wildlife Protection Act with tool-calling capabilities.",
      href: "/assistant",
      icon: Bot,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-forest/15 bg-gradient-to-b from-forest/5 via-beige to-beige py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 text-xs font-semibold text-forest shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald animate-pulse" />
            <span>Protecting Nature Before It Is Too Late</span>
            <span className="text-forest/40">•</span>
            <span className="text-forest/70">Western Ghats Pilot Initiative</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight text-forest sm:text-6xl md:text-7xl">
            VASUNDHARA AI
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-display text-xl font-medium text-forest/90 sm:text-2xl">
            India&apos;s Intelligent Biodiversity & Ecosystem Protection Network
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-forest/75">
            Transforming environmental conservation from reactive disaster reporting into{" "}
            <span className="font-semibold text-forest">proactive, predictive, and preventive protection</span>.
            Integrating ESA Sentinel-2 multispectral satellites, YOLO fauna computer vision, IoT river sensors, and community participation.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/environmental-map"
              className="flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-xs sm:text-sm font-bold text-beige shadow-lg transition hover:bg-forest/90 hover:scale-105"
            >
              <MapPin className="h-4 w-4 text-emerald" />
              <span>Explore Live Western Ghats GIS Map</span>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-2 rounded-full border border-forest/25 bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-forest shadow-sm transition hover:bg-forest/5"
            >
              <ShieldAlert className="h-4 w-4 text-gold" />
              <span>Report Environmental Hazard</span>
            </Link>

            <Link
              href="/assistant"
              className="flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-forest transition hover:bg-emerald/20"
            >
              <Bot className="h-4 w-4 text-emerald" />
              <span>Consult AI Copilot</span>
            </Link>
          </div>
        </div>

        {/* Live Counters */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-forest/15 bg-white p-6 shadow-sm sm:grid-cols-4">
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-forest">20,400+</div>
              <div className="mt-1 text-xs text-forest/70 font-medium">sq km Canopy Monitored</div>
              <div className="text-[10px] text-emerald font-semibold">Sentinel-2 MSI</div>
            </div>

            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-forest">1,240+</div>
              <div className="mt-1 text-xs text-forest/70 font-medium">Fauna Sightings Logged</div>
              <div className="text-[10px] text-gold font-semibold">Camera Trap & Citizen</div>
            </div>

            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-forest">5 Basins</div>
              <div className="mt-1 text-xs text-forest/70 font-medium">River Networks Guarded</div>
              <div className="text-[10px] text-blue-600 font-semibold">Real-Time Sensors</div>
            </div>

            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-emerald">0.0 sec</div>
              <div className="mt-1 text-xs text-forest/70 font-medium">Predictive Warning Lead</div>
              <div className="text-[10px] text-forest/60 font-semibold">Preventive Triage</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Technologies Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
            Five Connected Conservation Engines
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-forest/70">
            VASUNDHARA AI breaks environmental silos by uniting satellite earth observation, computer vision,
            hydrological telemetry, predictive machine learning, and citizen governance into a unified network.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className={`group flex flex-col justify-between rounded-2xl border ${m.border} bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1`}
              >
                <div>
                  <div className={`inline-flex rounded-xl p-3 ${m.bg}`}>
                    <Icon className={`h-6 w-6 ${m.color}`} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-forest group-hover:text-emerald transition">
                    {m.title}
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-forest/70">{m.tagline}</div>
                  <p className="mt-3 text-xs leading-relaxed text-forest/75">{m.desc}</p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-emerald">
                  <span>Launch Engine</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Western Ghats Conservation Challenge */}
      <section className="border-t border-forest/15 bg-forest text-beige py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="rounded-full bg-emerald/20 px-3 py-1 text-xs font-bold text-emerald uppercase tracking-wider">
              UNESCO World Heritage Hotspot
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl text-beige">
              Why the Western Ghats Pilot Matters to India
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-beige/80">
              The Western Ghats of Karnataka host over 5,000 species of flowering plants, 139 mammal species, and 508 bird species.
              Crucially, these mountains are the water towers of peninsular India, giving birth to east- and west-flowing rivers
              supplying drinking water and agriculture to over 245 million citizens.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 text-center">
            <div className="rounded-xl border border-beige/10 bg-forest/80 p-6">
              <div className="text-3xl font-bold text-emerald">60%+</div>
              <div className="mt-2 text-xs font-medium text-beige/80">Fauna & Flora Strict Endemism</div>
            </div>
            <div className="rounded-xl border border-beige/10 bg-forest/80 p-6">
              <div className="text-3xl font-bold text-gold">245M+</div>
              <div className="mt-2 text-xs font-medium text-beige/80">Downstream Citizens Sustained</div>
            </div>
            <div className="rounded-xl border border-beige/10 bg-forest/80 p-6">
              <div className="text-3xl font-bold text-blue-400">325M+</div>
              <div className="mt-2 text-xs font-medium text-beige/80">Tonnes Carbon Stock Safeguarded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-forest/10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald">United Nations Alignment</span>
          <h3 className="mt-1 font-display text-2xl font-bold text-forest">Aligned with Global Sustainable Goals</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-center text-xs">
          <div className="rounded-xl border border-forest/15 bg-white p-4 shadow-2xs">
            <div className="font-bold text-blue-600">SDG 6</div>
            <div className="mt-1 font-semibold text-forest">Clean Water</div>
            <div className="mt-0.5 text-[11px] text-forest/60">Pollution early warning</div>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4 shadow-2xs">
            <div className="font-bold text-amber-600">SDG 11</div>
            <div className="mt-1 font-semibold text-forest">Sustainable Cities</div>
            <div className="mt-0.5 text-[11px] text-forest/60">Citizen conservation</div>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4 shadow-2xs">
            <div className="font-bold text-orange-600">SDG 13</div>
            <div className="mt-1 font-semibold text-forest">Climate Action</div>
            <div className="mt-0.5 text-[11px] text-forest/60">Forest fire resilience</div>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4 shadow-2xs">
            <div className="font-bold text-emerald">SDG 15</div>
            <div className="mt-1 font-semibold text-forest">Life on Land</div>
            <div className="mt-0.5 text-[11px] text-forest/60">Biodiversity protection</div>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
            <div className="font-bold text-purple-600">SDG 17</div>
            <div className="mt-1 font-semibold text-forest">Partnerships</div>
            <div className="mt-0.5 text-[11px] text-forest/60">Government & Community</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-forest/15 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-beige">
              <Trees className="h-5 w-5 text-emerald" />
            </div>
            <div>
              <div className="font-display font-bold text-forest">VASUNDHARA AI</div>
              <div className="text-[11px] text-forest/60">India&apos;s Intelligent Biodiversity Protection Network</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-forest/80">
            <Link href="/forestwatch" className="hover:text-emerald">ForestWatch</Link>
            <Link href="/biotrack" className="hover:text-emerald">BioTrack</Link>
            <Link href="/aquaguard" className="hover:text-emerald">AquaGuard</Link>
            <Link href="/ecopredict" className="hover:text-emerald">EcoPredict</Link>
            <Link href="/dashboard/environmental-map" className="hover:text-emerald">GIS Map</Link>
            <Link href="/reports" className="hover:text-emerald">JanRakshak</Link>
            <Link href="/assistant" className="hover:text-emerald">AI Copilot</Link>
            <Link href="/admin/dashboard" className="hover:text-emerald">Admin</Link>
          </div>

          <div className="text-[11px] text-forest/50">
            National-Level Hackathon Finalist Edition • 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
