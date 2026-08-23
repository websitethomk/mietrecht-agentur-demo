import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mietrecht Agentur — Demo-MVP",
  description: "Nicht rechtsverbindlicher Demo-Prototyp zur digitalen Vorbereitung mietrechtlicher Fälle.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body className={geist.variable}>{children}</body></html>;
}
