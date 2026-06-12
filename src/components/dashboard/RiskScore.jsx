import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function RiskGauge({ score }) {
  const angle = (score / 100) * 180 - 90;
  const getColor = (s) => {
    if (s <= 30) return "#22c55e";
    if (s <= 60) return "#eab308";
    if (s <= 80) return "#f97316";
    return "#ef4444";
  };
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="33%" stopColor="#eab308" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          />
          <line
            x1="100"
            y1="95"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={95 + 60 * Math.sin((angle * Math.PI) / 180)}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="95" r="5" fill={color} />
        </svg>
      </div>
      <div className="text-center -mt-2">
        <span className="text-4xl font-display font-extrabold" style={{ color }}>
          {score}
        </span>
        <span className="text-lg text-gray-500 ml-1">/100</span>
      </div>
    </div>
  );
}

export default function RiskScore({ data }) {
  return (
    <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border-white/5">
      <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-400" />
        Risk Score
      </h2>

      <RiskGauge score={data.overall} />

      <p className="text-center text-sm text-orange-400 font-semibold mt-2 mb-6">
        {data.label}
      </p>

      <div className="space-y-3">
        {data.breakdown.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{item.category}</span>
              <span className="font-mono text-white">{item.score}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.score}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="h-full rounded-full"
                style={{
                  background:
                    item.score > 75
                      ? "linear-gradient(to right, #f97316, #ef4444)"
                      : item.score > 50
                      ? "linear-gradient(to right, #eab308, #f97316)"
                      : "linear-gradient(to right, #22c55e, #eab308)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
