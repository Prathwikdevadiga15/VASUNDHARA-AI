"use client";
import { useState } from "react";
import { Trees, Users, HeartHandshake, CheckCircle2, Target, Calendar } from "lucide-react";

const PROJECTS = [
  {
    id: "proj-1",
    title: "Kudremukh Shola Corridor Native Reforestation",
    target_saplings: 10000,
    planted_count: 3450,
    location: "Kudremukh National Park Fringe",
    status: "Active Reforestation",
    description: "Planting native Shola forest tree species (Syzygium, Litsea, Cinnamomum) to re-establish fragmented wildlife migration corridors.",
  },
  {
    id: "proj-2",
    title: "Agumbe Rainforest Bioacoustic Sensor & Buffer Protection",
    target_saplings: 5000,
    planted_count: 2100,
    location: "Agumbe Rainforest Research Reserve",
    status: "Active Preservation",
    description: "Installing solar-powered acoustic sentinel nodes to monitor King Cobra breeding grounds and detect timber poaching chainsaws.",
  },
  {
    id: "proj-3",
    title: "Netravati Riverbank Bamboo Riparian Restoration",
    target_saplings: 8000,
    planted_count: 5200,
    location: "Netravati River Catchment (Bantwal)",
    status: "Active Soil Stabilization",
    description: "Planting indigenous bamboo clumps and Vetiver grass to halt sand erosion and filter agricultural pesticide runoff.",
  },
];

export default function NgoProjectsPage() {
  const [volunteered, setVolunteered] = useState<Record<string, boolean>>({});

  const handleVolunteer = (id: string) => {
    setVolunteered((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
          <HeartHandshake className="h-4 w-4" />
          <span>Conservation Campaigns & NGO Partnerships</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          Habitat Restoration & Volunteer Initiatives
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Grassroots ecological restoration projects across the Western Ghats connecting conservation organizations,
          volunteer youth, and local panchayats.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PROJECTS.map((p) => {
          const progress = Math.min(100, Math.round((p.planted_count / p.target_saplings) * 100));
          const hasJoined = volunteered[p.id];

          return (
            <div key={p.id} className="flex flex-col justify-between rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald uppercase">
                    {p.status}
                  </span>
                  <span className="text-xs font-medium text-forest/60">{p.location}</span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-forest">{p.title}</h3>
                <p className="mt-2 text-xs text-forest/75 leading-relaxed">{p.description}</p>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-semibold text-forest">
                    <span>Restoration Target</span>
                    <span>{progress}% ({p.planted_count.toLocaleString()} / {p.target_saplings.toLocaleString()})</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-forest/10">
                    <div className="h-full rounded-full bg-emerald transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-forest/10 pt-4">
                {hasJoined ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Registered as Conservation Volunteer!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVolunteer(p.id)}
                    className="w-full rounded-xl bg-forest py-2.5 text-xs font-bold text-beige shadow transition hover:bg-forest/90"
                  >
                    Join as Volunteer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
