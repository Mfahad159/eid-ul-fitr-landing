"use client";

import { motion } from "framer-motion";

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

function seededValue(seed: number) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
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

export default function EidBackground() {
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
        className="absolute right-[8%] top-[6%] h-[600px] w-[600px] rounded-full"
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 38%, rgba(201,168,76,0) 72%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: patternUrl,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
          opacity: 0.04,
        }}
      />

      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-eid-gold"
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
      </div>
    </div>
  );
}
