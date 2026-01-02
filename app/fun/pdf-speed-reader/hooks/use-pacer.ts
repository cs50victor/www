'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { WordChunk } from '../lib/types'
import { calculateChunkDuration } from '../lib/wpm'

type UsePacerOptions = {
  chunks: WordChunk[]
  wpm: number
  onChunkChange?: (chunkIndex: number) => void
  onComplete?: () => void
}

export function usePacer({ chunks, wpm, onChunkChange, onComplete }: UsePacerOptions) {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentIndexRef = useRef(0)
  const wpmRef = useRef(wpm)

  wpmRef.current = wpm

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleNext = useCallback(() => {
    if (chunks.length === 0) return

    const idx = currentIndexRef.current
    const currentChunk = chunks[idx]
    if (!currentChunk) return

    const duration = calculateChunkDuration(currentChunk, wpmRef.current)

    timerRef.current = setTimeout(() => {
      const nextIndex = currentIndexRef.current + 1
      if (nextIndex >= chunks.length) {
        setIsPlaying(false)
        onComplete?.()
        return
      }

      currentIndexRef.current = nextIndex
      setCurrentChunkIndex(nextIndex)
      onChunkChange?.(nextIndex)
      scheduleNext()
    }, duration)
  }, [chunks, onChunkChange, onComplete])

  const play = useCallback(() => {
    if (chunks.length === 0) return
    setIsPlaying(true)
  }, [chunks])

  const pause = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
  }, [clearTimer])

  const stop = useCallback(() => {
    setIsPlaying(false)
    clearTimer()
    currentIndexRef.current = 0
    setCurrentChunkIndex(0)
    onChunkChange?.(0)
  }, [clearTimer, onChunkChange])

  const jumpToChunk = useCallback(
    (index: number) => {
      if (index < 0 || index >= chunks.length) return
      clearTimer()
      currentIndexRef.current = index
      setCurrentChunkIndex(index)
      onChunkChange?.(index)
      if (isPlaying) {
        scheduleNext()
      }
    },
    [chunks.length, clearTimer, onChunkChange, isPlaying, scheduleNext]
  )

  useEffect(() => {
    if (isPlaying && chunks.length > 0) {
      clearTimer()
      scheduleNext()
    }
    return clearTimer
  }, [isPlaying, chunks.length, clearTimer, scheduleNext])

  useEffect(() => {
    currentIndexRef.current = currentChunkIndex
  }, [currentChunkIndex])

  return {
    currentChunkIndex,
    isPlaying,
    play,
    pause,
    stop,
    jumpToChunk,
    setCurrentChunkIndex,
  }
}
