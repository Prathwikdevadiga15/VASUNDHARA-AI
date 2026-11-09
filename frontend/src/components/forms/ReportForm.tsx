"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useReports } from "@/hooks/useReports";
import { submitReport } from "@/services/reports";
import type { ReportCategory } from "@/types";

const ReportMap = dynamic(() => import("@/components/maps/ReportMap"), { ssr: false });
const CATEGORIES: [ReportCategory, string][] = [
  ["forest_fire", "Forest fire or smoke"], ["illegal_logging", "Illegal logging"], ["wildlife_distress", "Wildlife in distress"],
  ["water_pollution", "Water pollution"], ["poaching", "Poaching signs"], ["other", "Other"],
];

export function ReportForm() {
  const { reports, loading, error, refresh } = useReports();
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [category, setCategory] = useState<ReportCategory>("forest_fire");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) return setMsg("Click the map to choose the location first.");
    try {
      await submitReport({ category, description, latitude: picked[0], longitude: picked[1] });
      setDescription(""); setPicked(null); setMsg("Report submitted."); refresh();
    } catch (err) { setMsg(err instanceof Error ? err.message : "Could not submit the report."); }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div><ReportMap reports={reports} picked={picked} onPick={(a, b) => setPicked([a, b])} />
        {loading && <p>Loading reports…</p>}{error && <p role="alert">{error}</p>}
        {!loading && !error && reports.length === 0 && <p>No reports yet. Pick a spot on the map and submit the first one.</p>}</div>
      <form onSubmit={onSubmit} className="grid content-start gap-3">
        <label className="grid gap-1">What did you see?
          <select value={category} onChange={(e) => setCategory(e.target.value as ReportCategory)} className="rounded-lg border p-2">
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label className="grid gap-1">Details
          <textarea required minLength={5} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border p-2" rows={4} /></label>
        <p>{picked ? `Location: ${picked[0].toFixed(4)}, ${picked[1].toFixed(4)}` : "No location chosen yet."}</p>
        <Button type="submit">Submit report</Button>{msg && <p role="status">{msg}</p>}
      </form>
    </div>
  );
}
