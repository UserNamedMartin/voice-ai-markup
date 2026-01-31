import type { Metadata } from "next";
import { MobileBlocker } from "@/components/MobileBlocker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice AI",
  description: "Talk to an AI assistant using your voice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MobileBlocker />
        {children}
      </body>
    </html>
  );
}
