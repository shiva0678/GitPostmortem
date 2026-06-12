import { Activity } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, EmptyState } from "../common";

export default function TimelineChart({ data }) {
  const chartData = Array.isArray(data) ? data : [];

  if (!chartData.length) {
    return (
      <Card className="lg:col-span-2" title="Commit Activity Timeline" subtitle="Bugs, fixes, and feature velocity over time" icon={Activity} accent="text-purple-400" delay={0.15}>
        <EmptyState title="Timeline data unavailable" description="No commit activity data was provided for this view." />
      </Card>
    );
  }

  const totals = chartData.reduce(
    (acc, item) => ({
      bugs: acc.bugs + item.bugs,
      fixes: acc.fixes + item.fixes,
      features: acc.features + item.features,
    }),
    { bugs: 0, fixes: 0, features: 0 }
  );

  return (
    <Card className="lg:col-span-2" title="Commit Activity Timeline" subtitle="A responsive view of bugs, fixes, and feature delivery across the year" icon={Activity} accent="text-purple-400" delay={0.15}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="bugsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="fixesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="featuresGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(3, 7, 18, 0.92)",
                color: "#f8fafc",
              }}
            />
            <Area type="monotone" dataKey="bugs" stroke="#fb7185" fill="url(#bugsGradient)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="fixes" stroke="#4ade80" fill="url(#fixesGradient)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="features" stroke="#a78bfa" fill="url(#featuresGradient)" strokeWidth={2.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-center">
          <span className="text-xl font-display font-semibold text-red-400">{totals.bugs}</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Total bugs</span>
        </div>
        <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-3 text-center">
          <span className="text-xl font-display font-semibold text-green-400">{totals.fixes}</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Total fixes</span>
        </div>
        <div className="rounded-xl border border-purple-500/10 bg-purple-500/5 p-3 text-center">
          <span className="text-xl font-display font-semibold text-purple-400">{totals.features}</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Total features</span>
        </div>
      </div>
    </Card>
  );
}
