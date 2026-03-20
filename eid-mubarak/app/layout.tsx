import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Scheherazade_New,
} from "next/font/google";
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
  title: "Eid Mubarak",
  description: "Luxury dark-themed Eid Mubarak landing page",
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
      <body className="min-h-screen bg-eid-black font-body text-eid-cream antialiased">
        {children}
      </body>
    </html>
  );
}
