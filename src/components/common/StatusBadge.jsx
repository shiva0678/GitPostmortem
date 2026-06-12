export default function StatusBadge({ severity, className = "" }) {
  const config = {
    critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
    high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30" },
    medium: { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30" },
    low: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  };

  const state = config[severity] || config.medium;

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${state.bg} ${state.text} ${state.border} ${className}`}>
      {severity}
    </span>
  );
}
