"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Moon, Sun, Users, UserPlus, Activity, ShieldCheck } from "lucide-react"

function ThemeToggle() {
  const toggle = () => {
    const html = document.documentElement
    const isDark = html.classList.contains("dark")
    html.classList.toggle("dark", !isDark)
  }
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 rounded-xl border border-[--border] px-3 py-2 text-sm hover:bg-[--muted]">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}

function Stat({ label, value, trend, icon, bg, fg }: { label: string; value: string; trend: string; icon: React.ReactNode; bg: string; fg: string }) {
  const trendTone = trend.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
  return (
    <div className="rounded-2xl border border-[--border] bg-[--card] shadow-sm p-6 flex items-center justify-between">
      <div>
        <div className="text-sm text-[--muted-foreground]">{label}</div>
        <div className="mt-2 text-3xl font-semibold">{value}</div>
        <div className={"mt-1 text-xs " + trendTone}>{trend} vs last week</div>
      </div>
      <div className="h-12 w-12 rounded-xl grid place-content-center" style={{ backgroundColor: bg, color: fg }}>
        {icon}
      </div>
    </div>
  )
}

function LineAreaChart({ a, b, labels, strokeA, strokeB, fillA, fillB }: { a: number[]; b: number[]; labels: string[]; strokeA: string; strokeB: string; fillA: string; fillB: string }) {
  const w = 640
  const h = 240
  const pad = 32
  const max = Math.max(...a, ...b, 1)
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(labels.length - 1, 1)
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2)
  const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ")
  const area = (arr: number[]) => `M ${x(0)} ${y(arr[0])} ${arr.map((v, i) => `L ${x(i)} ${y(v)}`).join(" ")} L ${x(arr.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64">
      {Array.from({ length: 4 }).map((_, i) => {
        const gy = pad + (i * (h - pad * 2)) / 3
        return <line key={i} x1={pad} y1={gy} x2={w - pad} y2={gy} className="stroke-[--border]" strokeDasharray="4 4" />
      })}
      <defs>
        <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fillA} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fillA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fillB} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fillB} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area(a)} fill="url(#ga)" />
      <path d={area(b)} fill="url(#gb)" />
      <path d={path(a)} fill="none" stroke={strokeA} strokeWidth={2} />
      <path d={path(b)} fill="none" stroke={strokeB} strokeWidth={2} />
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={h - pad + 18} textAnchor="middle" className="fill-[--muted-foreground] text-[10px]">{l}</text>
      ))}
    </svg>
  )
}

function GroupedBarChart({ a, b, labels, ca, cb }: { a: number[]; b: number[]; labels: string[]; ca: string; cb: string }) {
  const w = 640
  const h = 240
  const pad = 32
  const groups = labels.length
  const max = Math.max(...a, ...b, 1)
  const gW = (w - pad * 2) / Math.max(groups, 1)
  const bw = gW / 2.6
  const xg = (i: number) => pad + i * gW + gW / 2
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64">
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} className="stroke-[--border]" />
      {labels.map((l, i) => (
        <text key={l} x={xg(i)} y={h - pad + 18} textAnchor="middle" className="fill-[--muted-foreground] text-[10px]">{l}</text>
      ))}
      {labels.map((_, i) => {
        const xA = xg(i) - bw - 2
        const xB = xg(i) + 2
        const ha = h - pad - y(a[i])
        const hb = h - pad - y(b[i])
        return (
          <g key={i}>
            <rect x={xA} y={y(a[i])} width={bw} height={ha} rx="6" fill={ca} />
            <rect x={xB} y={y(b[i])} width={bw} height={hb} rx="6" fill={cb} />
          </g>
        )
      })}
    </svg>
  )
}

export default function DashboardPage() {
  const labels = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], [])
  const active = useMemo(() => [320, 342, 355, 371, 389, 412, 405], [])
  const newly = useMemo(() => [58, 64, 62, 71, 77, 82, 68], [])
  const months = useMemo(() => ["Apr", "May", "Jun", "Jul", "Aug"], [])
  const approved = useMemo(() => [42, 54, 63, 71, 76], [])
  const pending = useMemo(() => [17, 14, 19, 22, 18], [])
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[--muted-foreground]">User and role analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/users" className="rounded-xl border border-[--border] px-4 py-2 text-sm font-medium hover:bg-[--muted]">Manage Users</Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total Users" value="1,445" trend="+4.2%" icon={<Users className="h-5 w-5" />} bg="oklch(0.967 0.003 264.542)" fg="oklch(0.21 0.034 264.665)" />
        <Stat label="New This Week" value="482" trend="+7.9%" icon={<UserPlus className="h-5 w-5" />} bg="oklch(0.6 0.118 184.704 / 0.2)" fg="oklch(0.6 0.118 184.704)" />
        <Stat label="Active Daily" value="405" trend="+3.1%" icon={<Activity className="h-5 w-5" />} bg="oklch(0.646 0.222 41.116 / 0.2)" fg="oklch(0.646 0.222 41.116)" />
        <Stat label="Compliant" value="98.4%" trend="+0.4%" icon={<ShieldCheck className="h-5 w-5" />} bg="oklch(0.398 0.07 227.392 / 0.2)" fg="oklch(0.398 0.07 227.392)" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[--border] bg-[--card] shadow-sm p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active vs New Users</h3>
          </div>
          <LineAreaChart a={active} b={newly} labels={labels} strokeA="oklch(0.488 0.243 264.376)" strokeB="oklch(0.6 0.118 184.704)" fillA="oklch(0.488 0.243 264.376)" fillB="oklch(0.6 0.118 184.704)" />
        </div>

        <div className="rounded-2xl border border-[--border] bg-[--card] shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Approvals Pipeline</h3>
          </div>
          <GroupedBarChart a={approved} b={pending} labels={months} ca="oklch(0.828 0.189 84.429)" cb="oklch(0.769 0.188 70.08)" />
        </div>
      </div>

      <div className="rounded-2xl border border-[--border] bg-[--card] shadow-sm p-6 mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Users</h3>
          <Link href="/users" className="rounded-xl border border-[--border] px-3 py-2 text-sm hover:bg-[--muted]">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[--border]">
              <tr className="text-[--muted-foreground]">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-[--border]">
              {[
                { name: "Aditi Sharma", email: "aditi@acme.io", role: "Manager", status: "Active" },
                { name: "Rahul Mehta", email: "rahul@acme.io", role: "Editor", status: "Invited" },
                { name: "Neha Verma", email: "neha@acme.io", role: "Viewer", status: "Active" },
                { name: "Vikram Singh", email: "vikram@acme.io", role: "Admin", status: "Suspended" }
              ].map((u) => (
                <tr key={u.email}>
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3"><span className="rounded-full px-2 py-1 text-xs bg-[--muted]">{u.role}</span></td>
                  <td className="py-3">
                    <span className={
                      u.status === "Active"
                        ? "rounded-full px-2 py-1 text-xs text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30"
                        : u.status === "Invited"
                        ? "rounded-full px-2 py-1 text-xs text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30"
                        : "rounded-full px-2 py-1 text-xs text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/30"
                    }>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
