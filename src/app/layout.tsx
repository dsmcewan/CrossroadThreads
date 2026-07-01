import type { Metadata } from "next";
import { IM_Fell_English, IM_Fell_English_SC, Ultra } from "next/font/google";
import { COPY } from "@/lib/copy";
import MuseumFooter from "@/components/layout/MuseumFooter";
import MuseumHeader from "@/components/layout/MuseumHeader";
import "./globals.css";

const ultra = Ultra({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const imFell = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

const imFellSC = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caps",
});

export const metadata: Metadata = {
  title: "The Crossroad Archive · Crossroad Threads",
  description:
    "A permanent exhibit of Crossroad Threads. Southern Gothic Americana meets mythology. The gift shop is the museum.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ultra.variable} ${imFell.variable} ${imFellSC.variable}`}>
      <body>
        <MuseumHeader />
        {children}
        <MuseumFooter />
      </body>
    </html>
  );
}
