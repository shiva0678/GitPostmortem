import { motion } from "framer-motion";

export default function LoadingSpinner({ label = "Loading dashboard" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-10 w-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400"
      />
      <p className="text-sm font-medium text-gray-300">{label}</p>
    </div>
  );
}
