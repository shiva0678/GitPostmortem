import { motion } from "framer-motion";
import { EyeOff } from "lucide-react";
import { Card, EmptyState, StatusBadge } from "../common";

export default function BlindSpots({ spots }) {
  if (!spots?.length) {
    return (
      <Card title="Blind Spots" subtitle="Untested or weakly covered areas" icon={EyeOff} accent="text-yellow-400" delay={0.25}>
        <EmptyState title="No blind spots detected" description="Coverage gaps will appear here once the analysis report is ready." />
      </Card>
    );
  }

  return (
    <Card title="Blind Spots" subtitle="Untested or weakly covered areas" icon={EyeOff} accent="text-yellow-400" delay={0.25}>
      <div className="space-y-4">
        {spots.map((spot, index) => (
          <motion.div
            key={`${spot.area}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + index * 0.04 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white">{spot.area}</span>
              <StatusBadge severity={spot.risk} />
            </div>
            <p className="mb-3 text-xs leading-relaxed text-gray-400">{spot.description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-[10px]">
                  <span className="text-gray-500">Test coverage</span>
                  <span className="font-mono text-red-400">{spot.coverage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500/70 to-orange-400/80" style={{ width: `${spot.coverage}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
