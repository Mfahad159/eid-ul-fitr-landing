"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";

const patternSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <g fill="none" stroke="rgba(232,201,126,1)" stroke-width="1">
      <path d="M40 20L50 50L80 60L50 70L40 100L30 70L0 60L30 50Z" />
      <path d="M120 20L130 50L160 60L130 70L120 100L110 70L80 60L110 50Z" />
      <path d="M40 100L50 130L80 140L50 150L40 180L30 150L0 140L30 130Z" />
      <path d="M120 100L130 130L160 140L130 150L120 180L110 150L80 140L110 130Z" />
      <path d="M40 60H120" />
      <path d="M80 20V140" />
      <path d="M0 140H160" opacity="0.35" />
      <path d="M0 60H160" opacity="0.35" />
    </g>
  </svg>
`;

const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

export default function EidLoader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const timeoutRefs = useRef<number[]>([]);
  const animsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;

    const runSequence = async () => {
      if ("fonts" in document) {
        await document.fonts.ready;
      }

      if (cancelled) {
        return;
      }

      const arabicEl = document.getElementById("text-arabic") as SVGTextElement | null;
      const yearEl = document.getElementById("text-year") as SVGTextElement | null;

      if (!arabicEl || !yearEl) {
        return;
      }

      let arabicLen = arabicEl.getComputedTextLength();
      let yearLen = yearEl.getComputedTextLength();

      arabicLen = arabicLen > 10 ? arabicLen : 800;
      yearLen = yearLen > 10 ? yearLen : 200;

      arabicEl.style.strokeDasharray = `${arabicLen}`;
      arabicEl.style.strokeDashoffset = `${arabicLen}`;
      yearEl.style.strokeDasharray = `${yearLen}`;
      yearEl.style.strokeDashoffset = `${yearLen}`;

      animsRef.current.push(
        anime({
          targets: "#text-arabic",
          strokeDashoffset: [arabicLen, 0],
          duration: 2400,
          delay: 700,
          easing: "easeInOutSine",
          complete: () => {
            animsRef.current.push(
              anime({
                targets: "#text-arabic",
                fill: ["rgba(201,168,76,0)", "rgba(201,168,76,1)"],
                duration: 500,
                easing: "easeOutQuad",
              }),
              anime({
                targets: "#text-arabic",
                filter: [
                  "drop-shadow(0 0 0px rgba(201,168,76,0))",
                  "drop-shadow(0 0 12px rgba(201,168,76,0.4))",
                ],
                duration: 600,
                easing: "easeOutQuad",
              })
            );
          },
        }),
        anime({
          targets: "#text-year",
          strokeDashoffset: [yearLen, 0],
          duration: 900,
          delay: 3000,
          easing: "easeOutCubic",
          complete: () => {
            animsRef.current.push(
              anime({
                targets: "#text-year",
                fill: ["rgba(201,168,76,0)", "rgba(201,168,76,0.65)"],
                duration: 400,
                easing: "easeOutQuad",
              })
            );
          },
        })
      );

      timeoutRefs.current.push(
        window.setTimeout(() => setShowSkip(true), 1500),
        window.setTimeout(() => {
          animsRef.current.push(
            anime({
              targets: "#eid-loader",
              opacity: [1, 0],
              duration: 800,
              easing: "easeInOutQuad",
              complete: () => {
                setVisible(false);
                onComplete?.();
              },
            })
          );
        }, 4400)
      );
    };

    runSequence();

    return () => {
      cancelled = true;
      timeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
      timeoutRefs.current = [];
      animsRef.current.forEach((anim) => anim.pause());
      animsRef.current = [];
    };
  }, [onComplete, visible]);

  const handleSkip = () => {
    timeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutRefs.current = [];
    animsRef.current.forEach((anim) => anim.pause());
    animsRef.current = [];

    anime({
      targets: "#eid-loader",
      opacity: [1, 0],
      duration: 400,
      easing: "easeInOutQuad",
      complete: () => {
        setVisible(false);
        onComplete?.();
      },
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      id="eid-loader"
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #0d3b2e 0%, #0a0f0d 65%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02] md:opacity-[0.04]"
        style={{
          backgroundImage: patternUrl,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />

      <svg
        id="loader-svg"
        viewBox="0 0 800 220"
        style={{ width: "min(720px, 92vw)" }}
        direction="rtl"
      >
        <text
          id="text-arabic"
          x="400"
          y="118"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Scheherazade New', serif"
          fontWeight="700"
          stroke="#c9a84c"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(201,168,76,0)"
          direction="rtl"
          style={{
            fontSize: "clamp(48px, 12vw, 96px)",
            unicodeBidi: "bidi-override",
            direction: "rtl",
            fontFeatureSettings: '"calt" 1, "liga" 1, "kern" 1',
          }}
        >
          عيد الفطر
        </text>
        <text
          id="text-year"
          x="400"
          y="185"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontWeight="400"
          letterSpacing="14"
          stroke="#c9a84c"
          strokeWidth="0.8"
          fill="rgba(201,168,76,0)"
          style={{ fontSize: "clamp(24px, 6vw, 42px)" }}
        >
          2026
        </text>
      </svg>

      <div className="mt-8 h-px w-[min(300px,80vw)] bg-[rgba(201,168,76,0.1)]">
        <div className="eid-loader-progress h-full w-full origin-left bg-[linear-gradient(90deg,#c9a84c,#e8c97e,#c9a84c)] bg-[length:200%_auto]" />
      </div>

      <div
        className="eid-loader-blessing mt-6 font-arabic text-[0.85rem] text-eid-gold/35"
        style={{ fontFeatureSettings: '"calt" 1' }}
      >
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </div>

      {showSkip ? (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute bottom-6 right-6 flex min-h-[44px] min-w-[44px] items-center justify-center px-[20px] py-[12px] font-body text-[0.85rem] text-eid-muted/50 transition-opacity duration-300 hover:opacity-100"
        >
          تخطي ←
        </button>
      ) : null}
    </div>
  );
}
