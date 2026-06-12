import { motion } from "framer-motion";
import { AlertCircle, Calendar, Clock, Code2, GitBranch, GitFork, Sparkles, Star, Users } from "lucide-react";
import { GithubIcon } from "../GithubIcon";
import { Card, EmptyState } from "../common";

const formatCompactNumber = (value) => {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
};

export default function RepositorySummary({ data }) {
  const repository = data ?? {};

  const quickStats = [
    { icon: Star, label: "Stars", value: formatCompactNumber(repository.stars), color: "text-yellow-400" },
    { icon: GitFork, label: "Forks", value: formatCompactNumber(repository.forks), color: "text-cyan-400" },
    { icon: AlertCircle, label: "Open issues", value: repository.openIssues ?? "—", color: "text-orange-400" },
  ];

  const metadata = [
    { icon: Code2, label: "Language", value: repository.language ?? "Unknown", color: "text-yellow-400" },
    { icon: GitBranch, label: "Commits", value: repository.totalCommits?.toLocaleString() ?? "—", color: "text-blue-400" },
    { icon: Users, label: "Contributors", value: repository.contributors?.toLocaleString() ?? "—", color: "text-green-400" },
    { icon: GitBranch, label: "Branches", value: repository.branches ?? "—", color: "text-purple-400" },
    { icon: Clock, label: "Last Commit", value: repository.lastCommit ?? "—", color: "text-cyan-400" },
    { icon: Calendar, label: "Created", value: repository.createdAt ?? "—", color: "text-pink-400" },
  ];

  if (!repository.name) {
    return (
      <Card className="mb-8" title="Repository Intelligence" subtitle="Repository snapshot and growth signals" icon={Sparkles} accent="text-purple-400" delay={0.05}>
        <EmptyState title="Repository summary unavailable" description="The repository metadata could not be rendered. Please refresh and try again." />
      </Card>
    );
  }

  return (
    <Card
      className="mb-8"
      title="Repository Intelligence"
      subtitle="A polished snapshot of the repository health and contributor momentum"
      icon={Sparkles}
      accent="text-purple-400"
      delay={0.05}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 ring-1 ring-white/10">
              <GithubIcon className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-semibold text-white">{repository.name}</h3>
              <p className="text-sm text-gray-400">{repository.url}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {quickStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.06 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300"
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[280px]">
          {metadata.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                {item.label}
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
