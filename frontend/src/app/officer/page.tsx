"use client";
import { useEffect, useState } from "react";
import { listReports, verifyReport } from "@/services/reports";
import { useAuth } from "@/contexts/AuthContext";
import type { Report } from "@/types";
import { ClipboardCheck, ShieldCheck, CheckCircle, XCircle, AlertTriangle, UserCheck } from "lucide-react";

export default function OfficerPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const data = await listReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) setSelectedReport(data[0]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (decision: "verified" | "rejected") => {
    if (!selectedReport || actionLoading) return;
    setActionLoading(true);
    setMsg("");

    try {
      await verifyReport(selectedReport.id, decision);
      setMsg(`Incident successfully updated to ${decision.toUpperCase()}.`);
      await loadData();
    } catch (e: any) {
      setMsg(e.message || "Failed to submit verification.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
            <ClipboardCheck className="h-4 w-4" />
            <span>Karnataka Forest Department | Field Ranger Command</span>
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
            Forest Officer Incident Workbench
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-forest/75">
            Verification, field ranger squad dispatch, and tamper-proof evidence validation for Western Ghats protected corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white p-3 shadow-xs">
          <UserCheck className="h-4 w-4 text-emerald" />
          <div className="text-xs">
            <div className="font-bold text-forest">{user?.full_name || "Authorized Forest Conservator"}</div>
            <div className="text-[10px] text-forest/60">Western Ghats Command Center</div>
          </div>
        </div>
      </div>

      {msg && (
        <div className="mb-6 rounded-xl border border-emerald/20 bg-emerald/10 p-4 text-xs font-semibold text-forest">
          {msg}
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Reports Queue */}
        <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-forest/10 pb-4">
            <h3 className="font-bold text-forest">Incoming Incidents</h3>
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs font-semibold text-forest">
              {reports.length}
            </span>
          </div>

          <div className="mt-4 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedReport?.id === r.id
                    ? "border-forest bg-forest text-beige shadow-sm"
                    : "border-forest/10 bg-forest/5 text-forest hover:bg-forest/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold capitalize">{r.category.replace("_", " ")}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      selectedReport?.id === r.id
                        ? "bg-beige text-forest"
                        : "bg-forest/15 text-forest"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className={`mt-2 line-clamp-2 text-[11px] ${selectedReport?.id === r.id ? "text-beige/90" : "text-forest/70"}`}>
                  {r.description}
                </p>
                <div className="mt-2 text-[10px] opacity-70">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Incident Dossier */}
        {selectedReport && (
          <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-forest/10 pb-4">
              <div>
                <span className="rounded bg-emerald/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald">
                  Dossier ID: {selectedReport.id.slice(0, 8)}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold capitalize text-forest">
                  {selectedReport.category.replace("_", " ")}
                </h2>
              </div>
              <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-bold uppercase text-forest">
                Status: {selectedReport.status}
              </span>
            </div>

            <div className="my-6 space-y-4">
              <div className="rounded-xl border border-forest/10 bg-forest/5 p-4">
                <div className="text-xs font-bold text-forest">Field Incident Description</div>
                <p className="mt-1 text-xs sm:text-sm text-forest/80 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                  <div className="text-forest/60">Latitude</div>
                  <div className="font-mono font-bold text-forest">{selectedReport.latitude}°N</div>
                </div>
                <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                  <div className="text-forest/60">Longitude</div>
                  <div className="font-mono font-bold text-forest">{selectedReport.longitude}°E</div>
                </div>
                <div className="rounded-xl border border-forest/10 bg-forest/5 p-3">
                  <div className="text-forest/60">Timestamp</div>
                  <div className="font-bold text-forest">{new Date(selectedReport.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="rounded-xl border border-forest/15 bg-beige p-5">
              <h3 className="font-bold text-forest text-xs uppercase tracking-wider">
                Officer Verification Decision
              </h3>
              <p className="mt-1 text-xs text-forest/70">
                Verifying logs an immutable entry in the platform audit trail and elevates priority for ranger dispatch:
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleDecision("verified")}
                  disabled={actionLoading || selectedReport.status === "verified"}
                  className="flex items-center gap-2 rounded-xl bg-forest px-5 py-2.5 text-xs font-bold text-beige shadow transition hover:bg-forest/90 disabled:opacity-40"
                >
                  <CheckCircle className="h-4 w-4 text-emerald" />
                  <span>Verify Incident & Dispatch Rangers</span>
                </button>

                <button
                  onClick={() => handleDecision("rejected")}
                  disabled={actionLoading || selectedReport.status === "rejected"}
                  className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                >
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Dismiss as False Alarm</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
