"use client";

import { motion } from "framer-motion";

const marqueeItems = [
  "Eid Mubarak",
  "Joy",
  "Peace",
  "Barakah",
  "Family",
  "Gratitude",
];

export function Greeting() {
  return (
    <section
      aria-label="Marquee Greeting"
      className="relative z-10 overflow-hidden bg-transparent py-12"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="rounded-full border border-eid-gold/15 bg-[rgba(13,59,46,0.28)] py-4 backdrop-blur-md">
          <motion.div
            className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
              (item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-8 px-2 font-body text-sm uppercase tracking-[0.35em] text-eid-gold/80 md:text-base"
                >
                  <span>{item}</span>
                  <span className="text-eid-gold/40">✦</span>
                </div>
              ),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
