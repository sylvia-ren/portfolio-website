import type { Metadata } from "next";
import { satoshi } from "@/fonts";
import { getSite } from "@/lib/content";
import "./globals.css";

const site = getSite();

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${satoshi.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
