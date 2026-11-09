import { api } from "@/lib/api";
import type { Report, ReportCategory } from "@/types";

export const listReports = () => api<Report[]>("/reports");
export const submitReport = (data: { category: ReportCategory; description: string; latitude: number; longitude: number }) =>
  api<Report>("/reports", { method: "POST", body: JSON.stringify(data) });
export const verifyReport = (id: string, decision: "verified" | "rejected") =>
  api<Report>(`/reports/${id}/verify`, { method: "POST", body: JSON.stringify({ decision }) });
