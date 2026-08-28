export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${tone === "danger" && Number(value) > 0 ? "text-red-600" : "text-neutral-900"}`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}
