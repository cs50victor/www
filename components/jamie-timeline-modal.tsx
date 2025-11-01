"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { type TimelineQuery, formatJamieTimestamp } from "@/components/jamie-horizontal-timeline"
import ReactMarkdown from "react-markdown"

interface JamieTimelineModalProps {
  isOpen: boolean
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
  onClose,
  allQueries,
  currentIndex
}: JamieTimelineModalProps) {
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(currentIndex)

  useEffect(() => {
    setActiveIndex(currentIndex)
  }, [currentIndex])

  useEffect(() => {
    setSelectedResultIndex(0)
  }, [activeIndex])

  const currentQuery = allQueries[activeIndex]
  if (!currentQuery) return null

  const allResults: SearchResult[] = currentQuery.searches.flatMap(search => search.results)
  const selectedResult = allResults[selectedResultIndex]

  const handleNextCard = () => {
    if (activeIndex + 1 < allQueries.length) {
      setActiveIndex(activeIndex + 1)
    }
  }

  const handlePrevCard = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 transition-colors -mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex flex-col m-2 -mt-18 h-[calc(100vh-35px)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-lg bg-background shadow-2xl flex flex-col overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </button>

              <div className="flex-1 flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 py-12">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-8 max-w-3xl mx-auto"
                >
                  <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-balance font-serif tracking-tighter">
                    {currentQuery.query}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {allResults.length} result{allResults.length !== 1 ? 's' : ''} at {formatJamieTimestamp(currentQuery.firstSeenAtInSeconds)}
                  </p>
                </motion.div>

                <div className="flex flex-1 overflow-hidden mb-8 max-w-6xl w-full mx-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
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
                      <div className="px-6 pb-4 border-zinc-200 dark:border-zinc-800 overflow-y-scroll">
                        <div className="text-center my-6">
                          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1 mt-3">
                            {selectedResult.title}
                          </h2>
                          <a
                            href={selectedResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-zinc-500 dark:text-zinc-500 hover:underline truncate block tracking-tighter"
                          >
                            {selectedResult.url}
                          </a>
                          
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          <ReactMarkdown>{selectedResult.snippet}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        No result selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={handlePrevCard}
                    disabled={activeIndex === 0}
                    className="text-sm px-4 rounded-lg bg-zinc-100 text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                    whileHover={{ scale: activeIndex === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: activeIndex === 0 ? 1 : 0.95 }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </motion.button>
                  <motion.button
                    onClick={handleNextCard}
                    disabled={activeIndex === allQueries.length - 1}
                    className="px-6 py-2 rounded-lg bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    whileHover={{ scale: activeIndex === allQueries.length - 1 ? 1 : 1.05 }}
                    whileTap={{ scale: activeIndex === allQueries.length - 1 ? 1 : 0.95 }}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
