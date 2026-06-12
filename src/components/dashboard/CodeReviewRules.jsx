import { motion } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, Zap, Flame, Wrench, TestTube2, Layers } from "lucide-react";

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

function PriorityIcon({ priority }) {
  if (priority === "critical") return <Zap className="w-4 h-4 text-red-400" />;
  if (priority === "high") return <Flame className="w-4 h-4 text-orange-400" />;
  return <Lightbulb className="w-4 h-4 text-yellow-400" />;
}

function CategoryIcon({ category }) {
  const icons = {
    Prevention: Wrench,
    Testing: TestTube2,
    Architecture: Layers,
    Infrastructure: Zap,
    Maintenance: Wrench,
  };
  const Icon = icons[category] || Wrench;
  return <Icon className="w-3.5 h-3.5" />;
}

export default function CodeReviewRules({ recommendations, expandedRec, onToggleRec }) {
  return (
    <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="mb-8">
      <div className="glass rounded-2xl p-6 border-white/5">
        <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          AI Recommendations
          <span className="ml-auto text-xs font-normal bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {recommendations.length} suggestions
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
            >
              <button onClick={() => onToggleRec(rec.id)} className="w-full p-4 text-left cursor-pointer">
                <div className="flex items-start gap-3">
                  <PriorityIcon priority={rec.priority} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">{rec.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={rec.priority} />
                      <span className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded-full border border-white/10 flex items-center gap-1">
                        <CategoryIcon category={rec.category} />
                        {rec.category}
                      </span>
                    </div>
                  </div>
                  {expandedRec === rec.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </div>
              </button>

              {expandedRec === rec.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 pb-4 border-t border-white/5"
                >
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">{rec.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-green-950/20 border border-green-500/10 rounded-lg">
                      <span className="text-[10px] text-green-400 uppercase tracking-wider font-bold block mb-0.5">Impact</span>
                      <span className="text-xs text-gray-300">{rec.impact}</span>
                    </div>
                    <div className="p-2.5 bg-blue-950/20 border border-blue-500/10 rounded-lg">
                      <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold block mb-0.5">Effort</span>
                      <span className="text-xs text-gray-300">{rec.effort}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
