export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="h-7 w-48 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#161b22]"
          />
        ))}
      </div>
    </div>
  );
}
