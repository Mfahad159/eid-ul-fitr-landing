"use client";

import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useMotionSettings } from "@/lib/useMotionSettings";

export default function ScrollProgressBar() {
  const scrollYProgress = useScrollProgress();
  const { shouldReduceMotion } = useMotionSettings();
  const scaleX = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-[linear-gradient(90deg,#c9a84c,#e8c97e,#c9a84c)] will-change-transform"
      style={{ scaleX, transformOrigin: "left" }}
    />
  );
}
