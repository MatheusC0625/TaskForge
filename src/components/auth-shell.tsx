"use client";

import { MotionConfig, motion } from "motion/react";
import { staggerContainer, fadeUpItem } from "@/lib/motion-variants";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 dark:bg-[#07080a]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(16,185,129,0.14), transparent 70%)",
        }}
      />

      <MotionConfig reducedMotion="user">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="flex w-full max-w-sm flex-col items-center gap-8"
        >
          <motion.div variants={fadeUpItem} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white dark:bg-emerald-500">
              TF
            </span>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
            </div>
          </motion.div>

          {children}
        </motion.div>
      </MotionConfig>
    </main>
  );
}
