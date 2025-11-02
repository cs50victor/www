"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

export type SearchPayload = {
  query: string
  results: Array<{
    title: string
    url: string
    snippet: string
    published_at?: string
  }>
  images?: Array<{
    imageUrl: string
    originUrl: string
    height: number
    width: number
  }>
}

export type TimelineQuery = {
  query: string
  firstSeenAtInSeconds: number
  searches: SearchPayload[]
}

export function formatJamieTimestamp(timestamp: number) {
  const totalSeconds = Math.max(0, timestamp)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0")
  const secs = totalSeconds % 60

  if (hrs > 0) {
    return `${hrs}:${mins}:${secs.toString().padStart(2, "0")}`
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`
}


interface JamieHorizontalTimelineProps {
  queries: TimelineQuery[]
  selected: number | null
  setSelected: React.Dispatch<React.SetStateAction<number | null>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function JamieHorizontalTimeline({ queries, selected, setSelected, setIsModalOpen }: JamieHorizontalTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  if (queries.length === 0) return null

  const HORIZONTAL_GUTTER = 200

  const handleItemClick = (index: number) => {
    setSelected(index)
    setIsModalOpen(true)
    const card = cardRefs.current[index]
    if (card && scrollContainerRef.current) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  const maxTime = queries.length > 0 ? queries[queries.length - 1].firstSeenAtInSeconds : 0

  return (
    <div className="w-full space-y-8">
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: `${HORIZONTAL_GUTTER}px`, paddingRight: `${HORIZONTAL_GUTTER}px` }}
      >
        <div className="flex gap-6 min-w-max">
          {queries.map((query, index) => {
            const isSelected = selected === index
            const isHovered = hoveredIndex === index
            const resultCount = query.searches.flatMap(s => s.results).length

            return (
              <motion.div
                key={`${query.query}-${index}`}
                ref={(el) => { cardRefs.current[index] = el }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="relative shrink-0"
              >
                <button
                  onClick={() => handleItemClick(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="text-left group"
                >
                  <div className="relative h-64 w-80" style={{ perspective: '1000px' }}>
                    {[2, 1].map((offset) => (
                      <motion.div
                        key={offset}
                        className="absolute inset-0 rounded-2xl bg-linear-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg"
                        animate={{
                          y: isHovered ? offset * 6 : offset * 10,
                          x: isHovered ? offset * 3 : offset * 5,
                          rotate: isHovered ? offset * 1 : offset * 1.5,
                          scale: 1 - offset * 0.02,
                          opacity: 0.7 - offset * 0.15,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    ))}

                    <motion.div
                      className={`absolute inset-0 rounded-2xl border shadow-xl transition-all ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-600 text-white"
                          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                      }`}
                      animate={{
                        scale: isHovered ? 1.03 : 1,
                        rotateY: isHovered ? 3 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="h-full flex flex-col justify-between p-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-[10px] uppercase tracking-[0.14em] font-medium ${
                                isSelected ? "text-yellow-100" : "text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              Question
                            </span>
                            <span
                              className={`text-xs font-bebas tracking-wide ${
                                isSelected ? "text-yellow-100" : "text-zinc-600 dark:text-zinc-400"
                              }`}
                            >
                              {formatJamieTimestamp(query.firstSeenAtInSeconds)}
                            </span>
                          </div>

                          <h3 className={`text-center text-xl/6 font-semibold leading-tighter line-clamp-5 ${
                            isSelected ? "text-white" : "text-zinc-900 dark:text-zinc-100"
                          }`}>
                            {query.query}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span
                            className={`text-sm ${
                              isSelected ? "text-yellow-100" : "text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {resultCount} result{resultCount !== 1 ? 's' : ''}
                          </span>
                          <motion.div
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              isSelected
                                ? "bg-yellow-500 text-white"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            }`}
                            animate={{
                              scale: isHovered ? 1.05 : 1,
                            }}
                          >
                            View
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative w-full">
        <div 
          className="relative h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-12"
          style={{ marginLeft: `${HORIZONTAL_GUTTER}px`, marginRight: `${HORIZONTAL_GUTTER}px` }}
        >
          {queries.map((query, index) => {
            const position = queries.length === 1 ? 0 : (maxTime > 0 ? (query.firstSeenAtInSeconds / maxTime) * 100 : 0)
            const isSelected = selected === index
            const isHovered = hoveredIndex === index

            return (
              <motion.button
                key={`marker-${index}`}
                className="absolute top-1/2 -translate-y-1/2 group"
                style={{ left: `${position}%` }}
                onClick={() => handleItemClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.2 }}
              >
                <div className="relative">
                  <motion.div
                    className={`h-6 w-1 rounded-full transition-colors ${
                      isSelected
                        ? "bg-yellow-500"
                        : isHovered
                        ? "bg-zinc-600 dark:bg-zinc-300"
                        : "bg-zinc-400 dark:bg-zinc-600"
                    }`}
                    animate={{
                      height: isSelected ? 32 : isHovered ? 28 : 24,
                    }}
                  />
                  <div
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bebas tracking-wide px-2 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                  >
                    {formatJamieTimestamp(query.firstSeenAtInSeconds)}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
