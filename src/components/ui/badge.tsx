import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white dark:bg-emerald-500",
        secondary:
          "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
        outline:
          "border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
