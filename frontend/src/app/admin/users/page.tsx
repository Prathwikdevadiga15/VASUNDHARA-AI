"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Users, ArrowLeft, RefreshCw, UserCheck, ShieldAlert, AlertTriangle, Check } from "lucide-react";

interface UserItem {
  id: string;
  full_name: string;
  email: string;
  roles: string[];
}

const AVAILABLE_ROLES = [
  { id: "citizen", label: "Citizen / Volunteer", color: "bg-blue-100 text-blue-800" },
  { id: "officer", label: "Forest Officer", color: "bg-emerald/15 text-emerald" },
  { id: "researcher", label: "Ecological Researcher", color: "bg-purple-100 text-purple-800" },
  { id: "ngo", label: "NGO Coordinator", color: "bg-amber-100 text-amber-800" },
  { id: "super_admin", label: "Super Admin", color: "bg-rose-100 text-rose-800" },
];

export default function UsersAdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<UserItem[]>("/admin/users");
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users. Please ensure you are logged in as Super Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setSuccessMsg("");
    setError("");

    try {
      await api(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setSuccessMsg(`Role successfully updated to "${newRole}".`);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

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
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
            User Directory & Governance
          </h1>
          <p className="mt-1 text-xs text-forest/75 sm:text-sm">
            Manage authenticated accounts, enforce least-privilege role separation, and inspect credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2 text-xs font-bold text-forest shadow-sm hover:bg-forest/5 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Users</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald/30 bg-emerald/10 p-4 text-xs font-bold text-emerald">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

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
          {/* User Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading && users.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-forest/10 bg-white p-12 text-center text-xs text-forest/60">
                Loading encrypted user directory...
              </div>
            ) : (
              users.map((u) => {
                const currentRole = u.roles[0] || "citizen";
                const isCurrent = currentUser?.email === u.email;

                return (
                  <div
                    key={u.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-forest/15 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 font-bold text-forest">
                          {u.full_name.charAt(0)}
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${AVAILABLE_ROLES.find((r) => r.id === currentRole)?.color || "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {currentRole.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold text-forest text-sm">{u.full_name}</h3>
                      <p className="text-xs text-forest/70 font-mono">{u.email}</p>
                      <p className="mt-1 text-[10px] font-mono text-forest/50 truncate">ID: {u.id}</p>
                    </div>

                    <div className="mt-5 border-t border-forest/10 pt-4">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-forest/70 block mb-1.5">
                        Assign Role:
                      </label>
                      <select
                        value={currentRole}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="w-full rounded-xl border border-forest/20 bg-forest/5 px-3 py-1.5 text-xs font-semibold text-forest focus:border-emerald focus:bg-white focus:outline-none disabled:opacity-50"
                      >
                        {AVAILABLE_ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      {isCurrent && (
                        <p className="mt-1 text-[10px] font-bold text-emerald text-right">
                          ★ Currently Logged In
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </main>
  );
}
