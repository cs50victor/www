import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ReactNode } from 'react'
import { Header } from '../header'
import { CopyButton } from './copybutton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thoughts - Victor A.',
  description: "Writing about tech related things I think are cool.",
  openGraph: {
    type: 'website',
    url: 'https://vic.so/t',
    title: 'Thoughts - Victor A.',
    description: "Writing about tech related things I think are cool.",
    siteName: 'Victor A.',
  },
  twitter: { card: 'summary_large_image' },
}


export default function LayoutBlogPost({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-1 bg-foreground/30"
        springOptions={{
          bounce: 0,
        }}
      />
      <Header />
      <div className="absolute right-4 top-24">
        <CopyButton />
      </div>
      <main className="mb-52 prose prose-gray md:prose-figure:-mx-18 lg:prose-figure:-mx-32 prose-h4:prose-base dark:prose-invert prose-h1:mt-18 prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:font-semibold prose-h1:tracking-tighter prose-h1:font-serif prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium">
        {children}
      </main>
    </>
  )
}
