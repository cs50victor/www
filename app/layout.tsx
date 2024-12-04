import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["greek", "latin-ext"], variable: "--font-inter" });

const manrope = Manrope({
  subsets: ["greek", "latin-ext"],
  variable: "--font-manrope",
});

const cursiveFont = localFont({
  src: "./AdobeTextPro-Regular.woff2",
  variable: "--font-cursive",
  // display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vic.so"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Victor A.",
    template: "%s | Victor A.",
  },
  description: "Software engineer, optimist, community builder.",
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
        className={`${cursiveFont.variable} ${manrope.variable} ${inter.className} ${GeistMono.variable}`}
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
    { name: "twitter", url: "https://x.com/vic8or" },
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
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors duration-200 font-mono tracking-tighter underline underline-offset-5"
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