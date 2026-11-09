import Link from "next/link";

const LINKS: Record<string, [string, string][]> = {
  citizen: [["/dashboard/overview", "Overview"], ["/reports", "My reports"]],
  officer: [["/officer/overview", "Overview"], ["/officer/verify-reports", "Verify reports"]],
  admin: [["/admin/dashboard", "Dashboard"], ["/admin/users", "Users"], ["/admin/audit-logs", "Audit logs"]],
};
export function Sidebar({ group }: { group: keyof typeof LINKS }) {
  return <aside className="w-56 shrink-0 border-r border-forest/10 p-4"><ul className="grid gap-2">
    {LINKS[group].map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></aside>;
}
