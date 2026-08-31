import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const isPro = user?.plan === "PRO";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-800">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            TaskForge
          </span>
          <nav className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-neutral-100">
              Dashboard
            </Link>
            <Link href="/projects" className="hover:text-neutral-900 dark:hover:text-neutral-100">
              Projetos
            </Link>
            <Link href="/templates" className="hover:text-neutral-900 dark:hover:text-neutral-100">
              Templates
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden text-sm text-neutral-500 sm:inline dark:text-neutral-400">
            {session.user.name}
          </span>
          <Link
            href="/upgrade"
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              isPro
                ? "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                : "border border-neutral-300 text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            {isPro ? "Pro" : "Free"}
          </Link>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
