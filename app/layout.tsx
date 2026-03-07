import "./globals.css";
import { ReactLenis } from 'lenis/react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MR OG COLLECTIONS | Premium Streetwear",
  description: "Best Jeans, Shirts & T-Shirts in Patna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
        <body>{children}</body>
      </ReactLenis>
    </html>
  );
}