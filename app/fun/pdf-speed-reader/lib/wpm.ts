import type { LineData } from './types'

export function calculateLineDuration(line: LineData, wpm: number): number {
  const msPerWord = 60000 / wpm
  return Math.max(line.wordCount * msPerWord, 200)
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
