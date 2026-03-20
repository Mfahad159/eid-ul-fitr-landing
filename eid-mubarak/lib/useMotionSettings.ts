"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useMotionSettings() {
  const reducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTouchDevice(window.matchMedia("(hover: none)").matches);
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return {
    isMobile,
    isTouchDevice,
    shouldReduceMotion: reducedMotion,
  };
}
