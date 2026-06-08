import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

// Google Sans — the kit's `family/sans`, bundled as a local variable font.
const googleSans = localFont({
  src: [
    { path: "./fonts/GoogleSans.ttf", style: "normal" },
    { path: "./fonts/GoogleSans-Italic.ttf", style: "italic" },
  ],
  variable: "--font-google-sans",
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
      className={`${googleSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
