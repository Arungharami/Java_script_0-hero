import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://javascript-0-hero.vercel.app"),
  title: {
    default: "JavaScript 0 → Hero | Master JavaScript in 8 Weeks",
    template: "%s | JavaScript 0 → Hero",
  },
  description:
    "Learn modern JavaScript by coding, debugging, and shipping real projects in a focused 8-week path.",
  openGraph: {
    title: "JavaScript 0 → Hero",
    description: "Master JavaScript in 8 Weeks — Learn. Code. Build. Ship.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript 0 → Hero",
    description: "Master JavaScript in 8 Weeks — Learn. Code. Build. Ship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${mono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
