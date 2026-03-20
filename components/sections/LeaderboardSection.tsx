"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Score {
  name: string;
  score: number;
}

export function LeaderboardSection() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [changedRows, setChangedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchScores();

    const channel = supabase
      .channel("eid_scores_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "eid_scores" },
        () => fetchScores()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchScores() {
    const { data } = await supabase
      .from("eid_scores")
      .select("name, score")
      .order("score", { ascending: false })
      .limit(10);

    if (data) {
      setScores((prev) => {
        // Find changed rows to flash them
        if (prev.length > 0) {
          const newChanged = new Set<string>();
          data.forEach((newScore) => {
            const oldScore = prev.find((s) => s.name === newScore.name);
            if (!oldScore || oldScore.score !== newScore.score) {
              newChanged.add(newScore.name);
            }
          });
          if (newChanged.size > 0) {
            setChangedRows(newChanged);
            setTimeout(() => setChangedRows(new Set()), 600);
          }
        }
        return data as Score[];
      });
    }
    setLoading(false);
  }

  return (
    <section
      data-aos="fade-up"
      data-aos-duration="800"
      className="relative z-10 mx-auto w-full max-w-[480px] px-4 py-20"
    >
      <div className="mb-8 text-center relative">
        <div className="absolute -top-2 right-0 flex items-center gap-1.5 rounded-full border border-[#1d9e75]/25 bg-[#1d9e75]/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-[#1d9e75]">
          <span className="h-2 w-2 rounded-full bg-[#1d9e75] animate-pulse-live" />
          Live
        </div>
        
        <div
          className="font-arabic text-base text-eid-gold/50"
          dir="rtl"
          lang="ar"
        >
          عيد مبارك
        </div>
        <h2 className="mt-1 font-display text-4xl italic text-eid-cream sm:text-5xl">
          Eidee Leaderboard
        </h2>
        <p className="mt-2 font-body text-sm text-eid-muted">
          Top earners this Eid
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full animate-shimmer rounded-xl bg-eid-gold/5 bg-gradient-to-r from-transparent via-eid-gold/10 to-transparent bg-[length:200%_100%]"
            />
          ))
        ) : scores.length === 0 ? (
          <div className="py-8 text-center font-body text-sm text-eid-muted">
            No scores yet — be the first to collect Eidee! 🪔
          </div>
        ) : (
          <motion.ul layout className="flex flex-col gap-2">
            <AnimatePresence>
              {scores.map((s, idx) => {
                const rank = idx + 1;
                const isFlash = changedRows.has(s.name);
                
                let rankStyle = "text-eid-muted text-[0.85rem]";
                let rankBg = "bg-transparent";
                let borderLeft = "border border-eid-gold/10";
                
                if (rank === 1) {
                  rankStyle = "text-eid-black font-bold text-sm";
                  rankBg = "bg-[#c9a84c]";
                  borderLeft = "border border-eid-gold/10 border-l-[2px] border-l-[#c9a84c]";
                } else if (rank === 2) {
                  rankStyle = "text-eid-cream font-bold text-sm";
                  rankBg = "bg-[rgba(180,178,169,0.3)]";
                  borderLeft = "border border-eid-gold/10 border-l-[2px] border-l-[rgba(180,178,169,0.5)]";
                } else if (rank === 3) {
                  rankStyle = "text-eid-cream font-bold text-sm";
                  rankBg = "bg-[rgba(186,117,23,0.3)]";
                  borderLeft = "border border-eid-gold/10 border-l-[2px] border-l-[rgba(186,117,23,0.5)]";
                }

                return (
                  <motion.li
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    key={s.name}
                    className={`flex items-center gap-3 rounded-xl bg-[#0d3b2e]/30 px-4 py-3 transition-colors duration-300 ${borderLeft} ${
                      isFlash ? "bg-eid-gold/15" : ""
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${rankBg} ${rankStyle}`}>
                      {rank <= 3 ? `#${rank}` : rank}
                    </div>
                    <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-body text-[0.95rem] font-medium text-eid-cream">
                      {s.name}
                    </div>
                    <div className="shrink-0 font-display text-lg font-bold text-eid-gold">
                      Rs. {s.score}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-live {
          animation: pulse-live 1.8s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}
