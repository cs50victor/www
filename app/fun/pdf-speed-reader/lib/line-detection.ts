import type { LineData } from './types'
import { countWords } from './wpm'

type SpanData = {
  top: number
  bottom: number
  height: number
  text: string
  pageIndex: number
}

const Y_TOLERANCE = 5

export function extractLinesFromContainer(container: HTMLElement): LineData[] {
  const pages = container.querySelectorAll('.react-pdf__Page')
  const allSpans: SpanData[] = []

  const containerRect = container.getBoundingClientRect()
  const scrollTop = container.scrollTop

  pages.forEach((page, pageIndex) => {
    const textLayer = page.querySelector('.react-pdf__Page__textContent')
    if (!textLayer) return

    const spans = textLayer.querySelectorAll('span')
    spans.forEach((span) => {
      const text = span.textContent?.trim()
      if (!text) return

      const rect = span.getBoundingClientRect()
      const relativeTop = rect.top - containerRect.top + scrollTop

      allSpans.push({
        top: relativeTop,
        bottom: relativeTop + rect.height,
        height: rect.height,
        text,
        pageIndex,
      })
    })
  })

  if (allSpans.length === 0) return []

  allSpans.sort((a, b) => a.top - b.top)

  const lines: LineData[] = []
  let currentLine: SpanData[] = [allSpans[0]]

  for (let i = 1; i < allSpans.length; i++) {
    const span = allSpans[i]
    const lastSpan = currentLine[currentLine.length - 1]

    if (Math.abs(span.top - lastSpan.top) <= Y_TOLERANCE) {
      currentLine.push(span)
    } else {
      lines.push(createLineFromSpans(currentLine, lines.length))
      currentLine = [span]
    }
  }

  if (currentLine.length > 0) {
    lines.push(createLineFromSpans(currentLine, lines.length))
  }

  return lines
}

function createLineFromSpans(spans: SpanData[], index: number): LineData {
  const text = spans.map((s) => s.text).join(' ')
  const minTop = Math.min(...spans.map((s) => s.top))
  const maxBottom = Math.max(...spans.map((s) => s.bottom))

  return {
    index,
    pageIndex: spans[0].pageIndex,
    yPosition: minTop,
    height: maxBottom - minTop,
    wordCount: countWords(text),
    textContent: text,
  }
}
