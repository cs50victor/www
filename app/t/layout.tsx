'use client'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ReactNode, useEffect, useState } from 'react'
import { Header } from '../header'

function CopyButton() {
  const [text, setText] = useState('Copy URL')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    setTimeout(() => {
      setText('Copy URL')
    }, 2000)
  }, [text])

  return (
    <button
      onClick={() => {
        setText('Copied URL ☑︎')
        navigator.clipboard.writeText(currentUrl)
      }}
      className="font-base flex items-center gap-1 text-center text-sm transition-colors text-foreground/50"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
    </button>
  )
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
