import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Scheherazade_New,
} from "next/font/google";
import AOSProvider from "@/components/providers/AOSProvider";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const scheherazadeNew = Scheherazade_New({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eid Mubarak 1446H — Wishing You Joy & Blessings",
  description:
    "Sending warm Eid wishes, prayers, and blessings to you and your family. Eid Mubarak!",
  openGraph: {
    title: "Eid Mubarak 1446H — Wishing You Joy & Blessings",
    description:
      "Sending warm Eid wishes, prayers, and blessings to you and your family. Eid Mubarak!",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmSans.variable} ${scheherazadeNew.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-[100svh] bg-eid-black font-body text-eid-cream antialiased">
        <AOSProvider>{children}</AOSProvider>
      </body>
    </html>
  );
}
