import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Friction-to-Flow AI Audit",
    template: "%s | Friction-to-Flow",
  },
  description:
    "AI-powered audit platform to identify friction points and optimize your business processes for maximum flow.",
  keywords: [
    "AI audit",
    "business optimization",
    "friction analysis",
    "process improvement",
    "workflow automation",
  ],
  authors: [{ name: "Friction-to-Flow" }],
  creator: "Friction-to-Flow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f0f0f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        {children}
      </body>
    </html>
  );
}
