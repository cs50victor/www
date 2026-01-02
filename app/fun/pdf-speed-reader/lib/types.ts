export type LineData = {
  index: number
  pageIndex: number
  yPosition: number
  height: number
  wordCount: number
  textContent: string
}

export type WordChunk = {
  index: number
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
  wordCount: number
  textContent: string
}

export type ReaderState = {
  pdfSource: File | string | null
  numPages: number
  isLoading: boolean
  error: string | null
  lines: LineData[]
  currentLineIndex: number
  isPlaying: boolean
  wpm: number
}

export type PersistenceData = {
  pdfUrl?: string
  pdfName?: string
  currentLineIndex: number
  wpm: number
  timestamp: number
}
