import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "The Love Wall - Immortalize Your Love Story",
  description:
    "Reserve your square on The Love Wall. 10,000 couples. One digital monument to love.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "The Love Wall - Immortalize Your Love Story",
    description:
      "Reserve your square on The Love Wall. 10,000 couples. One digital monument to love.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap" as="style" />
      </head>
      <body>{children}</body>
    </html>
  );
}
