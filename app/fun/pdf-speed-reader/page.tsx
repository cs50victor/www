'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { UploadZone } from './components/upload-zone'
import { SpeedControls } from './components/speed-controls'
import { PacerOverlay } from './components/pacer-overlay'
import { usePdfLines } from './hooks/use-pdf-lines'
import { usePacer } from './hooks/use-pacer'
import { usePersistence } from './hooks/use-persistence'
import type { LineData } from './lib/types'

const PdfViewer = dynamic(
  () => import('./components/pdf-viewer').then((mod) => mod.PdfViewer),
  { ssr: false }
)

export default function PdfSpeedReaderPage() {
  const [pdfSource, setPdfSource] = useState<File | string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [wpm, setWpm] = useState(300)
  const [containerHeight, setContainerHeight] = useState(0)
  const [showResumePrompt, setShowResumePrompt] = useState(false)

  const { lines, containerRef, extractLines, resetLines } = usePdfLines()
  const { savedState, savedFile, isLoading, saveState, clearState } = usePersistence()

  const scrollToLine = useCallback((line: LineData) => {
    if (!containerRef.current) return
    const viewportHeight = containerRef.current.clientHeight
    containerRef.current.scrollTo({
      top: line.yPosition - viewportHeight / 3,
      behavior: 'smooth',
    })
  }, [containerRef])

  const {
    currentLineIndex,
    isPlaying,
    play,
    pause,
    stop,
    jumpToLine,
    setCurrentLineIndex,
  } = usePacer({
    lines,
    wpm,
    onLineChange: (index) => {
      const line = lines[index]
      if (line) scrollToLine(line)
    },
  })

  useEffect(() => {
    if (!isLoading && savedState && !pdfSource) {
      setShowResumePrompt(true)
    }
  }, [isLoading, savedState, pdfSource])

  useEffect(() => {
    if (pdfSource && lines.length > 0 && currentLineIndex > 0) {
      const pdfUrl = typeof pdfSource === 'string' ? pdfSource : undefined
      const pdfName = pdfFile?.name
      saveState({ pdfUrl, pdfName, currentLineIndex, wpm }, pdfFile || undefined)
    }
  }, [currentLineIndex, wpm, pdfSource, pdfFile, lines.length, saveState])

  const handleResume = useCallback(() => {
    setShowResumePrompt(false)
    if (savedState) {
      setWpm(savedState.wpm)
      if (savedState.pdfUrl) {
        setPdfSource(savedState.pdfUrl)
      } else if (savedFile) {
        setPdfSource(savedFile)
        setPdfFile(savedFile)
      }
    }
  }, [savedState, savedFile])

  const handleStartFresh = useCallback(() => {
    setShowResumePrompt(false)
    clearState()
  }, [clearState])

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    resetLines()
    setPdfSource(file)
    setPdfFile(file)
  }, [resetLines])

  const handleUrlSubmit = useCallback((url: string) => {
    setError(null)
    resetLines()
    setPdfSource(url)
    setPdfFile(null)
  }, [resetLines])

  const handleLoadSuccess = useCallback((pages: number) => {
    setNumPages(pages)
  }, [])

  const handleAllPagesRendered = useCallback(() => {
    extractLines()
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight)
    }
    if (savedState && savedState.currentLineIndex > 0) {
      setTimeout(() => {
        setCurrentLineIndex(savedState.currentLineIndex)
        const line = lines[savedState.currentLineIndex]
        if (line) scrollToLine(line)
      }, 100)
    }
  }, [extractLines, containerRef, savedState, setCurrentLineIndex, lines, scrollToLine])

  const handleError = useCallback((err: string) => {
    setError(err)
    setPdfSource(null)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const handleStop = useCallback(() => {
    stop()
    clearState()
  }, [stop, clearState])

  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (lines.length === 0) return
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const clickY = e.clientY - rect.top + containerRef.current.scrollTop

      let closestIndex = 0
      let closestDistance = Infinity

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineCenter = line.yPosition + line.height / 2
        const distance = Math.abs(clickY - lineCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }

      jumpToLine(closestIndex)
    },
    [lines, containerRef, jumpToLine]
  )

  const currentPage =
    lines.length > 0 && lines[currentLineIndex]
      ? lines[currentLineIndex].pageIndex + 1
      : 1

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    )
  }

  if (showResumePrompt && savedState) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900">Resume Reading?</h2>
          <p className="mt-2 text-zinc-500">
            You were reading {savedState.pdfName || 'a PDF'} at {savedState.wpm} WPM
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResume}
            className="rounded-lg bg-zinc-900 px-6 py-2 text-white transition-colors hover:bg-zinc-800"
          >
            Resume
          </button>
          <button
            onClick={handleStartFresh}
            className="rounded-lg border border-zinc-300 px-6 py-2 text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Start Fresh
          </button>
        </div>
      </div>
    )
  }

  if (!pdfSource) {
    return (
      <>
        <UploadZone onFileSelect={handleFileSelect} onUrlSubmit={handleUrlSubmit} />
        {error && (
          <p className="mt-4 text-center text-red-500">{error}</p>
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <div onClick={handleContainerClick} className="cursor-pointer">
        <PdfViewer
          ref={containerRef}
          source={pdfSource}
          onLoadSuccess={handleLoadSuccess}
          onAllPagesRendered={handleAllPagesRendered}
          onError={handleError}
        >
          {lines.length > 0 && (
            <PacerOverlay
              lines={lines}
              currentLineIndex={currentLineIndex}
              containerHeight={containerHeight}
            />
          )}
        </PdfViewer>
      </div>

      {numPages > 0 && (
        <SpeedControls
          isPlaying={isPlaying}
          wpm={wpm}
          currentPage={currentPage}
          totalPages={numPages}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onWpmChange={setWpm}
        />
      )}
    </div>
  )
}
