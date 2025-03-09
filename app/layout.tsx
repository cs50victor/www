import './globals.css'
import { unstable_ViewTransition as ViewTransitions } from 'react';
import type { Metadata, Viewport } from 'next'
import { Footer } from './footer'
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono, IBM_Plex_Serif, Mona_Sans } from 'next/font/google';
import { WEBSITE_URL } from '@/lib/constants'

const ibmPlexSans = IBM_Plex_Serif({
  variable: '--font-ibm-plex-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Victor A.",
    template: "%s | Victor A.",
  },
  description: "Software engineer. Builder.",
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html 
        lang="en" 
        className={`${ibmPlexSans.variable} ${geistMono.variable} ${geistSans.variable} ${monaSans.variable} tracking-tight antialiased`}
        suppressHydrationWarning
      >
        <body
          className="bg-white dark:bg-[#0F0F10]"
        >
          <ThemeProvider
            attribute="class"
            storageKey="theme"
            // defaultTheme="system"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen w-full flex-col">
              <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
                {children}
                <Footer />
                <Analytics />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
