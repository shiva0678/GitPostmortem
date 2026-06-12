import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { Card, EmptyState } from "../common";

function RiskGauge({ score }) {
  const getColor = (value) => {
    if (value <= 30) return "#22c55e";
    if (value <= 60) return "#eab308";
    if (value <= 80) return "#f97316";
    return "#ef4444";
  };

  const color = getColor(score);
  const data = [{ name: "score", value: score, fill: color }];

  return (
    <div className="relative mx-auto h-56 w-full max-w-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background clockWise dataKey="value" cornerRadius={999} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-display font-semibold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm uppercase tracking-[0.2em] text-gray-500">/100</span>
      </div>
    </div>
  );
}

export default function RiskScore({ data }) {
  const riskData = data ?? {};

  if (!riskData.breakdown?.length) {
    return (
      <Card title="Risk Score" subtitle="Risk posture against recurring failure patterns" icon={Shield} accent="text-orange-400" delay={0.1}>
        <EmptyState title="Risk summary unavailable" description="No risk breakdown data was supplied for this card." />
      </Card>
    );
  }

  return (
    <Card title="Risk Score" subtitle="Risk posture against recurring failure patterns" icon={Shield} accent="text-orange-400" delay={0.1}>
      <RiskGauge score={riskData.overall ?? 0} />

      <p className="mt-2 text-center text-sm font-semibold text-orange-400">{riskData.label}</p>

      <div className="mt-6 space-y-3">
        {riskData.breakdown.map((item, index) => (
          <div key={`${item.category}-${index}`} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{item.category}</span>
              <span className="font-mono text-white">{item.score}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ delay: 0.18 + index * 0.06, duration: 0.45 }}
                className="h-full rounded-full"
                style={{
                  background: item.score > 75 ? "linear-gradient(90deg, #f97316, #ef4444)" : item.score > 50 ? "linear-gradient(90deg, #eab308, #f97316)" : "linear-gradient(90deg, #22c55e, #eab308)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
