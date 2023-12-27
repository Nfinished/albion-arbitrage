import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Albion Arbitrage",
  description: "Arbitrage table for bulk goods in Albion Online",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
      <Analytics />
    </html>
  );
}
