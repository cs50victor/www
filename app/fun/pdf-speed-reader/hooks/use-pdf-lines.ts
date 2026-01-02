'use client'

import { useState, useCallback, useRef } from 'react'
import type { WordChunk } from '../lib/types'
import { extractChunksFromContainer } from '../lib/line-detection'

export function usePdfChunks() {
  const [chunks, setChunks] = useState<WordChunk[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const extractChunks = useCallback(() => {
    if (!containerRef.current) return

    setIsExtracting(true)

    requestAnimationFrame(() => {
      if (!containerRef.current) {
        setIsExtracting(false)
        return
      }

      const extracted = extractChunksFromContainer(containerRef.current)
      setChunks(extracted)
      setIsExtracting(false)
    })
  }, [])

  const resetChunks = useCallback(() => {
    setChunks([])
  }, [])

  return {
    chunks,
    isExtracting,
    containerRef,
    extractChunks,
    resetChunks,
  }
}
