"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, XCircle, XCircleIcon } from "lucide-react"
import { useState, useEffect } from "react"
import type { TimelineQuery } from "@/components/query-timeline"

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
    <AnimatePresence>
      {isOpen && (
        <div className="prose">
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex flex-col m-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-lg bg-background shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onClose}
                className="absolute  top-2 right-4 z-20 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <XCircleIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              </button>

              <div className="sticky z-10 bg-background/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-8 pt-12">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-3xl tracking-tighter font-serif text-zinc-900 dark:text-zinc-100">
                    {currentQuery.query}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {allResults.length} result{allResults.length !== 1 ? 's' : ''}
                  </p>
                </motion.div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/*<div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-y-auto">*/}
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
                      <div className="px-6 pb-4 border-zinc-200 dark:border-zinc-800">
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
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          {selectedResult.snippet}
                        </p>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
