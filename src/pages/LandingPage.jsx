import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  ShieldAlert,
  Terminal,
  ArrowRight,
  GitPullRequest,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";

export default function LandingPage({ onAnalyze }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        size: Math.random() * 8 + 4,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        driftY: Math.random() * -60 - 20,
        driftX: Math.random() * 40 - 20,
        duration: Math.random() * 8 + 6,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    []
  );

  const validateRepoUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Please enter a GitHub repository URL.";
    }

    const githubRepoPattern = /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/i;
    if (!githubRepoPattern.test(trimmed)) {
      return "Enter a GitHub repository URL like https://github.com/owner/repo.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = repoUrl.trim();
    const error = validateRepoUrl(trimmedUrl);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");
    onAnalyze(trimmedUrl);
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[150px] animate-pulse-slow pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, index) => (
          <motion.div
            key={`${particle.left}-${particle.top}-${index}`}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, particle.driftY],
              x: [0, particle.driftX],
              opacity: [particle.opacity, 0.6, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px]">
            <div className="w-full h-full bg-[#030014] rounded-[11px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            GitPostmortem
          </span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-6"
        >
          <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How It Works</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        </motion.nav>
      </header>

      {/* Hero */}
      <main className="relative z-40 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 text-xs font-semibold tracking-wider text-purple-300 uppercase mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          AI-Powered Repository Intelligence
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-6"
        >
          <span className="text-gradient-purple-blue">GitPostmortem</span>
          <br />
          <span className="text-4xl md:text-5xl text-white font-semibold block mt-3">
            Stop Fixing The Same Bugs Twice
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12"
        >
          AI-powered repository intelligence that learns from engineering failures
          and prevents recurring bugs.
        </motion.p>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-2xl opacity-20 blur-lg pointer-events-none" />
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col md:flex-row gap-3 p-2 bg-[#09071f]/80 backdrop-blur-xl border border-white/10 rounded-xl"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-black/40 rounded-lg border border-white/5">
              <GithubIcon className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                id="repo-url"
                name="repoUrl"
                aria-label="Repository URL"
                aria-describedby="repo-url-help"
                aria-invalid={Boolean(validationError)}
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-500"
              />
            </div>
            <motion.button
              type="submit"
              disabled={!repoUrl.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shrink-0 shadow-lg shadow-purple-500/20"
            >
              Analyze Repository
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
          <p id="repo-url-help" className="mt-2 text-left text-xs text-gray-500">
            {validationError || "Paste a public GitHub repository URL to begin the analysis."}
          </p>
          {validationError ? <p className="mt-1 text-left text-sm text-red-400">{validationError}</p> : null}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { label: "Repositories Analyzed", value: "14,820+", desc: "Public & private repos mapped" },
            { label: "Bugs Prevented", value: "98.4%", desc: "Of recurring bug patterns stopped" },
            { label: "Insights Generated", value: "1.2M+", desc: "Actionable failure preventions" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl glass border-white/5"
            >
              <div className="text-3xl md:text-4xl font-display font-extrabold text-gradient-purple-blue mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-white mb-0.5">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-40 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            AI-Driven Postmortem Safeguards
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            GitPostmortem connects to your GitHub repository and analyzes logs, issue history, and commit diffs to protect your main branch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Repository Intelligence",
              desc: "Deep semantic analysis of your codebase. Understand structural design and how edits create hidden ripple-effect dependencies.",
              icon: Cpu,
              accent: "from-blue-500 to-indigo-500",
            },
            {
              title: "Failure Pattern Detection",
              desc: "Automatically maps recurring bug-fixes. If a bug was fixed before, GitPostmortem alerts you when similar patterns are introduced.",
              icon: Zap,
              accent: "from-purple-500 to-pink-500",
            },
            {
              title: "AI Risk Assessment",
              desc: "Get a risk-score overlay on incoming pull requests based on historical postmortems in similar system files.",
              icon: ShieldAlert,
              accent: "from-cyan-500 to-teal-500",
            },
            {
              title: "Code Review Recommendations",
              desc: "Translates past engineering mistakes into active guardrails — custom lint rules, pre-commit scripts, and PR checklists.",
              icon: GitPullRequest,
              accent: "from-orange-500 to-red-500",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="p-8 rounded-2xl glass glass-card-hover text-left flex gap-5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.accent} p-[1px] shrink-0`}>
                <div className="w-full h-full bg-[#07051a] rounded-[11px] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-40 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Integrates instantly into your workflow — zero configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 -translate-y-12 z-0" />

          {[
            {
              step: "Step 01",
              title: "Paste Repository URL",
              desc: "Provide the link to any public or private GitHub repository.",
              visual: (
                <div className="h-28 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-4">
                  <div className="w-full max-w-xs flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] text-gray-500 font-mono">
                    <GithubIcon className="w-3.5 h-3.5 text-gray-400" />
                    github.com/facebook/react
                  </div>
                </div>
              ),
            },
            {
              step: "Step 02",
              title: "AI Analyzes Commits",
              desc: "Our model reads commit diffs and issues to build a failure knowledge map.",
              visual: (
                <div className="h-28 bg-black/40 rounded-xl border border-white/5 flex flex-col justify-center p-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                    <span>Analyzing diffs...</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[72%] rounded-full" />
                  </div>
                </div>
              ),
            },
            {
              step: "Step 03",
              title: "Get Actionable Insights",
              desc: "Prevent future bugs with PR flags, risk assessments, and customized git hooks.",
              visual: (
                <div className="h-28 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-4">
                  <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-[9px] font-mono text-gray-300">Regression detected!</span>
                  </div>
                </div>
              ),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative z-10 flex flex-col text-left"
            >
              <div className="mb-4">{item.visual}</div>
              <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
                {item.step}
              </span>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-40 max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="glass border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden bg-[#0d0728]/70">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
            Protect Your Main Branch Today
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base mb-8">
            Connect GitPostmortem and start scanning in under 60 seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-4 bg-white text-[#030014] font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors shadow-xl shadow-white/5 cursor-pointer"
          >
            Try Live Demo →
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-40 max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#030014] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight">GitPostmortem</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            <GithubIcon className="w-4 h-4" /> GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="mailto:support@gitpostmortem.dev" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div>© {new Date().getFullYear()} GitPostmortem. All rights reserved.</div>
      </footer>
    </div>
  );
}
