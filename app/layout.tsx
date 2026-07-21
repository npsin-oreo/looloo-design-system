import type { Metadata } from "next"
import { Noto_Sans_Thai } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"

// Noto Sans Thai — the kit's `family/sans`. Weights match the text-style ramp
// (Body 400 · Label 500 · Subheader/Header 600 · Display 700).
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
})

// Geist Mono — the kit's `family/mono`, bundled as a local variable font.
const geistMono = localFont({
  src: [{ path: "./fonts/GeistMono.ttf", style: "normal" }],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Design → Dev Handoff",
  description:
    "Design system handoff — Figma tokens (tokens.json) + shadcn/ui component library, synced 1:1.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${notoSansThai.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
