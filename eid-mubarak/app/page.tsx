"use client";

import { useCallback } from "react";
import { CardsSection } from "@/components/sections/CardsSection";
import { CalligraphySection } from "@/components/sections/CalligraphySection";
import { Footer } from "@/components/sections/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SignatureSection } from "@/components/sections/SignatureSection";
import EidBackground from "@/components/ui/EidBackground";
import EidLoader from "@/components/ui/EidLoader";
import EidMarquee from "@/components/ui/EidMarquee";
import GoldDivider from "@/components/ui/GoldDivider";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

export default function Home() {
  const handleLoaderComplete = useCallback(() => {
    import("aos").then(({ default: AOS }) => AOS.refresh());
  }, []);

  return (
    <>
      <EidLoader onComplete={handleLoaderComplete} />
      <EidBackground />
      <main className="relative z-10 overflow-hidden">
        <HeroSection />
        <GoldDivider />
        <EidMarquee />
        <GoldDivider />
        <CardsSection />
        <CalligraphySection />
        <SignatureSection />
        <GoldDivider />
        <Footer />
      </main>
      <ScrollIndicator />
      <ScrollProgressBar />
    </>
  );
}
