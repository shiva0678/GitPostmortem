import { useState } from "react";
import { Terminal, ArrowLeft } from "lucide-react";
import { GithubIcon } from "../components/GithubIcon";
import { mockAnalysisResult } from "../data/mockData";
import {
  RepositorySummary,
  TimelineChart,
  Hotspots,
  FailurePatterns,
  BlindSpots,
  CodeReviewRules,
  RiskScore,
} from "../components/dashboard";

export default function Dashboard({ repoUrl, onBack }) {
  const data = mockAnalysisResult;
  const [expandedPattern, setExpandedPattern] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);

  const handleTogglePattern = (id) => {
    setExpandedPattern((prev) => (prev === id ? null : id));
  };

  const handleToggleRec = (id) => {
    setExpandedRec((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans">
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none" />

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
              <GithubIcon className="w-3.5 h-3.5 shrink-0" />
              {repoUrl}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/20 text-xs font-semibold text-purple-300">
              Analysis Complete
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <RepositorySummary data={data.repository} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RiskScore data={data.riskScore} />
          <TimelineChart data={data.timeline} />
        </div>

        <Hotspots hotspots={data.hotspots} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FailurePatterns
            patterns={data.failurePatterns}
            expandedPattern={expandedPattern}
            onTogglePattern={handleTogglePattern}
          />
          <BlindSpots spots={data.blindSpots} />
        </div>

        <CodeReviewRules
          recommendations={data.recommendations}
          expandedRec={expandedRec}
          onToggleRec={handleToggleRec}
        />

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
