'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { LineData } from '../lib/types'
import { calculateLineDuration } from '../lib/wpm'

type UsePacerOptions = {
  lines: LineData[]
  wpm: number
  onLineChange?: (lineIndex: number) => void
  onComplete?: () => void
}

export function usePacer({ lines, wpm, onLineChange, onComplete }: UsePacerOptions) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleNextLine = useCallback(() => {
    if (lines.length === 0) return

    setCurrentLineIndex((prevIndex) => {
      const currentLine = lines[prevIndex]
      if (!currentLine) return prevIndex

      const duration = calculateLineDuration(currentLine, wpm)

      timerRef.current = setTimeout(() => {
        const nextIndex = prevIndex + 1
        if (nextIndex >= lines.length) {
          setIsPlaying(false)
          onComplete?.()
          return
        }

        setCurrentLineIndex(nextIndex)
        onLineChange?.(nextIndex)
        scheduleNextLine()
      }, duration)

      return prevIndex
    })
  }, [lines, wpm, onLineChange, onComplete])

  const play = useCallback(() => {
    if (lines.length === 0) return
    setIsPlaying(true)
  }, [lines])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
  }, [clearTimer])

  const stop = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    setCurrentLineIndex(0)
    onLineChange?.(0)
  }, [clearTimer, onLineChange])

  const jumpToLine = useCallback(
    (index: number) => {
      if (index < 0 || index >= lines.length) return
      clearTimer()
      setCurrentLineIndex(index)
      onLineChange?.(index)
      if (isPlaying) {
        setTimeout(scheduleNextLine, 0)
      }
    },
    [lines.length, clearTimer, onLineChange, isPlaying, scheduleNextLine]
  )

  useEffect(() => {
    if (isPlaying && lines.length > 0) {
      scheduleNextLine()
    }
    return clearTimer
  }, [isPlaying, scheduleNextLine, clearTimer, lines.length])

  useEffect(() => {
    if (isPlaying) {
      clearTimer()
      scheduleNextLine()
    }
  }, [wpm, isPlaying, clearTimer, scheduleNextLine])

  return {
    currentLineIndex,
    isPlaying,
    play,
    pause,
    stop,
    jumpToLine,
    setCurrentLineIndex,
  }
}
