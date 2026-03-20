"use client";

import { memo } from "react";
import { IconMoon, IconStar, IconStarFilled } from "@tabler/icons-react";
import { motion, useTransform } from "framer-motion";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useMotionSettings } from "@/lib/useMotionSettings";

type Particle = {
  id: number;
  size: number;
  top: number;
  left: number;
  opacity: number;
  duration: number;
  delay: number;
};

const PARTICLE_COUNT = 60;

const starPositions = [
  { top: "25%", left: "15%", size: 12, opacity: 0.08 },
  { top: "45%", right: "10%", size: 8, opacity: 0.05 },
  { top: "60%", left: "5%", size: 16, opacity: 0.07 },
  { top: "75%", right: "20%", size: 10, opacity: 0.06 },
  { top: "85%", left: "25%", size: 14, opacity: 0.04 },
] as const;

function seededValue(seed: number) {
  return Number((Math.abs(Math.sin(seed) * 10000) % 1).toFixed(4));
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const baseSeed = index * 17.37 + 3.11;

    return {
      id: index,
      size: 1 + seededValue(baseSeed) * 2,
      top: seededValue(baseSeed + 1) * 100,
      left: seededValue(baseSeed + 2) * 100,
      opacity: 0.2 + seededValue(baseSeed + 3) * 0.5,
      duration: 4 + seededValue(baseSeed + 4) * 4,
      delay: seededValue(baseSeed + 5) * 5,
    };
  });
}

const particles = createParticles();

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

function EidBackground() {
  const scrollYProgress = useScrollProgress();
  const { isMobile } = useMotionSettings();
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -80 : -200]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.6]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.1, 0.2, 0.05]);
  const moonY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -24 : -60]);
  const moonRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const topStarY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -12 : -30]);
  const starOneY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -3 : -8]);
  const starTwoY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -6 : -16]);
  const starThreeY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -10 : -24]);
  const starFourY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -13 : -32]);
  const starFiveY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -16 : -40]);
  const clusterTransforms = [starOneY, starTwoY, starThreeY, starFourY, starFiveY];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #0d3b2e 0%, #0a0f0d 72%)",
        }}
      />

      <motion.div
        className="absolute right-[8%] top-[6%] h-[600px] w-[600px] rounded-full will-change-transform"
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 38%, rgba(201,168,76,0) 72%)",
        }}
      />

      <motion.div
        className="absolute will-change-transform"
        style={{ top: "8%", right: "6%", y: moonY, rotate: moonRotate }}
      >
        <IconMoon size={120} stroke={0.5} color="rgba(201,168,76,0.06)" />
      </motion.div>

      <motion.div
        className="absolute will-change-transform"
        style={{ top: "15%", left: "8%", y: topStarY }}
      >
        <IconStarFilled size={48} color="rgba(201,168,76,0.05)" />
      </motion.div>

      {starPositions.map((star, index) => (
        <motion.div
          key={`${star.top}-${index}`}
          className="absolute will-change-transform"
          style={{ ...star, y: clusterTransforms[index] }}
        >
          <IconStar
            size={star.size}
            color={`rgba(201,168,76,${star.opacity})`}
          />
        </motion.div>
      ))}

      <div
        className="absolute inset-0 opacity-[0.02] md:opacity-[0.04]"
        style={{
          backgroundImage: patternUrl,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />

      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: particlesY }}
      >
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-eid-gold will-change-transform"
            initial={{ y: -20 }}
            animate={{ y: [-20, 20, -20] }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: "0 0 10px rgba(201,168,76,0.22)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default memo(EidBackground);
