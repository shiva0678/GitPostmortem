import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Activity, GitBranch, Search, Shield, Cpu } from "lucide-react";
import { loadingSteps } from "../data/mockData";

export default function LoadingScreen({ repoUrl, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef([]);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };

    if (!loadingSteps.length) {
      setProgress(100);
      const completionTimer = window.setTimeout(() => onComplete?.(), 600);
      timersRef.current.push(completionTimer);
      return clearTimers;
    }

    let stepIndex = 0;
    const totalDuration = loadingSteps.reduce((total, step) => total + step.duration, 0);
    let elapsed = 0;
    let isActive = true;

    const runStep = () => {
      if (!isActive) return;

      if (stepIndex >= loadingSteps.length) {
        setProgress(100);
        const completionTimer = window.setTimeout(() => {
          if (isActive) {
            onComplete?.();
          }
        }, 600);
        timersRef.current.push(completionTimer);
        return;
      }

      setCurrentStep(stepIndex);
      setCompletedSteps((prev) => (prev.includes(stepIndex) ? prev : [...prev, stepIndex]));

      const step = loadingSteps[stepIndex];
      elapsed += step.duration;
      setProgress(Math.round((elapsed / totalDuration) * 100));

      stepIndex += 1;
      const nextTimer = window.setTimeout(runStep, step.duration);
      timersRef.current.push(nextTimer);
    };

    const initialTimer = window.setTimeout(runStep, 300);
    timersRef.current.push(initialTimer);

    return () => {
      isActive = false;
      clearTimers();
    };
  }, [onComplete]);

  const icons = [Search, GitBranch, Activity, Cpu, Shield, Terminal];

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/15 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-4"
      >
        {/* Main card */}
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border-white/5">
          {/* Header */}
          <div className="px-6 py-4 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-gray-400 font-mono">
                git-postmortem --analyze {repoUrl}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
              <Activity className="w-3 h-3 animate-pulse" />
              Live
            </div>
          </div>

          {/* Console body */}
          <div className="p-6 bg-black/60 min-h-[380px] font-mono text-sm">
            {/* Animated icon grid */}
            <div className="flex justify-center gap-4 mb-8">
              {icons.map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: completedSteps.length > i * 2 ? 1 : 0.2,
                    scale: currentStep === i * 2 ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <Icon className={`w-5 h-5 ${completedSteps.length > i * 2 ? "text-cyan-400" : "text-gray-600"}`} />
                </motion.div>
              ))}
            </div>

            {/* Log lines */}
            <div className="space-y-2 mb-8 max-h-[200px] overflow-y-auto">
              {completedSteps.map((stepIdx) => {
                const step = loadingSteps[stepIdx];
                if (!step) return null;

                return (
                  <motion.div
                    key={stepIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                    <span
                      className={
                        stepIdx === currentStep
                          ? "text-cyan-300"
                          : "text-gray-500"
                      }
                    >
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}
              {currentStep < loadingSteps.length - 1 && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-start gap-2 text-purple-400"
                >
                  <span className="shrink-0 mt-0.5">⟳</span>
                  <span>Processing...</span>
                </motion.div>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-2" aria-live="polite">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Analysis Progress</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Repo info below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            Analyzing repository: <span className="text-purple-400">{repoUrl}</span>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            This may take a moment for large repositories
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
