import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { unstable_ViewTransition as ViewTransitions } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm',
  weight: ['400', '500', '600', '700']
});

const geist = GeistSans;

export const metadata: Metadata = {
  metadataBase: new URL("https://vic.so"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Victor A.",
    template: "%s | Victor A.",
  },
  description: "Software engineer. Builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${ibmPlexSans.variable} ${geist.variable}`}
      >
        <body className="antialiased tracking-tight">
          <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 bg-white text-gray-900">
            <main className="max-w-[60ch] mx-auto w-full space-y-6">
              {children}
            </main>
            <Footer />
            <Analytics />
          </div>
        </body>
      </html>
    </ViewTransitions>
  );
}

function Footer() {
  const links = [
    { name: "twitter", url: "https://twitter.com/vicdotso" },
    // { name: 'youtube', url: 'https://www.youtube.com/@vicdotso' },
    { name: "linkedin", url: "https://www.linkedin.com/in/vicdotso" },
    { name: "github", url: "https://github.com/cs50victor" },
  ];
  const numLinks = links.length;

  return (
    <footer className="mt-28 text-center">
      <div className="flex justify-center space-x-4 tracking-tight">
        {links.map((link, i) => (
          <div key={link.name} className="space-x-4">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200 tracking-wide underline underline-offset-5"
            >
              {link.name} ({
                link.url.includes('linkedin.com') 
                  ? link.url.split('/in/')[1]
                  : link.url.split('.com/')[1]
              })
            </a>
            {i != numLinks - 1 && (
              <span className="text-gray-500 font-semibold">/</span>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}


// inspo for later:
// https://www.0de5.net/explore
// https://rauchg.com/
// https://www.shel.win/
// https://www.cpu.land/