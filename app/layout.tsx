// app/layout.tsx
import "@/app/global.css"
import type { Metadata } from "next"
import { ReactNode } from "react"
import { Providers } from "@/app/ui/components/providers"

export const metadata: Metadata = {
  title: {
    default: "synNest",
    template: "%s | synNest"
  },
  description: "AI Personal Manager for orchestrating tasks, portfolio, and calendars.",
  openGraph: {
    title: "synNest",
    url: "https://your-app.com",
    siteName: "synNest",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "synNest",
    description: "Your AI-powered personal manager for work and life."
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
