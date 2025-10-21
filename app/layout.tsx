import './globals.css'
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { Metadata, Viewport } from 'next'
import { Footer } from './footer'
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono, Gowun_Batang, Mona_Sans } from 'next/font/google';
import { WEBSITE_URL } from '@/lib/constants'
import localFont from 'next/font/local';

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
  openGraph: {
    type: 'website',
    url: WEBSITE_URL,
    title: "Victor A.",
    description: "Software engineer. Builder.",
    siteName: 'Victor A.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Victor A.",
    description: "Software engineer. Builder.",
  },
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  preload: true,
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  preload: false,
  subsets: ['latin'],
})

const gowun = Gowun_Batang({
  variable: '--font-geist-serif',
  subsets: ['latin'],
  weight: ['400', '700']
});

// todo use later
const _oldStandard = localFont({
  variable: '--font-old-standard',
  src: [
    {
      path: './iowan-old-style_bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './iowan-old-style_italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './iowan-old-style_regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ]
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransition>
      <html 
        lang="en" 
        className={`${geistMono.variable} ${geistSans.variable} ${gowun.variable} ${monaSans.variable} tracking-tight antialiased`}
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
    </ViewTransition>
  )
}
