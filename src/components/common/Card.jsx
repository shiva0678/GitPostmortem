import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  icon: Icon,
  accent = "text-cyan-400",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 sm:p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl ${className}`}
    >
      {title && (
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              {Icon && <Icon className={`w-5 h-5 ${accent}`} />}
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
          </div>
        </div>
      )}

      {children}
    </motion.div>
  );
}
