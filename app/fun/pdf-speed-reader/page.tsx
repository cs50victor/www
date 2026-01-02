'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { UploadZone } from './components/upload-zone'
import { SpeedControls } from './components/speed-controls'
import { PacerOverlay } from './components/pacer-overlay'
import { usePdfChunks } from './hooks/use-pdf-lines'
import { usePacer } from './hooks/use-pacer'
import { usePersistence } from './hooks/use-persistence'
import type { WordChunk } from './lib/types'

const PdfViewer = dynamic(
  () => import('./components/pdf-viewer').then((mod) => mod.PdfViewer),
  { ssr: false }
)

export default function PdfSpeedReaderPage() {
  const [pdfSource, setPdfSource] = useState<File | string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [wpm, setWpm] = useState(300)
  const [containerHeight, setContainerHeight] = useState(0)
  const [showResumePrompt, setShowResumePrompt] = useState(false)

  const { chunks, isExtracting, containerRef, extractChunks, resetChunks } = usePdfChunks()
  const { savedState, savedFile, isLoading, saveState, clearState } = usePersistence()
  const isAutoScrollingRef = useRef(false)

  const scrollToChunk = useCallback((chunk: WordChunk) => {
    if (!containerRef.current) return
    isAutoScrollingRef.current = true
    const viewportHeight = containerRef.current.clientHeight
    containerRef.current.scrollTo({
      top: chunk.y - viewportHeight / 3,
      behavior: 'smooth',
    })
    setTimeout(() => {
      isAutoScrollingRef.current = false
    }, 400)
  }, [containerRef])

  const {
    currentChunkIndex,
    isPlaying,
    play,
    pause,
    stop,
    jumpToChunk,
    setCurrentChunkIndex,
  } = usePacer({
    chunks,
    wpm,
    onChunkChange: (index) => {
      const chunk = chunks[index]
      if (chunk) scrollToChunk(chunk)
    },
  })

  useEffect(() => {
    if (!isLoading && savedState && !pdfSource) {
      setShowResumePrompt(true)
    }
  }, [isLoading, savedState, pdfSource])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (!isAutoScrollingRef.current && isPlaying) {
          pause()
        }
      }, 100)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [containerRef, isPlaying, pause])

  useEffect(() => {
    if (pdfSource && chunks.length > 0 && currentChunkIndex > 0) {
      const pdfName = (() => {
        if (pdfFile?.name) return pdfFile.name
        if (!pdfUrl) return undefined
        try {
          return new URL(pdfUrl).pathname.split('/').pop()
        } catch {
          return undefined
        }
      })()
      saveState({ pdfUrl: pdfUrl ?? undefined, pdfName, currentLineIndex: currentChunkIndex, wpm }, pdfFile || undefined)
    }
  }, [currentChunkIndex, wpm, pdfSource, pdfFile, pdfUrl, chunks.length, saveState])

  const handleResume = useCallback(() => {
    setShowResumePrompt(false)
    if (savedState) {
      setWpm(savedState.wpm)
      if (savedState.pdfUrl) {
        setPdfUrl(savedState.pdfUrl)
        setPdfSource(`/api/pdf-proxy?url=${encodeURIComponent(savedState.pdfUrl)}`)
      } else if (savedFile) {
        setPdfSource(savedFile)
        setPdfFile(savedFile)
        setPdfUrl(null)
      }
    }
  }, [savedState, savedFile])

  const handleStartFresh = useCallback(() => {
    setShowResumePrompt(false)
    clearState()
  }, [clearState])

  const handleFileSelect = useCallback((file: File) => {
    setError(null)
    resetChunks()
    setPdfSource(file)
    setPdfFile(file)
    setPdfUrl(null)
  }, [resetChunks])

  const handleUrlSubmit = useCallback((url: string) => {
    setError(null)
    resetChunks()
    setPdfUrl(url)
    setPdfSource(`/api/pdf-proxy?url=${encodeURIComponent(url)}`)
    setPdfFile(null)
  }, [resetChunks])

  const handleLoadSuccess = useCallback((pages: number) => {
    setNumPages(pages)
  }, [])

  const handleAllPagesRendered = useCallback(() => {
    extractChunks()
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight)
    }
    if (savedState && savedState.currentLineIndex > 0) {
      setTimeout(() => {
        setCurrentChunkIndex(savedState.currentLineIndex)
        const chunk = chunks[savedState.currentLineIndex]
        if (chunk) scrollToChunk(chunk)
      }, 100)
    }
  }, [extractChunks, containerRef, savedState, setCurrentChunkIndex, chunks, scrollToChunk])

  const handleError = useCallback((err: string) => {
    setError(err)
    setPdfSource(null)
    setPdfUrl(null)
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
      if (chunks.length === 0) return
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const clickY = e.clientY - rect.top + containerRef.current.scrollTop
      const clickX = e.clientX - rect.left

      let closestIndex = 0
      let closestDistance = Infinity

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkCenterY = chunk.y + chunk.height / 2
        const chunkCenterX = chunk.x + chunk.width / 2
        const distanceY = Math.abs(clickY - chunkCenterY)
        const distanceX = Math.abs(clickX - chunkCenterX)
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      }

      jumpToChunk(closestIndex)
    },
    [chunks, containerRef, jumpToChunk]
  )

  const currentPage =
    chunks.length > 0 && chunks[currentChunkIndex]
      ? chunks[currentChunkIndex].pageIndex + 1
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

  const isReady = chunks.length > 0

  return (
    <div className="relative">
      <div onClick={isReady ? handleContainerClick : undefined} className={isReady ? 'cursor-pointer' : ''}>
        <PdfViewer
          ref={containerRef}
          source={pdfSource}
          onLoadSuccess={handleLoadSuccess}
          onAllPagesRendered={handleAllPagesRendered}
          onError={handleError}
        >
          {isReady && (
            <PacerOverlay
              chunks={chunks}
              currentChunkIndex={currentChunkIndex}
              containerHeight={containerHeight}
            />
          )}
        </PdfViewer>
      </div>

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90">
          <p className="text-zinc-500">Parsing PDF...</p>
        </div>
      )}

      {isReady && (
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
