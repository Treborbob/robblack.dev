import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";
import { person } from "@/lib/content";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const description =
  "Rob Black, senior developer in Ipswich. Shipping since 1999. Developer experience, CI/CD, business systems and AI-assisted delivery.";

export const metadata: Metadata = {
  metadataBase: new URL("https://robblack.dev"),
  title: `${person.name} | Release notes`,
  description,
  openGraph: {
    title: `${person.name} | Release notes`,
    description,
    url: "https://robblack.dev",
    siteName: "robblack.dev",
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary", title: person.name, description },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
