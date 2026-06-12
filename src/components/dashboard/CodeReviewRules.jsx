import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Flame, Layers, Lightbulb, TestTube2, Wrench, Zap } from "lucide-react";
import { Card, EmptyState, StatusBadge } from "../common";

function PriorityIcon({ priority }) {
  if (priority === "critical") return <Zap className="h-4 w-4 text-red-400" />;
  if (priority === "high") return <Flame className="h-4 w-4 text-orange-400" />;
  return <Lightbulb className="h-4 w-4 text-yellow-400" />;
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
  return <Icon className="h-3.5 w-3.5" />;
}

export default function CodeReviewRules({ recommendations, expandedRec, onToggleRec }) {
  if (!recommendations?.length) {
    return (
      <Card title="AI Recommendations" subtitle="Actionable next steps for engineering guardrails" icon={Lightbulb} accent="text-cyan-400" delay={0.3}>
        <EmptyState title="No recommendations available" description="Recommendations will appear here once the analysis completes." />
      </Card>
    );
  }

  return (
    <Card title="AI Recommendations" subtitle="Actionable next steps for engineering guardrails" icon={Lightbulb} accent="text-cyan-400" delay={0.3}>
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((rec) => (
          <div key={rec.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
            <button onClick={() => onToggleRec(rec.id)} className="w-full p-4 text-left">
              <div className="flex items-start gap-3">
                <PriorityIcon priority={rec.priority} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">{rec.title}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge severity={rec.priority} />
                    <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-400">
                      <CategoryIcon category={rec.category} />
                      {rec.category}
                    </span>
                  </div>
                </div>
                {expandedRec === rec.id ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </div>
            </button>

            {expandedRec === rec.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-white/10 px-4 pb-4">
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{rec.description}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-green-500/10 bg-green-950/20 p-2.5">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">Impact</span>
                    <span className="text-xs text-gray-300">{rec.impact}</span>
                  </div>
                  <div className="rounded-xl border border-cyan-500/10 bg-cyan-950/20 p-2.5">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">Effort</span>
                    <span className="text-xs text-gray-300">{rec.effort}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
