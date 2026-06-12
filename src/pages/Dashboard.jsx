import { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Github,
  Star,
  GitFork,
  AlertCircle,
  Code2,
  Users,
  GitBranch,
  Clock,
  Calendar,
  Scale,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Flame,
  FileWarning,
  Eye,
  EyeOff,
  Lightbulb,
  Zap,
  Wrench,
  TestTube2,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { mockAnalysisResult } from "../data/mockData";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function RiskGauge({ score }) {
  const angle = (score / 100) * 180 - 90;
  const getColor = (s) => {
    if (s <= 30) return "#22c55e";
    if (s <= 60) return "#eab308";
    if (s <= 80) return "#f97316";
    return "#ef4444";
  };
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="33%" stopColor="#eab308" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          />
          {/* Needle */}
          <line
            x1="100"
            y1="95"
            x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
            y2={95 + 60 * Math.sin((angle * Math.PI) / 180)}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="95" r="5" fill={color} />
        </svg>
      </div>
      <div className="text-center -mt-2">
        <span className="text-4xl font-display font-extrabold" style={{ color }}>
          {score}
        </span>
        <span className="text-lg text-gray-500 ml-1">/100</span>
      </div>
    </div>
  );
}

function TimelineChart({ data }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.bugs, d.fixes, d.features]));

  return (
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
  );
}

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

export default function Dashboard({ repoUrl, onBack }) {
  const data = mockAnalysisResult;
  const [expandedPattern, setExpandedPattern] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#030014] rounded-[7px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-sm tracking-tight">GitPostmortem</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-400 font-mono max-w-xs truncate">
              <Github className="w-3.5 h-3.5 shrink-0" />
              {repoUrl}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/20 text-xs font-semibold text-purple-300">
              Analysis Complete
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Repository Summary */}
        <motion.section {...fadeUp} className="mb-8">
          <div className="glass rounded-2xl p-6 md:p-8 border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                  <Github className="w-7 h-7 text-gray-400" />
                  {data.repository.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">{data.repository.url}</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{(data.repository.stars / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-blue-400" />
                  <span>{(data.repository.forks / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span>{data.repository.openIssues}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Code2, label: "Language", value: data.repository.language, color: "text-yellow-400" },
                { icon: GitBranch, label: "Commits", value: data.repository.totalCommits.toLocaleString(), color: "text-blue-400" },
                { icon: Users, label: "Contributors", value: data.repository.contributors.toLocaleString(), color: "text-green-400" },
                { icon: GitBranch, label: "Branches", value: data.repository.branches, color: "text-purple-400" },
                { icon: Clock, label: "Last Commit", value: data.repository.lastCommit, color: "text-cyan-400" },
                { icon: Calendar, label: "Created", value: data.repository.createdAt, color: "text-pink-400" },
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

        {/* Risk Score + Timeline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Score */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border-white/5">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              Risk Score
            </h2>

            <RiskGauge score={data.riskScore.overall} />

            <p className="text-center text-sm text-orange-400 font-semibold mt-2 mb-6">
              {data.riskScore.label}
            </p>

            <div className="space-y-3">
              {data.riskScore.breakdown.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.category}</span>
                    <span className="font-mono text-white">{item.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.score}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          item.score > 75
                            ? "linear-gradient(to right, #f97316, #ef4444)"
                            : item.score > 50
                            ? "linear-gradient(to right, #eab308, #f97316)"
                            : "linear-gradient(to right, #22c55e, #eab308)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline Chart */}
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

            <TimelineChart data={data.timeline} />

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-center">
                <span className="text-xl font-display font-bold text-red-400">
                  {data.timeline.reduce((a, d) => a + d.bugs, 0)}
                </span>
                <span className="block text-[10px] text-gray-500 mt-0.5">Total Bugs</span>
              </div>
              <div className="p-3 bg-green-500/5 rounded-xl border border-green-500/10 text-center">
                <span className="text-xl font-display font-bold text-green-400">
                  {data.timeline.reduce((a, d) => a + d.fixes, 0)}
                </span>
                <span className="block text-[10px] text-gray-500 mt-0.5">Total Fixes</span>
              </div>
              <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 text-center">
                <span className="text-xl font-display font-bold text-purple-400">
                  {data.timeline.reduce((a, d) => a + d.features, 0)}
                </span>
                <span className="block text-[10px] text-gray-500 mt-0.5">Total Features</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hotspots */}
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
                  {data.hotspots.map((file, i) => (
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

        {/* Failure Patterns + Blind Spots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Failure Patterns */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border-white/5">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-red-400" />
              Failure Patterns
              <span className="ml-auto text-xs font-normal bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                {data.failurePatterns.length} detected
              </span>
            </h2>

            <div className="space-y-3">
              {data.failurePatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
                >
                  <button
                    onClick={() => setExpandedPattern(expandedPattern === pattern.id ? null : pattern.id)}
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
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        {pattern.description}
                      </p>
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

          {/* Blind Spots */}
          <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="glass rounded-2xl p-6 border-white/5">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-yellow-400" />
              Blind Spots
              <span className="ml-auto text-xs font-normal bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                {data.blindSpots.length} areas
              </span>
            </h2>

            <div className="space-y-4">
              {data.blindSpots.map((spot, i) => (
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
                        <div
                          className="h-full bg-red-500/60 rounded-full"
                          style={{ width: `${spot.coverage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="mb-8">
          <div className="glass rounded-2xl p-6 border-white/5">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
              AI Recommendations
              <span className="ml-auto text-xs font-normal bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                {data.recommendations.length} suggestions
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
                >
                  <button
                    onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                    className="w-full p-4 text-left cursor-pointer"
                  >
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
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        {rec.description}
                      </p>
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

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#030014] rounded-[6px] flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-display font-bold text-white text-sm">GitPostmortem</span>
          </div>
          <span className="text-xs">© {new Date().getFullYear()} GitPostmortem. All rights reserved.</span>
        </footer>
      </main>
    </div>
  );
}
