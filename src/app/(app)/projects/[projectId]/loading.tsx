export default function ProjectLoading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#161b22]"
          />
        ))}
      </div>
    </div>
  );
}
