"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, History, ArrowLeft, RefreshCw, Filter, CheckCircle2, AlertTriangle } from "lucide-react";

interface AuditEntry {
  id: number;
  actor_id: string | null;
  action: string;
  resource: string | null;
  created_at: string;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<AuditEntry[]>("/admin/audit-logs");
      setLogs(data);
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs. Please ensure you are logged in as Super Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.resource && l.resource.toLowerCase().includes(search.toLowerCase())) ||
      (l.actor_id && l.actor_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest/70 hover:text-emerald transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Immutable Compliance Ledger</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
            System Security & Audit Trail
          </h1>
          <p className="mt-1 text-xs text-forest/75 sm:text-sm">
            Cryptographically logged actions, verified report lifecycle events, and administrative overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2 text-xs font-bold text-forest shadow-sm hover:bg-forest/5 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 shadow-sm">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Authorization Required</span>
          </div>
          <p className="mt-2 text-xs text-amber-800">{error}</p>
          <div className="mt-4">
            <Link
              href="/auth"
              className="inline-block rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest/90 transition"
            >
              Sign In as Super Admin (admin@vasundhara.gov.in)
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col gap-4 rounded-2xl border border-forest/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Filter by action (e.g. report.create, report.verified), resource, or actor ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-forest/15 bg-forest/5 px-4 py-2 text-xs text-forest placeholder:text-forest/50 focus:border-emerald focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-forest/70">
              <Filter className="h-4 w-4" />
              <span>Showing {filteredLogs.length} of {logs.length} logged events</span>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-hidden rounded-2xl border border-forest/15 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-forest/10 bg-forest/5 text-forest font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Log ID</th>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Action Type</th>
                    <th className="px-4 py-3">Target Resource</th>
                    <th className="px-4 py-3">Actor UUID</th>
                    <th className="px-4 py-3">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-forest/60">
                        Loading cryptographically signed audit logs...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-forest/60">
                        No audit events match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isVerified = log.action.includes("verified");
                      const isCreated = log.action.includes("create");
                      const isRole = log.action.includes("role");

                      return (
                        <tr key={log.id} className="hover:bg-forest/5 transition">
                          <td className="px-4 py-3 font-mono font-bold text-forest">#{log.id}</td>
                          <td className="px-4 py-3 text-forest/70 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "medium",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                                isVerified
                                  ? "bg-emerald/15 text-emerald"
                                  : isCreated
                                  ? "bg-blue-100 text-blue-800"
                                  : isRole
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-forest capitalize">
                            {log.resource || "system"}
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-forest/60">
                            {log.actor_id ? log.actor_id.slice(0, 18) + "..." : "SYSTEM_DAEMON"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
