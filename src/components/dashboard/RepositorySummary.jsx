import { motion } from "framer-motion";
import { Star, GitFork, AlertCircle, Code2, Users, GitBranch, Clock, Calendar } from "lucide-react";
import { GithubIcon } from "../GithubIcon";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function RepositorySummary({ data }) {
  return (
    <motion.section {...fadeUp} className="mb-8">
      <div className="glass rounded-2xl p-6 md:p-8 border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
              <GithubIcon className="w-7 h-7 text-gray-400" />
              {data.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{data.url}</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{(data.stars / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span>{(data.forks / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span>{data.openIssues}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: Code2, label: "Language", value: data.language, color: "text-yellow-400" },
            { icon: GitBranch, label: "Commits", value: data.totalCommits.toLocaleString(), color: "text-blue-400" },
            { icon: Users, label: "Contributors", value: data.contributors.toLocaleString(), color: "text-green-400" },
            { icon: GitBranch, label: "Branches", value: data.branches, color: "text-purple-400" },
            { icon: Clock, label: "Last Commit", value: data.lastCommit, color: "text-cyan-400" },
            { icon: Calendar, label: "Created", value: data.createdAt, color: "text-pink-400" },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
