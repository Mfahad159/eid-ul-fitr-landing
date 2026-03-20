"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { EideeGame } from "./EideeGame";

interface EideeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EideeGameModal({ isOpen, onClose }: EideeGameModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div
            className="relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-eid-gold/20 bg-[#0d1f18]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <button
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-eid-gold/15 bg-eid-gold/10 text-eid-gold opacity-60 transition-opacity hover:opacity-100 hover:bg-eid-gold/20"
            >
              <IconX size={16} />
            </button>

            <EideeGame onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
