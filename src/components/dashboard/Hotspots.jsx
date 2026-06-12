import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Hotspots({ hotspots }) {
  return (
    <motion.section {...fadeUp} transition={{ delay: 0.15 }} className="mb-8">
      <div className="glass rounded-2xl p-6 border-white/5">
        <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Code Hotspots
          <span className="text-xs text-gray-500 font-normal ml-2">Most changed, most bug-prone files</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-gray-500 font-mono border-b border-white/5">
                <th className="text-left py-3 px-3">File Path</th>
                <th className="text-center py-3 px-3">Changes</th>
                <th className="text-center py-3 px-3">Bugs</th>
                <th className="text-center py-3 px-3">Risk</th>
                <th className="text-right py-3 px-3">Heat</th>
              </tr>
            </thead>
            <tbody>
              {hotspots.map((file, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-xs text-cyan-300 truncate max-w-[300px]">
                    {file.file}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-300">{file.changes}</td>
                  <td className="py-3 px-3 text-center text-red-400 font-semibold">{file.bugs}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className="font-mono font-bold"
                      style={{
                        color: file.risk > 80 ? "#ef4444" : file.risk > 60 ? "#f97316" : "#eab308",
                      }}
                    >
                      {file.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden ml-auto">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${file.risk}%`,
                          background:
                            file.risk > 80
                              ? "linear-gradient(to right, #f97316, #ef4444)"
                              : file.risk > 60
                              ? "linear-gradient(to right, #eab308, #f97316)"
                              : "linear-gradient(to right, #22c55e, #eab308)",
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
