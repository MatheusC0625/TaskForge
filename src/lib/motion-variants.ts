import type { Variants } from "motion/react";

/** Container que escalona a entrada dos filhos diretos (cada um precisa ter `fadeUpItem` ou ser outro `staggerContainer` aninhado). */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Item: entra com fade + leve deslize + leve desfoque, estilo Linear. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};
