"use client";

import { motion, type Variants } from "framer-motion";
import type { BlockAnimation } from "@/features/invitation/types/blocks";

const variants: Record<Exclude<BlockAnimation, "none">, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

type Props = {
  animation?: BlockAnimation;
  children: React.ReactNode;
};

export function AnimatedWrapper({ animation, children }: Props) {
  if (!animation || animation === "none") {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -30% 0px" }}
      variants={variants[animation]}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
