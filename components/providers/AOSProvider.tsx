"use client";

import { useEffect } from "react";

export default function AOSProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import("aos").then(({ default: AOS }) => {
      import("aos/dist/aos.css");
      AOS.init({
        duration: 900,
        easing: "ease-out-cubic",
        once: false,
        mirror: true,
        offset: typeof window !== "undefined" && window.innerWidth < 768 ? 40 : 80,
        delay: 0,
        disable: false,
        anchorPlacement: "top-bottom",
        startEvent: "DOMContentLoaded",
      });
    });

    return () => {
      import("aos").then(({ default: AOS }) => AOS.refresh());
    };
  }, []);

  return <>{children}</>;
}
