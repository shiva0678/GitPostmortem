import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileWarning, ShieldAlert } from "lucide-react";
import { Card, EmptyState, StatusBadge } from "../common";

export default function FailurePatterns({ patterns, expandedPattern, onTogglePattern }) {
  if (!patterns?.length) {
    return (
      <Card title="Failure Patterns" subtitle="Recurring regressions detected in the repository" icon={FileWarning} accent="text-red-400" delay={0.2}>
        <EmptyState title="No failure patterns to display" description="The pattern analysis is currently empty." />
      </Card>
    );
  }

  return (
    <Card
      title="Failure Patterns"
      subtitle="Recurring regressions that have resurfaced in the repository"
      icon={FileWarning}
      accent="text-red-400"
      delay={0.2}
    >
      <div className="space-y-3">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
            <button onClick={() => onTogglePattern(pattern.id)} className="flex w-full items-start gap-3 p-4 text-left">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white">{pattern.title}</span>
                  <StatusBadge severity={pattern.severity} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{pattern.occurrences} occurrences</span>
                  <span>•</span>
                  <span>Last seen {pattern.lastSeen}</span>
                </div>
              </div>
              {expandedPattern === pattern.id ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
              )}
            </button>

            {expandedPattern === pattern.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-white/10 px-4 pb-4">
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{pattern.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pattern.files.map((file, index) => (
                    <span key={`${file}-${index}`} className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-mono text-purple-300">
                      {file}
                    </span>
                  ))}
                </div>
                <div className="mt-3 rounded-xl border border-green-500/10 bg-green-950/20 p-3">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-green-400">Suggested fix</span>
                  <p className="text-xs text-gray-300">{pattern.suggestedFix}</p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
