import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function TimelineChart({ data }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.bugs, d.fixes, d.features]));

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 glass rounded-2xl p-6 border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Commit Activity Timeline
        </h2>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/70" /> Bugs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-500/70" /> Fixes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/70" /> Features
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-48 px-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex gap-[2px] items-end h-36 w-full">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(item.bugs / maxVal) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex-1 bg-red-500/70 rounded-t-sm min-h-[2px]"
                title={`Bugs: ${item.bugs}`}
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(item.fixes / maxVal) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                className="flex-1 bg-green-500/70 rounded-t-sm min-h-[2px]"
                title={`Fixes: ${item.fixes}`}
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${(item.features / maxVal) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                className="flex-1 bg-purple-500/70 rounded-t-sm min-h-[2px]"
                title={`Features: ${item.features}`}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-mono">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-center">
          <span className="text-xl font-display font-bold text-red-400">
            {data.reduce((a, d) => a + d.bugs, 0)}
          </span>
          <span className="block text-[10px] text-gray-500 mt-0.5">Total Bugs</span>
        </div>
        <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/10 text-center">
          <span className="text-xl font-display font-bold text-green-400">
            {data.reduce((a, d) => a + d.fixes, 0)}
          </span>
          <span className="block text-[10px] text-gray-500 mt-0.5">Total Fixes</span>
        </div>
        <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-center">
          <span className="text-xl font-display font-bold text-purple-400">
            {data.reduce((a, d) => a + d.features, 0)}
          </span>
          <span className="block text-[10px] text-gray-500 mt-0.5">Total Features</span>
        </div>
      </div>
    </motion.div>
  );
}
