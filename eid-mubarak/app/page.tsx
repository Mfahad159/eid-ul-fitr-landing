import { Footer } from "@/components/sections/Footer";
import { Greeting } from "@/components/sections/Greeting";
import { Hero } from "@/components/sections/Hero";
import { Wishes } from "@/components/sections/Wishes";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <Wishes />
      <Greeting />
      <Footer />
    </main>
  );
}
