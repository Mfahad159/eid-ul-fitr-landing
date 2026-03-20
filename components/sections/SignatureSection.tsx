"use client";

import { useEffect, useRef, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { motion, useTransform } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useScrollProgress } from "@/lib/useScrollProgress";

export function SignatureSection() {
  const scrollYProgress = useScrollProgress();
  const [animationDuration, setAnimationDuration] = useState("4s");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const arrowRef = useRef(null);
  const nameScale = useTransform(scrollYProgress, [0.6, 0.85], [0.85, 1]);


  const { refs, floatingStyles, context } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setAnimationDuration(value > 0.7 ? "1.5s" : "4s");
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section className="relative z-10 bg-transparent py-20">
      <div
        className="mx-auto flex w-full max-w-[92vw] md:max-w-[480px] flex-col items-center px-4 text-center md:px-8 lg:px-16"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-out-quart"
      >
        <svg
          aria-hidden="true"
          className="mb-5 h-4 w-4 text-eid-gold/40"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M8 3.5L10.5 8L8 12.5L5.5 8L8 3.5Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        <div
          className="rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.08)] px-[14px] py-1 font-body text-[10px] uppercase tracking-[0.2em] text-eid-gold"
          data-aos="fade-down"
          data-aos-duration="500"
          data-aos-delay="100"
        >
          crafted by
        </div>

        <motion.h2
          className="signature-name mt-6 font-display text-[clamp(1.8rem,7vw,5rem)] font-bold italic leading-none tracking-normal will-change-transform pr-2 lg:pr-4"
          style={{
            scale: nameScale,
            animationDuration,
          }}
        >
          Muhammad Fahad
        </motion.h2>

        <p className="mt-4 font-body text-base font-medium uppercase tracking-[0.08em] text-eid-muted">
          Software Engineer
        </p>

        <div
          className="mt-5"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="400"
        >
          <a
            ref={refs.setReference}
            href="https://mfahad159.github.io/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="signature-link inline-flex items-center gap-1.5 font-body text-[0.85rem] text-eid-gold/60 transition-opacity duration-300 hover:text-eid-gold hover:opacity-100"
            {...getReferenceProps()}
          >
            <span>Portfolio</span>
            <IconArrowUpRight size={14} stroke={1.7} />
          </a>

          {tooltipOpen ? (
            <SignatureTooltipPopup
              refs={refs}
              floatingStyles={floatingStyles}
              getFloatingProps={getFloatingProps}
              context={context}
              arrowRef={arrowRef}
            />
          ) : null}
        </div>

        <div className="mt-8 flex items-center gap-3 text-eid-gold/20">
          <span className="h-px w-8 bg-current" />
          <span className="text-[0.7rem] leading-none">◆</span>
          <span className="h-px w-8 bg-current" />
        </div>
      </div>
    </section>
  );
}

function SignatureTooltipPopup({ refs, floatingStyles, getFloatingProps, context, arrowRef }: any) {
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  if (isTouchDevice) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{ ...floatingStyles, zIndex: 200 }}
        {...getFloatingProps()}
      >
        <div className="rounded-lg border border-[rgba(201,168,76,0.3)] bg-[rgba(13,59,46,0.95)] px-[14px] py-[6px] font-body text-[0.8rem] text-eid-cream shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          Opens mfahad159.github.io/portfolio
        </div>
        <FloatingArrow
          ref={arrowRef}
          context={context}
          fill="rgba(13,59,46,0.95)"
          stroke="rgba(201,168,76,0.3)"
        />
      </div>
    </FloatingPortal>
  );
}
