"use client";

import { useRef, useState } from "react";
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
import CalligraphyOverlay from "@/components/ui/CalligraphyOverlay";

export function CalligraphySection() {
  const [name, setName] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: tooltipOpen && !name.trim(),
    onOpenChange: setTooltipOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const handleReveal = () => {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }

    setName(trimmed);
    setError("");
    setShowOverlay(true);
  };

  return (
    <>
      <section className="relative z-10 bg-transparent py-[100px]">
        <div className="mx-auto flex w-full max-w-[92vw] md:max-w-[560px] flex-col items-center px-4 text-center md:px-8 lg:px-16">
          <div
            className="mb-6 flex items-center gap-3 text-eid-gold/40"
            data-aos="fade-down"
            data-aos-duration="500"
          >
            <span>◆</span>
            <span>◆</span>
            <span>◆</span>
          </div>

          <h2
            className="font-display text-2xl italic text-eid-cream md:text-4xl lg:text-5xl"
            data-aos="zoom-in"
            data-aos-duration="700"
            data-aos-easing="ease-out-back"
          >
            Your Name in the Stars
          </h2>

          <p
            className="mt-3 mb-10 font-body text-sm text-eid-muted md:text-base"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="150"
          >
            Enter your name and witness it transform
          </p>

          <div
            className="w-full"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="200"
          >
            <input
              type="text"
              value={name}
              maxLength={20}
              placeholder="Your name..."
              onChange={(event) => {
                setName(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              className="w-full rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(13,59,46,0.3)] px-6 py-4 font-body text-base text-eid-cream placeholder:text-eid-muted/50 transition-all duration-300 ease-out focus:border-[rgba(201,168,76,0.7)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)] focus:outline-none"
            />
          </div>

          <div
            className="mt-4 w-full"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="350"
          >
            <button
              ref={refs.setReference}
              type="button"
              onClick={handleReveal}
              disabled={!name.trim()}
              className="calligraphy-cta flex h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#c9a84c_0%,#e8c97e_50%,#c9a84c_100%)] bg-[length:200%_auto] font-body text-base font-semibold tracking-[0.05em] text-eid-black transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-right disabled:cursor-not-allowed disabled:opacity-40"
              {...getReferenceProps()}
            >
              Reveal My Calligraphy ✦
            </button>

            {tooltipOpen && !name.trim() ? (
              <CalligraphyTooltipPopup
                refs={refs}
                floatingStyles={floatingStyles}
                getFloatingProps={getFloatingProps}
                context={context}
                arrowRef={arrowRef}
              />
            ) : null}
          </div>

          {error ? (
            <p className="mt-3 font-body text-sm text-eid-gold/80">{error}</p>
          ) : null}
        </div>
      </section>

      <CalligraphyOverlay
        name={name}
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </>
  );
}

function CalligraphyTooltipPopup({ refs, floatingStyles, getFloatingProps, context, arrowRef }: any) {
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
          Your name will appear in classic Arabic calligraphy ✦
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
