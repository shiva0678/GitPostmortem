import { motion } from "framer-motion";
import { EyeOff } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function SeverityBadge({ severity }) {
  const config = {
    critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
    high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
    medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
    low: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  };
  const c = config[severity] || config.medium;

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {severity}
    </span>
  );
}

export default function BlindSpots({ spots }) {
  return (
    <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6 border-white/5">
      <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
        <EyeOff className="w-5 h-5 text-yellow-400" />
        Blind Spots
        <span className="ml-auto text-xs font-normal bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
          {spots.length} areas
        </span>
      </h2>

      <div className="space-y-4">
        {spots.map((spot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-white/[0.02] rounded-xl border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{spot.area}</span>
              <SeverityBadge severity={spot.risk} />
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">{spot.description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">Test Coverage</span>
                  <span className="font-mono text-red-400">{spot.coverage}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500/60 rounded-full" style={{ width: `${spot.coverage}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
