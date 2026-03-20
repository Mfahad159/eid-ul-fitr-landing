"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type Screen = "intro" | "playing" | "name-entry" | "times-up" | "result";

const DURATION_MS = 7000;
const DECAY_RATE = 0.018; // power lost per 50ms tick
const TAP_BOOST = 3.2; // power gained per correct tap
const SPEED_WINDOW = 220; // ms — fast tap bonus window
const SPEED_MULT = 1.6; // multiplier for fast taps
const WRONG_PENALTY = 12; // power lost on wrong tap
const POWER_CAP = 100; // max power value

const SEQ: ("L" | "R")[] = ["L", "R"];

interface EideeGameProps {
  onClose: () => void;
}

export function EideeGame({ onClose }: EideeGameProps) {
  const [screen, setScreen] = useState<Screen>("intro");

  // Game state
  const [power, setPower] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_MS);

  // Stats / UI State
  const [tapCount, setTapCount] = useState(0);
  const [flashWrongSide, setFlashWrongSide] = useState<"L" | "R" | null>(null);
  const [flashRightSide, setFlashRightSide] = useState<"L" | "R" | null>(null);

  // Result state
  const [eidee, setEidee] = useState(0);
  const [displayEidee, setDisplayEidee] = useState(0);

  // Name Entry state
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triesLeft, setTriesLeft] = useState<number | null>(null);

  useEffect(() => {
    const storedTries = localStorage.getItem("eid_game_tries");
    const storedName = localStorage.getItem("eid_game_name");
    
    if (storedTries !== null) {
      setTriesLeft(parseInt(storedTries, 10));
    } else {
      setTriesLeft(3);
    }
    
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  function startGame() {
    if (triesLeft === null || triesLeft <= 0) return;
    
    localStorage.setItem("eid_game_name", playerName.trim());
    const newTries = triesLeft - 1;
    localStorage.setItem("eid_game_tries", newTries.toString());
    setTriesLeft(newTries);
    
    setScreen("playing");
  }

  // Refs for real-time game logic
  const startTimeRef = useRef(0);
  const lastTapRef = useRef(0);
  const seqIdxRef = useRef(0);
  const tapCountRef = useRef(0); // sync with state to prevent stale closures
  const powerRef = useRef(0); // sync with state for final calc

  useEffect(() => {
    powerRef.current = power;
  }, [power]);

  // Handle playing state
  useEffect(() => {
    if (screen !== "playing") return;

    startTimeRef.current = Date.now();
    lastTapRef.current = 0;
    seqIdxRef.current = 0;
    tapCountRef.current = 0;
    setPower(0);
    setTapCount(0);
    setTimeLeft(DURATION_MS);

    // Decay interval
    const decay = setInterval(() => {
      setPower((p) => Math.max(0, p - DECAY_RATE * 100));
    }, 50);

    // Timer interval
    const timer = setInterval(() => {
      const remaining = DURATION_MS - (Date.now() - startTimeRef.current);
      if (remaining <= 0) {
        setTimeLeft(0);
        endGame();
        return;
      }
      setTimeLeft(remaining);
    }, 50);

    return () => {
      clearInterval(decay);
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  function endGame() {
    // Scales: exponent 1.2, max 400, min 50
    const baseScore = Math.pow(powerRef.current / 100, 1.2) * 350;
    const finalEidee = tapCountRef.current > 0 ? Math.round(baseScore + 50) : 0;
    const clampedEidee = Math.min(400, Math.max(0, finalEidee));
    setEidee(clampedEidee);
    setDisplayEidee(0);

    if (clampedEidee >= 10 && playerName.trim()) {
      submitScoreBackground(clampedEidee);
    }
    
    setScreen("times-up");
    setTimeout(() => {
      showResultScreen(clampedEidee);
    }, 3000);
  }

  function showResultScreen(eideeAmt: number) {
    setScreen("result");
    if (eideeAmt >= 100) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ["#c9a84c", "#e8c97e", "#fff8e7", "#0d3b2e"],
          origin: { y: 0.6 },
          zIndex: 9000,
        });
      }, 500);
    }
  }

  async function submitScoreBackground(scoreAmt: number) {
    try {
      await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName.slice(0, 20),
          score: scoreAmt,
          tapCount: tapCountRef.current,
          duration: DURATION_MS
        })
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  }

  // Animate count-up for eidee
  useEffect(() => {
    if (screen === "result" && eidee > 0) {
      let current = 0;
      const increment = Math.max(1, Math.floor(eidee / 40));
      const interval = setInterval(() => {
        current += increment;
        if (current >= eidee) {
          setDisplayEidee(eidee);
          clearInterval(interval);
        } else {
          setDisplayEidee(current);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [screen, eidee]);

  function handleTap(side: "L" | "R") {
    if (screen !== "playing") return;
    
    const expected = SEQ[seqIdxRef.current % 2];
    if (side !== expected) {
      setPower((p) => Math.max(0, p - WRONG_PENALTY));
      setFlashWrongSide(side);
      setTimeout(() => setFlashWrongSide(null), 200);
      return;
    }

    const now = Date.now();
    const isfast = lastTapRef.current > 0 && now - lastTapRef.current < SPEED_WINDOW;
    const boost = isfast ? TAP_BOOST * SPEED_MULT : TAP_BOOST;
    setPower((p) => Math.min(POWER_CAP, p + boost));

    lastTapRef.current = now;
    seqIdxRef.current++;
    tapCountRef.current++;
    setTapCount(tapCountRef.current);

    setFlashRightSide(side);
    setTimeout(() => setFlashRightSide(null), 80);
  }

  // --- RENDER HELPERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center p-8 pt-12 text-center">
      <h2
        className="font-arabic text-4xl text-eid-gold"
        dir="rtl"
        lang="ar"
      >
        عيدي جمع كن!
      </h2>
      <p className="mt-2 font-body text-sm uppercase tracking-widest text-eid-muted">
        Collect Your Eidee
      </p>

      <div className="mt-6 w-full rounded-2xl border border-eid-gold/30 bg-eid-green/50 p-6 shadow-inner">
        <p className="font-body text-sm leading-relaxed text-eid-cream/90">
          Tap <strong className="text-white">LEFT → RIGHT → LEFT → RIGHT</strong> as fast as you can for 7 seconds. 
          Slow down and your power drops. <br />
          <span className="text-red-400 font-semibold mt-1 inline-block">Wrong order = penalty!</span>
        </p>
      </div>

      <div className="mt-8">
        <div className="font-display text-4xl text-eid-gold font-bold mb-1">Rs. 500</div>
        <div className="text-xs text-eid-muted">(good luck exceeding Rs. 200)</div>
      </div>

      <button
        onClick={() => setScreen("name-entry")}
        disabled={triesLeft === 0}
        className="mt-8 w-full rounded-xl bg-eid-gold py-4 font-body font-bold text-eid-black transition-transform hover:scale-[1.03] active:scale-95 shadow-lg disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
      >
        {triesLeft === 0 ? "Out of tries!" : "Start"}
      </button>
      {triesLeft !== null && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-eid-gold/60">
          Tries left: {triesLeft} / 3
        </p>
      )}
    </div>
  );

  const renderPlaying = () => {
    // Timer Ring calculation
    const r = 30;
    const circumference = 2 * Math.PI * r;
    const progress = timeLeft / DURATION_MS;
    const strokeDashoffset = Math.max(0, circumference * (1 - progress));

    const isUrgent = timeLeft < 2500;
    const timerColor = isUrgent ? "#ef4444" : progress < 0.6 ? "#f59e0b" : "#c9a84c";

    const secondsLeft = Math.ceil(timeLeft / 1000);
    const powerPercent = Math.min(100, Math.max(0, (power / POWER_CAP) * 100));

    // Calculate pills
    const activePillIndex = seqIdxRef.current;
    
    return (
      <div className="flex h-full min-h-[460px] flex-col p-6 pt-12">
        {/* Top Info row */}
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h3 className="font-body text-sm font-bold tracking-wider text-eid-gold mb-1">Power</h3>
            <div className="relative h-[18px] w-full rounded-full border border-eid-gold/15 bg-eid-gold/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#c9a84c,#e8c97e,#fffbe6)] transition-all ease-linear duration-50"
                style={{ width: `${powerPercent}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-sm" />
              </div>
            </div>
          </div>

          <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
            <svg width="64" height="64" className="-rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke="rgba(201,168,76,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke={timerColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-50 ease-linear"
              />
            </svg>
            <div className="absolute font-display text-2xl font-bold text-eid-cream">
              {secondsLeft}
            </div>
          </div>
        </div>

        {/* Order Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const expectedSide = SEQ[(activePillIndex + i) % 2];
            const isFirst = i === 0;
            return (
              <div
                key={activePillIndex + i}
                className={`flex h-9 w-9 items-center justify-center rounded-full font-body text-sm font-bold transition-all duration-300 ${
                  isFirst
                    ? "scale-110 bg-eid-gold text-eid-black shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                    : "border border-eid-gold/20 bg-transparent text-eid-gold/40"
                }`}
              >
                {expectedSide}
              </div>
            );
          })}
        </div>

        {/* Tap Buttons */}
        <div className="mt-auto flex gap-4 pb-4">
          <TapButton
            side="L"
            label="LEFT"
            flashWrong={flashWrongSide === "L"}
            flashRight={flashRightSide === "L"}
            onTap={() => handleTap("L")}
          />
          <TapButton
            side="R"
            label="RIGHT"
            flashWrong={flashWrongSide === "R"}
            flashRight={flashRightSide === "R"}
            onTap={() => handleTap("R")}
          />
        </div>
      </div>
    );
  };

  const renderTimesUp = () => (
    <div className="flex h-full min-h-[460px] flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
      <h2 className="mb-4 font-display text-5xl uppercase tracking-widest text-eid-gold drop-shadow-lg">
        Time&apos;s Up!
      </h2>
      <p className="font-body text-lg text-eid-cream/80 animate-pulse">
        Calculating Eidee...
      </p>
    </div>
  );

  const renderNameEntry = () => (
    <div className="flex h-full min-h-[460px] flex-col items-center justify-center p-8 pt-12 text-center">
      <h2 className="font-body text-[1.1rem] text-eid-cream">
        Who are you?
      </h2>
      <p className="mt-1 text-sm text-eid-muted">
        Enter your name for the leaderboard
      </p>

      <div className="mt-8 w-full max-w-[280px]">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your name..."
          maxLength={20}
          className="w-full rounded-xl border border-eid-gold/30 bg-eid-green/20 px-4 py-3 text-center font-body text-[16px] text-eid-cream placeholder:text-eid-gold/30 focus:border-eid-gold focus:outline-none focus:ring-1 focus:ring-eid-gold"
        />
      </div>

      <div className="mt-12 flex w-full max-w-[280px] gap-3">
        <button
          onClick={() => {
            if (playerName.trim()) startGame();
          }}
          disabled={!playerName.trim()}
          className="flex-1 rounded-xl bg-eid-gold py-3 font-body text-sm font-bold text-eid-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          Let&apos;s Go!
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    let rankBadge = { bg: "bg-gray-800", text: "text-gray-300", label: "Asleep?", hint: "Bhai sona baad mein, pehle Eidee collect karo!" };
    if (eidee >= 400) rankBadge = { bg: "bg-amber-500", text: "text-black", label: "Legendary Tapper", hint: "Mashallah! You are built different. Eid Mubarak!" };
    else if (eidee >= 200) rankBadge = { bg: "bg-teal-600", text: "text-white", label: "Speedy Fingers", hint: "Not bad at all! Eid Mubarak — you earned it!" };
    else if (eidee >= 100) rankBadge = { bg: "bg-yellow-600", text: "text-black", label: "Getting There", hint: "So close to Rs. 100! Try again, you can do it!" };
    else if (eidee >= 50) rankBadge = { bg: "bg-red-800", text: "text-white", label: "Slow Tapper", hint: "Itni mehnat ke baad sirf itna? Eid Mubarak anyway!" };

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: `I collected Rs.${eidee} Eidee!`,
          text: `I just played the Eid Mubarak Eidee game and got Rs.${eidee}! Can you beat me? عيد مبارك!`,
          url: window.location.href,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    };

    return (
      <div className="flex flex-col items-center justify-center p-8 pt-12 text-center h-full min-h-[460px]">
        <h2 className="font-body text-sm uppercase tracking-widest text-eid-muted">
          You Collected
        </h2>
        <div className="mt-4 font-arabic text-6xl text-eid-gold mb-2 drop-shadow-[0_0_15px_rgba(201,168,76,0.3)]">
          Rs. {displayEidee}
        </div>

        <div className={`mt-4 rounded-full px-5 py-1.5 text-sm font-bold shadow-md ${rankBadge.bg} ${rankBadge.text}`}>
          {rankBadge.label}
        </div>
        <p className="mt-5 max-w-[280px] text-sm text-eid-cream/80 leading-relaxed">{rankBadge.hint}</p>
        
        <p className="mt-6 text-xs font-semibold tracking-wider text-eid-gold/60 uppercase">
          Total Taps: {tapCount}
        </p>

        <div className="mt-auto w-full flex flex-col gap-3 pt-8">
          <button
            onClick={handleShare}
            className="w-full rounded-xl bg-eid-gold py-4 font-body font-bold text-eid-black transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Share
          </button>
          <button
            onClick={() => {
              setPower(0);
              setScreen("intro");
            }}
            className="w-full rounded-xl border-2 border-eid-gold/30 bg-transparent py-4 font-body font-bold text-eid-gold transition-colors hover:bg-eid-gold/10 active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative h-[500px] flex flex-col">
      {screen === "intro" && renderIntro()}
      {screen === "playing" && renderPlaying()}
      {screen === "name-entry" && renderNameEntry()}
      {screen === "times-up" && renderTimesUp()}
      {screen === "result" && renderResult()}
    </div>
  );
}

function TapButton({
  side,
  label,
  flashWrong,
  flashRight,
  onTap,
}: {
  side: "L" | "R";
  label: string;
  flashWrong: boolean;
  flashRight: boolean;
  onTap: () => void;
}) {
  return (
    <button
      onPointerDown={() => onTap()}
      className={`relative flex-1 rounded-full border-2 py-6 transition-all duration-100 outline-none select-none touch-none ${
        flashWrong
          ? "border-red-500 bg-red-500/20 translate-x-[2px] -translate-y-[2px]"
          : flashRight
          ? "border-eid-gold bg-eid-gold/40 scale-95 shadow-[inset_0_0_20px_rgba(201,168,76,0.5)]"
          : "border-eid-gold/30 bg-[rgba(201,168,76,0.06)] active:scale-95"
      }`}
      style={
        flashWrong
          ? { animation: "shake 0.2s cubic-bezier(.36,.07,.19,.97) both" }
          : undefined
      }
    >
      <span className="font-body text-xl font-bold tracking-wider text-eid-cream drop-shadow-md">{label}</span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}} />
    </button>
  );
}
