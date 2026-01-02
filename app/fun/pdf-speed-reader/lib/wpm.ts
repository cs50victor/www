import type { WordChunk } from './types'

export function calculateChunkDuration(chunk: WordChunk, wpm: number): number {
  const msPerWord = 60000 / wpm
  return Math.max(chunk.wordCount * msPerWord, 150)
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
