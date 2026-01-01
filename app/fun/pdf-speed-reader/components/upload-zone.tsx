'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UploadIcon } from 'lucide-react'

type UploadZoneProps = {
  onFileSelect: (file: File) => void
  onUrlSubmit: (url: string) => void
}

export function UploadZone({ onFileSelect, onUrlSubmit }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type === 'application/pdf') {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleUrlSubmit = useCallback(() => {
    const trimmed = urlInput.trim()
    if (!trimmed) return

    try {
      const url = new URL(trimmed)
      if (!url.pathname.endsWith('.pdf')) {
        setUrlError('URL must point to a PDF file')
        return
      }
      setUrlError('')
      onUrlSubmit(trimmed)
    } catch {
      setUrlError('Invalid URL')
    }
  }, [urlInput, onUrlSubmit])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">PDF Speed Reader</h1>
        <p className="mt-2 text-zinc-500">
          Upload a PDF and read with a guided pacer at your preferred speed
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors',
          isDragging
            ? 'border-zinc-400 bg-zinc-100'
            : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'
        )}
      >
        <UploadIcon className="mb-4 h-10 w-10 text-zinc-400" />
        <p className="text-center text-zinc-600">
          Drop PDF here or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex w-full max-w-md flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Or paste a PDF URL..."
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value)
              setUrlError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUrlSubmit()
            }}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none transition-colors focus:border-zinc-400"
          />
          <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
            Load
          </Button>
        </div>
        {urlError && <p className="text-sm text-red-500">{urlError}</p>}
      </div>
    </div>
  )
}
