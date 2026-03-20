"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useMotionSettings } from "@/lib/useMotionSettings";
import { Tooltip } from "@/components/ui/Tooltip";

const headingCharacters = "Eid Mubarak".split("");

export function HeroSection() {
  const scrollYProgress = useScrollProgress();
  const { isMobile, shouldReduceMotion } = useMotionSettings();
  const parallaxEnd = shouldReduceMotion ? 0 : isMobile ? -30 : -80;
  const opacityEnd = shouldReduceMotion ? 1 : 0;
  const scaleEnd = shouldReduceMotion ? 1 : isMobile ? 0.98 : 0.95;
  const letterSpacingValue = useTransform(scrollYProgress, [0, 0.2], [-0.02, 0.08]);
  const letterSpacing = useTransform(letterSpacingValue, (v) => `${v}em`);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, parallaxEnd]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, opacityEnd]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, scaleEnd]);

  return (
    <AnimatePresence>
      <motion.section
        aria-label="Hero"
        className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-20 will-change-transform md:px-8 md:py-32 lg:px-16"
        style={{ y, opacity, scale }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div
            data-aos="fade-down"
            data-aos-duration="700"
            data-aos-delay="200"
          >
            <div
              lang="ar"
              dir="rtl"
              className="text-center font-arabic text-xl text-eid-gold/90 md:text-3xl"
            >
              1447 ـ عيد مبارك
            </div>
          </div>

          <motion.div
            className="mt-6 h-px w-24 bg-eid-gold/40 will-change-transform"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="mt-6"
          >
            <motion.h1
              className="flex max-w-5xl flex-wrap justify-center font-display text-5xl font-bold leading-none text-eid-cream md:text-7xl lg:text-9xl"
              style={{ letterSpacing: isMobile ? "-0.02em" : letterSpacing }}
              aria-label="Eid Mubarak"
            >
              {headingCharacters.map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  className="will-change-transform"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.04,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {character === " " ? "\u00A0" : character}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="400"
            data-aos-easing="ease-out-sine"
            className="mt-6"
          >
            <div className="max-w-2xl text-sm leading-7 text-eid-muted md:text-base md:leading-8">
              May this Eid bring you joy, peace, and countless blessings.
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="550"
            className="mt-8 w-full sm:w-auto"
          >
            <Tooltip label="Click to celebrate! 🎊" placement="top">
              <button
                type="button"
                className="group relative min-h-[44px] w-full overflow-hidden rounded-full border border-eid-gold px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.12em] text-eid-gold transition-all duration-300 ease-out hover:bg-eid-gold hover:text-eid-black focus:outline-none focus-visible:ring-2 focus-visible:ring-eid-gold/60 sm:w-auto"
              >
                <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(245,240,232,0.35),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative z-10">Send Eid Wishes</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
