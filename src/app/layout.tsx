import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Friction-to-Flow Deep Flow Dashboard",
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
  themeColor: "#f9f7f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${nunitoSans.variable} font-sans antialiased h-full text-[var(--text-main)] bg-[var(--neo-bg)]`}
      >
        {children}
      </body>
    </html>
  );
}
