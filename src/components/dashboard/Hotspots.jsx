import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, EmptyState } from "../common";

export default function Hotspots({ hotspots }) {
  const hotspotData = Array.isArray(hotspots) ? hotspots.slice(0, 6) : [];

  if (!hotspotData.length) {
    return (
      <Card className="mb-8" title="Code Hotspots" subtitle="Files with the highest change velocity and defect concentration" icon={Flame} accent="text-orange-400" delay={0.1}>
        <EmptyState title="Hotspot data unavailable" description="No hotspot activity metrics were provided for this section." />
      </Card>
    );
  }

  return (
    <Card className="mb-8" title="Code Hotspots" subtitle="Files with the highest change velocity and defect concentration" icon={Flame} accent="text-orange-400" delay={0.1}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hotspotData} layout="vertical" margin={{ top: 8, right: 14, left: 10, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="file"
                width={130}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(3, 7, 18, 0.92)",
                  color: "#f8fafc",
                }}
              />
              <Bar dataKey="risk" fill="#22d3ee" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {hotspotData.map((file, index) => (
            <motion.div
              key={`${file.file}-${index}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + index * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-cyan-300">{file.file}</span>
                <span className="text-xs text-gray-400">{file.risk}/100</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/5">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${file.risk}%`,
                    background: file.risk > 80 ? "linear-gradient(90deg, #fb923c, #ef4444)" : file.risk > 60 ? "linear-gradient(90deg, #facc15, #f97316)" : "linear-gradient(90deg, #4ade80, #22d3ee)",
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{file.changes} changes</span>
                <span>{file.bugs} bugs</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
