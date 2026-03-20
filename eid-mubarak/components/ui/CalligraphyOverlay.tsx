"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";

type CalligraphyOverlayProps = {
  name: string;
  onClose: () => void;
  isOpen: boolean;
};

function toArabic(str: string): string {
  if (/[\u0600-\u06FF]/.test(str)) return str;

  const rules: [RegExp, string][] = [
    [/sh/g, 'ش'], [/ch/g, 'تش'], [/th/g, 'ث'], [/ph/g, 'ف'],
    [/kh/g, 'خ'], [/gh/g, 'غ'], [/ee/g, 'ي'], [/oo/g, 'و'],
    [/a/g, 'ا'], [/b/g, 'ب'], [/c/g, 'ك'], [/d/g, 'د'], [/e/g, 'ي'],
    [/f/g, 'ف'], [/g/g, 'ج'], [/h/g, 'ه'], [/i/g, 'ي'], [/j/g, 'ج'],
    [/k/g, 'ك'], [/l/g, 'ل'], [/m/g, 'م'], [/n/g, 'ن'], [/o/g, 'و'],
    [/p/g, 'ب'], [/q/g, 'ق'], [/r/g, 'ر'], [/s/g, 'س'], [/t/g, 'ت'],
    [/u/g, 'و'], [/v/g, 'ف'], [/w/g, 'و'], [/x/g, 'كس'], [/y/g, 'ي'],
    [/z/g, 'ز']
  ];

  let res = str.toLowerCase();
  for (const [regex, repl] of rules) {
    res = res.replace(regex, repl);
  }
  return res;
}

type Particle = {
  id: number;
  x: number;
  y: number;
};

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

function createParticles(): Particle[] {
  return Array.from({ length: 20 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 20;
    const radius = 80 + (index % 5) * 18;

    return {
      id: index,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });
}

export default function CalligraphyOverlay({
  name,
  onClose,
  isOpen,
}: CalligraphyOverlayProps) {
  const [showLabel, setShowLabel] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [showBlessing, setShowBlessing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [pulseEdges, setPulseEdges] = useState(false);
  const [toast, setToast] = useState("");
  const timersRef = useRef<number[]>([]);

  const particles = useMemo(() => createParticles(), []);
  const sanitizedName = useMemo(() => {
    const raw = name.trim().slice(0, 20).replace(/[<>]/g, '');
    return toArabic(raw);
  }, [name]);
  const characters = useMemo(() => sanitizedName.split(""), [sanitizedName]);

  const safeTimeout = (cb: () => void, ms: number) => {
    const id = window.setTimeout(cb, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      setShowLabel(false);
      setShowName(false);
      setShowFrame(false);
      setShowBlessing(false);
      setShowShare(false);
      setShowClose(false);
      setPulseEdges(false);
      setToast("");
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
      return;
    }

    document.body.style.overflow = 'hidden';

    safeTimeout(() => setShowLabel(true), 1200);
    safeTimeout(() => setShowName(true), 1600);
    safeTimeout(() => setShowFrame(true), 1800);
    safeTimeout(() => setShowBlessing(true), 2400);
    safeTimeout(() => {
      setPulseEdges(true);
      confetti({
        angle: 60,
        spread: 55,
        particleCount: 60,
        origin: { x: 0.1, y: 0.5 },
        colors: ["#c9a84c", "#e8c97e", "#fff8e7"],
      });
      confetti({
        angle: 120,
        spread: 55,
        particleCount: 60,
        origin: { x: 0.9, y: 0.5 },
        colors: ["#c9a84c", "#e8c97e", "#fff8e7"],
      });
    }, 2500);
    safeTimeout(() => setShowShare(true), 3000);
    safeTimeout(() => setShowClose(true), 3000);
    safeTimeout(() => setPulseEdges(false), 3100);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleShare = async () => {
    const shareData = {
      title: `Eid Mubarak ${name}!`,
      text: "Eid Mubarak! تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast("Link copied!");
    } catch {
      window.prompt("Copy this link to share:", window.location.href);
      setToast("Link ready to share!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-eid-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage: patternUrl,
              backgroundRepeat: "repeat",
              backgroundSize: "160px 160px",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-eid-gold"
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0.45 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="pointer-events-none absolute left-1/2 top-1/2">
            {particles.map((particle, index) => (
              <motion.span
                key={particle.id}
                className="absolute h-1 w-1 rounded-full bg-eid-gold"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.2],
                }}
                transition={{
                  delay: index * 0.03,
                  duration: 1.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-[3px] border-eid-gold"
            initial={{ opacity: 0 }}
            animate={pulseEdges ? { opacity: [0, 0.6, 0] } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />

          <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <AnimatePresence>
              {showLabel ? (
                <motion.p
                  lang="ar"
                  dir="rtl"
                  className="mb-6 text-center font-arabic text-[1.4rem] text-eid-gold/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  عيد مبارك
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="relative rounded-[4px] border border-[rgba(201,168,76,0.15)] px-6 py-8 sm:px-12">
              <AnimatePresence>
                {showFrame ? (
                  <>
                    {[
                      "left-0 top-0 border-l border-t",
                      "right-0 top-0 border-r border-t",
                      "left-0 bottom-0 border-b border-l",
                      "right-0 bottom-0 border-b border-r",
                    ].map((corner, index) => (
                      <motion.div
                        key={corner}
                        className={`absolute w-3 h-3 md:w-5 md:h-5 border-eid-gold/30 ${corner}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                          delay: 0.05 * index,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </AnimatePresence>

              <div className="relative z-10">
                <AnimatePresence>
                  {showName ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <h2
                        className="calligraphy-overlay-name text-center font-arabic font-bold leading-none"
                        style={{
                          fontSize: "clamp(2.5rem, 12vw, 9rem)",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          direction: "rtl",
                        }}
                      >
                        {sanitizedName}
                      </h2>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {showBlessing ? (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p lang="ar" dir="rtl" className="text-center font-arabic text-[1.3rem] text-eid-gold/50">
                    تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
                  </p>
                  <p className="mt-2 font-body text-[0.8rem] text-eid-muted">
                    May Allah accept from us and from you
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showShare ? (
                <motion.div
                  className="absolute bottom-10 left-1/2 w-full max-w-md -translate-x-1/2 px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-body text-[0.8rem] italic text-eid-muted" style={{ maxWidth: "90vw", textAlign: "center", padding: "0 16px" }}>
                    {`📸 Screenshot this & send it to ${sanitizedName}`}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl border border-[rgba(201,168,76,0.3)] px-5 py-3 font-body text-sm text-eid-muted transition-colors duration-300 hover:text-eid-gold"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="rounded-xl bg-eid-gold px-5 py-3 font-body text-sm font-semibold text-eid-black transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Share ✦
                    </button>
                  </div>
                  {toast ? (
                    <p className="mt-3 font-body text-xs text-eid-gold">{toast}</p>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showClose ? (
                <motion.button
                  type="button"
                  aria-label="Close calligraphy overlay"
                  onClick={onClose}
                  className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full text-eid-muted transition-colors duration-300 hover:text-eid-gold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✕
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
