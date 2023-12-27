import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Albion Arbitrage",
  description: "Arbitrage table for bulk goods in Albion Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="container">{children}</body>
      <Analytics />
    </html>
  );
}
