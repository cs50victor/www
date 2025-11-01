"use client"

import type React from "react"
import { motion } from "framer-motion"
import { XCircleIcon } from "lucide-react"
import { useState, useEffect } from "react"
import type { TimelineQuery } from "@/components/query-timeline"
import ReactMarkdown from "react-markdown"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface JamieTimelineModalProps {
  isOpen: boolean
  query: TimelineQuery | null
  onClose: () => void
  allQueries: TimelineQuery[]
  currentIndex: number
}

type SearchResult = {
  title: string
  url: string
  snippet: string
  published_at?: string
}

export function JamieTimelineModal({
  isOpen,
  query,
  onClose,
  allQueries,
  currentIndex
}: JamieTimelineModalProps) {
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const currentQuery = allQueries[currentIndex]

  useEffect(() => {
    setSelectedResultIndex(0)
  }, [currentIndex])

  if (!currentQuery) return null

  const allResults: SearchResult[] = currentQuery.searches.flatMap(search => search.results)
  const selectedResult = allResults[selectedResultIndex]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[70vw] max-w-[70vw] sm:max-w-[70vw] h-[80vh] p-0 gap-0 bg-red-900">
        <div className="relative w-full h-full rounded-sm bg-background shadow-2xl flex flex-col overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-4 z-20 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XCircleIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          </button>

          <div className="sticky z-10 bg-background/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-8 pt-12 pb-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="gap-1 flex items-center">
                <DialogTitle className="text-3xl text-center tracking-tighter font-serif text-zinc-900 dark:text-zinc-100">
                  {currentQuery.query}
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                  {allResults.length} result{allResults.length !== 1 ? 's' : ''}
                </DialogDescription>
              </DialogHeader>
            </motion.div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-y-auto">
              <div className="p-4 space-y-2">
                {allResults.map((result, index) => (
                  <motion.button
                    key={`${result.url}-${index}`}
                    onClick={() => setSelectedResultIndex(index)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                      selectedResultIndex === index
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="text-sm font-medium line-clamp-2 mb-1">
                      {result.title}
                    </div>
                    <div className="text-xs line-clamp-2 opacity-75">
                      {result.snippet}
                    </div>
                    {result.published_at && (
                      <div className="text-[11px] opacity-60 mt-1">
                        {result.published_at}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedResult ? (
                <>
                  <div className="px-6 pb-4 border-zinc-200 dark:border-zinc-800 overflow-y-scroll">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1 mt-3">
                      {selectedResult.title}
                    </h2>
                    <a
                      href={selectedResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 dark:text-zinc-500 hover:underline truncate block"
                    >
                      {selectedResult.url}
                    </a>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      <ReactMarkdown>{selectedResult.snippet}</ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                  No result selected
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
