import { motion } from "framer-motion";
import { FileWarning, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

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

export default function FailurePatterns({ patterns, expandedPattern, onTogglePattern }) {
  return (
    <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border-white/5">
      <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
        <FileWarning className="w-5 h-5 text-red-400" />
        Failure Patterns
        <span className="ml-auto text-xs font-normal bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
          {patterns.length} detected
        </span>
      </h2>

      <div className="space-y-3">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
          >
            <button
              onClick={() => onTogglePattern(pattern.id)}
              className="w-full p-4 flex items-start gap-3 text-left cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{pattern.title}</span>
                  <SeverityBadge severity={pattern.severity} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{pattern.occurrences} occurrences</span>
                  <span>•</span>
                  <span>Last seen {pattern.lastSeen}</span>
                </div>
              </div>
              {expandedPattern === pattern.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </button>

            {expandedPattern === pattern.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="px-4 pb-4 border-t border-white/5"
              >
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">{pattern.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {pattern.files.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20 font-mono">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-green-950/20 border border-green-500/10 rounded-lg">
                  <span className="text-[10px] text-green-400 uppercase tracking-wider font-bold block mb-1">Suggested Fix</span>
                  <p className="text-xs text-gray-300">{pattern.suggestedFix}</p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
