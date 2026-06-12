import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "We hit a snag",
  description = "The dashboard could not render this section. Please try refreshing the page.",
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/20 text-red-300">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-red-200/80">{description}</p>
    </div>
  );
}
