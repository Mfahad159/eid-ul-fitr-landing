"use client";

import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useMotionSettings } from "@/lib/useMotionSettings";

export default function EidMarquee() {
  const scrollYProgress = useScrollProgress();
  const { shouldReduceMotion } = useMotionSettings();
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.6, 0.75],
    shouldReduceMotion ? [1, 1, 1, 1] : [0, 1, 1, 0],
  );

  return (
    <motion.section
      aria-label="Eid Marquee"
      className="relative z-10 overflow-hidden will-change-transform"
      style={{ opacity }}
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-offset="50"
    >
      <div className="group border-y border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.06)] py-3 md:py-4">
        <div className="eid-marquee-track flex w-max items-center whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <span
                lang="ar"
                dir="rtl"
                className="px-3 text-center font-arabic text-sm tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]"
              >
                عيد مبارك
              </span>
              <span className="px-3 font-display text-sm italic tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]">
                ✦ Eid Mubarak ✦
              </span>
              <span
                lang="ar"
                dir="rtl"
                className="px-3 text-center font-arabic text-sm tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]"
              >
                عيد سعيد
              </span>
              <span className="px-3 font-display text-sm italic tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]">
                ✦ Blessed Eid ✦
              </span>
              <span
                lang="ur"
                dir="rtl"
                className="px-3 text-center font-arabic text-sm tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]"
              >
                خوشیوں بھری عید
              </span>
              <span className="px-3 font-display text-sm italic tracking-[0.05em] text-eid-gold/70 md:text-base md:tracking-[0.08em]">
                ✦ Joy &amp; Peace ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
