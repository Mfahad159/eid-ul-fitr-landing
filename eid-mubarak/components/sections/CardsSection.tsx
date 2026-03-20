"use client";

import { motion, useTransform } from "framer-motion";
import {
  IconLamp,
  IconMoon,
  IconStar,
  type Icon,
} from "@tabler/icons-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useMotionSettings } from "@/lib/useMotionSettings";

type Card = {
  title: string;
  body: string;
  Icon: Icon;
  delay: number;
};

const cards: Card[] = [
  {
    Icon: IconMoon,
    title: "Peace & Serenity",
    body: "May the light of this blessed Eid fill your home with peace and your heart with serenity.",
    delay: 0,
  },
  {
    Icon: IconStar,
    title: "Joy & Laughter",
    body: "Wishing you a day full of laughter, love, and the warmth of family gathered together.",
    delay: 150,
  },
  {
    Icon: IconLamp,
    title: "Barakah & Blessings",
    body: "May Allah's countless blessings rain upon you and your loved ones this Eid and always.",
    delay: 300,
  },
];

export function CardsSection() {
  const scrollYProgress = useScrollProgress();
  const { isMobile, shouldReduceMotion } = useMotionSettings();
  const sectionStart = shouldReduceMotion ? 0 : isMobile ? 24 : 60;
  const cardStart = shouldReduceMotion ? 0 : isMobile ? 32 : 80;
  const sectionY = useTransform(scrollYProgress, [0.2, 0.5], [sectionStart, 0]);
  const cardOneY = useTransform(scrollYProgress, [0.2, 0.6], [cardStart, 0]);
  const cardTwoY = useTransform(scrollYProgress, [0.25, 0.6], [cardStart, 0]);
  const cardThreeY = useTransform(scrollYProgress, [0.3, 0.6], [cardStart, 0]);
  const cardOffsets = [cardOneY, cardTwoY, cardThreeY];

  return (
    <section
      aria-labelledby="cards-section-heading"
      className="relative bg-transparent px-4 py-[120px] md:px-8 lg:px-16"
    >
      <motion.div
        className="mx-auto flex w-full max-w-7xl flex-col will-change-transform"
        style={{ y: sectionY }}
      >
        <p
          className="text-center font-body text-sm uppercase tracking-[0.35em] text-eid-muted md:text-base"
          data-aos="fade-down"
          data-aos-duration="600"
        >
          Our Wishes
        </p>

        <h2
          id="cards-section-heading"
          className="mt-5 mb-16 text-center font-display text-2xl text-eid-cream md:text-4xl lg:text-5xl"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          Blessings for You & Yours
        </h2>

        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="200"
        >
          {cards.map(({ Icon, title, body, delay }, index) => (
            <motion.div
              key={title}
              className="h-full will-change-transform"
              style={{ y: cardOffsets[index] }}
            >
              <article
                className="flex h-full flex-col rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(13,59,46,0.4)] p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(201,168,76,0.5)] hover:shadow-[0_0_40px_rgba(201,168,76,0.08)] md:p-8"
                data-aos="flip-left"
                data-aos-duration="800"
                data-aos-delay={delay}
                data-aos-easing="ease-out-cubic"
              >
                <Tooltip label={title} placement="top" offsetValue={8}>
                  <Icon className="mb-6 text-eid-gold" size={32} stroke={1.6} />
                </Tooltip>
                <h3 className="font-body text-[1.1rem] font-medium text-eid-cream">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-[1.7] text-eid-muted md:text-base">
                  {body}
                </p>
              </article>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
