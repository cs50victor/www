"use client"
import { TextMorph } from "@/components/ui/text-morph"
import { useEffect, useState } from "react"

export function CopyButton() {
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
