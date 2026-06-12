import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No insights available yet",
  description = "This section will populate once the analysis data is ready.",
  icon: Icon = Inbox,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-gray-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}
