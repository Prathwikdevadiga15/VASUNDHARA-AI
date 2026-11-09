"use client";
import { useCallback, useEffect, useState } from "react";
import { listReports } from "@/services/reports";
import type { Report } from "@/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { setReports(await listReports()); setError(null); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load reports."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { reports, loading, error, refresh };
}
