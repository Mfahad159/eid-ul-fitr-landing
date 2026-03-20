"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const showScrollDown = scrollY <= 120;
  const showScrollUp = scrollY > 300;

  return (
    <AnimatePresence mode="wait">
      {showScrollDown ? (
        <motion.button
          key="scroll-down"
          type="button"
          aria-label="Scroll down"
          className="fixed bottom-6 left-1/2 z-50 flex min-h-[44px] min-w-[44px] -translate-x-1/2 flex-col items-center gap-2 text-center will-change-transform md:bottom-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.5 } }}
          transition={{ delay: 2, duration: 0.6 }}
          onClick={() =>
            typeof window !== "undefined" &&
            window.scrollTo({
              top: window.innerHeight * 0.9,
              behavior: "smooth",
            })
          }
        >
          <motion.span
            lang="ar"
            dir="rtl"
            className="text-center font-arabic text-[clamp(0.8rem,3vw,1.1rem)] text-eid-gold"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            مرر للأسفل
          </motion.span>
          <div className="relative h-9 w-[2px] bg-eid-gold/80">
            <motion.span
              className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-eid-gold"
              animate={{ y: [0, 30, 0] }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>
        </motion.button>
      ) : null}

      {showScrollUp ? (
        <motion.button
          key="scroll-up"
          type="button"
          aria-label="Scroll to top"
          className="fixed bottom-6 left-1/2 z-50 flex min-h-[44px] min-w-[44px] -translate-x-1/2 flex-col items-center gap-2 text-center will-change-transform md:bottom-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.5 } }}
          transition={{ duration: 0.5 }}
          onClick={() =>
            typeof window !== "undefined" &&
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <div className="relative h-9 w-[2px] bg-eid-gold/80">
            <motion.span
              className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-eid-gold"
              animate={{ y: [0, -30, 0] }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>
          <motion.span
            lang="ar"
            dir="rtl"
            className="text-center font-arabic text-[clamp(0.8rem,3vw,1.1rem)] text-eid-gold"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
         
          </motion.span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
