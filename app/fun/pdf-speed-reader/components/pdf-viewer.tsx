'use client'

import { useState, useCallback, forwardRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type PdfViewerProps = {
  source: File | string
  onLoadSuccess: (numPages: number) => void
  onAllPagesRendered: () => void
  onError: (error: string) => void
  children?: React.ReactNode
}

export const PdfViewer = forwardRef<HTMLDivElement, PdfViewerProps>(
  function PdfViewer(
    { source, onLoadSuccess, onAllPagesRendered, onError, children },
    ref
  ) {
    const [numPages, setNumPages] = useState(0)
    const [renderedPages, setRenderedPages] = useState<Set<number>>(() => new Set())
    const [pageWidth, setPageWidth] = useState(800)

    useEffect(() => {
      const updateWidth = () => {
        setPageWidth(Math.min(window.innerWidth - 40, 800))
      }
      updateWidth()
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }, [])

    const handleLoadSuccess = useCallback(
      ({ numPages: pages }: { numPages: number }) => {
        setNumPages(pages)
        setRenderedPages(new Set())
        onLoadSuccess(pages)
      },
      [onLoadSuccess]
    )

    const handlePageRenderSuccess = useCallback(
      (pageIndex: number) => {
        setRenderedPages((prev) => {
          const next = new Set(prev)
          next.add(pageIndex)
          if (next.size === numPages && numPages > 0) {
            setTimeout(onAllPagesRendered, 100)
          }
          return next
        })
      },
      [numPages, onAllPagesRendered]
    )

    const handleLoadError = useCallback(() => {
      onError('Failed to load PDF. Make sure the file is valid.')
    }, [onError])

    return (
      <div
        ref={ref}
        className="relative h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden"
      >
        <Document
          file={source}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          className="flex flex-col items-center py-4"
          loading={
            <div className="flex h-64 items-center justify-center text-zinc-500">
              Loading PDF...
            </div>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={pageWidth}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              onRenderSuccess={() => handlePageRenderSuccess(i)}
              className="mb-2 shadow-none [&_.react-pdf__Page__canvas]:shadow-none"
            />
          ))}
        </Document>
        {children}
      </div>
    )
  }
)
