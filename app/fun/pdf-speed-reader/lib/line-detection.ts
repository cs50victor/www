import type { WordChunk } from './types'
import { countWords } from './wpm'

type WordToken = {
  left: number
  top: number
  width: number
  height: number
  text: string
  pageIndex: number
}

const Y_TOLERANCE = 5
const WORDS_PER_CHUNK = 4

export function extractChunksFromContainer(container: HTMLElement): WordChunk[] {
  const pages = container.querySelectorAll('.react-pdf__Page')
  const allTokens: WordToken[] = []

  const containerRect = container.getBoundingClientRect()
  const scrollTop = container.scrollTop

  pages.forEach((page, pageIndex) => {
    const textLayer = page.querySelector('.react-pdf__Page__textContent')
    if (!textLayer) return

    const spans = textLayer.querySelectorAll('span')
    spans.forEach((span) => {
      allTokens.push(...extractWordTokensFromSpan(span, pageIndex, containerRect, scrollTop))
    })
  })

  if (allTokens.length === 0) return []

  const lines = groupIntoLines(allTokens)
  const chunks: WordChunk[] = []

  for (const line of lines) {
    const lineChunks = splitLineIntoChunks(line, chunks.length)
    chunks.push(...lineChunks)
  }

  return chunks
}

function extractWordTokensFromSpan(
  span: Element,
  pageIndex: number,
  containerRect: DOMRect,
  scrollTop: number
): WordToken[] {
  const textIndex = buildTextIndex(span)
  if (!textIndex) {
    const fallbackText = span.textContent?.trim()
    if (!fallbackText) return []
    const rect = span.getBoundingClientRect()
    return [
      {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top + scrollTop,
        width: rect.width,
        height: rect.height,
        text: fallbackText,
        pageIndex,
      },
    ]
  }

  const { text, segments } = textIndex
  if (!text.trim()) return []

  const tokens: WordToken[] = []
  const matches = text.matchAll(/\S+/g)

  for (const match of matches) {
    const tokenText = match[0]
    const startIndex = match.index
    if (startIndex === undefined) continue

    const start = resolveDomPosition(segments, startIndex)
    const end = resolveDomPosition(segments, startIndex + tokenText.length)
    if (!start || !end) continue

    const range = document.createRange()
    range.setStart(start.node, start.offset)
    range.setEnd(end.node, end.offset)

    const rect = range.getBoundingClientRect()
    range.detach?.()

    if (rect.width <= 0 || rect.height <= 0) continue

    tokens.push({
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top + scrollTop,
      width: rect.width,
      height: rect.height,
      text: tokenText,
      pageIndex,
    })
  }

  if (tokens.length > 0) return tokens

  const fallbackText = span.textContent?.trim()
  if (!fallbackText) return []
  const rect = span.getBoundingClientRect()
  return [
    {
      left: rect.left - containerRect.left,
      top: rect.top - containerRect.top + scrollTop,
      width: rect.width,
      height: rect.height,
      text: fallbackText,
      pageIndex,
    },
  ]
}

type TextSegment = {
  node: Text
  start: number
  end: number
}

function buildTextIndex(root: Element): { text: string; segments: TextSegment[] } | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const segments: TextSegment[] = []
  let text = ''

  let node = walker.nextNode()
  while (node) {
    const textNode = node as Text
    const nodeText = textNode.nodeValue ?? ''
    const start = text.length
    text += nodeText
    segments.push({ node: textNode, start, end: start + nodeText.length })
    node = walker.nextNode()
  }

  if (segments.length === 0) return null

  return { text, segments }
}

function resolveDomPosition(segments: TextSegment[], index: number): { node: Text; offset: number } | null {
  if (index < 0) return null

  for (const seg of segments) {
    if (index >= seg.start && index <= seg.end) {
      return { node: seg.node, offset: index - seg.start }
    }
  }

  const last = segments[segments.length - 1]
  if (last && index === last.end) return { node: last.node, offset: last.end - last.start }
  return null
}

function groupIntoLines(tokens: WordToken[]): WordToken[][] {
  if (tokens.length === 0) return []

  const sorted = [...tokens].sort((a, b) => {
    if (a.pageIndex !== b.pageIndex) return a.pageIndex - b.pageIndex
    if (Math.abs(a.top - b.top) > Y_TOLERANCE) return a.top - b.top
    return a.left - b.left
  })

  const lines: WordToken[][] = []
  let currentLine: WordToken[] = [sorted[0]]
  let currentLineTop = sorted[0].top

  for (let i = 1; i < sorted.length; i++) {
    const token = sorted[i]
    const isSameLine =
      token.pageIndex === currentLine[0].pageIndex &&
      Math.abs(token.top - currentLineTop) <= Y_TOLERANCE

    if (isSameLine) {
      currentLine.push(token)
    } else {
      currentLine.sort((a, b) => a.left - b.left)
      lines.push(currentLine)
      currentLine = [token]
      currentLineTop = token.top
    }
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.left - b.left)
    lines.push(currentLine)
  }

  return lines
}

function splitLineIntoChunks(lineTokens: WordToken[], startIndex: number): WordChunk[] {
  const chunks: WordChunk[] = []
  let currentChunkTokens: WordToken[] = []
  let currentWordCount = 0

  for (const token of lineTokens) {
    currentChunkTokens.push(token)
    currentWordCount += 1

    if (currentWordCount >= WORDS_PER_CHUNK) {
      chunks.push(createChunkFromSpans(currentChunkTokens, startIndex + chunks.length))
      currentChunkTokens = []
      currentWordCount = 0
    }
  }

  if (currentChunkTokens.length > 0) {
    chunks.push(createChunkFromSpans(currentChunkTokens, startIndex + chunks.length))
  }

  return chunks
}

function createChunkFromSpans(tokens: WordToken[], index: number): WordChunk {
  const text = tokens.map((s) => s.text).join(' ')
  const minLeft = Math.min(...tokens.map((s) => s.left))
  const maxRight = Math.max(...tokens.map((s) => s.left + s.width))
  const minTop = Math.min(...tokens.map((s) => s.top))
  const maxBottom = Math.max(...tokens.map((s) => s.top + s.height))

  return {
    index,
    pageIndex: tokens[0].pageIndex,
    x: minLeft,
    y: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
    wordCount: countWords(text),
    textContent: text,
  }
}
