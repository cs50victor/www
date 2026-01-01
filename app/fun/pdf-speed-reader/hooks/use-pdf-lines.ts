'use client'

import { useState, useCallback, useRef } from 'react'
import type { LineData } from '../lib/types'
import { extractLinesFromContainer } from '../lib/line-detection'

export function usePdfLines() {
  const [lines, setLines] = useState<LineData[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const extractLines = useCallback(() => {
    if (!containerRef.current) return

    setIsExtracting(true)

    requestAnimationFrame(() => {
      if (!containerRef.current) {
        setIsExtracting(false)
        return
      }

      const extracted = extractLinesFromContainer(containerRef.current)
      setLines(extracted)
      setIsExtracting(false)
    })
  }, [])

  const resetLines = useCallback(() => {
    setLines([])
  }, [])

  return {
    lines,
    isExtracting,
    containerRef,
    extractLines,
    resetLines,
  }
}
