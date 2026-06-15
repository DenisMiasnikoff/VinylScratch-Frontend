import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VinylScratch",
  description: "Your personal music platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}