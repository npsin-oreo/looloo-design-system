import type { Metadata } from "next"
import "./globals.css"

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
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
