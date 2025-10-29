"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { JamieTimelineModal } from "./jamie-timeline-modal"
import type { TimelineQuery } from "./query-timeline"

interface JamieHorizontalTimelineProps {
  queries: TimelineQuery[]
  startTime?: number
}

export function JamieHorizontalTimeline({ queries, startTime = Date.now() }: JamieHorizontalTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatTimestamp = (timestamp: number) => {
    const totalSeconds = Math.floor((timestamp - startTime) / 1000)
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateScale = (index: number) => {
    if (hoveredIndex === null) return 0.4
    const distance = Math.abs(index - hoveredIndex)
    return Math.max(1 - distance * 0.2, 0.4)
  }

  const handleItemClick = (queryIndex: number) => {
    setSelected(queryIndex)
    setIsModalOpen(true)
  }

  const selectedQuery = selected !== null ? queries[selected] : null

  if (queries.length === 0) return null

  const allMarkers = queries.flatMap((query, queryIdx) => {
    const markers: (number | null)[] = [queryIdx]
    if (queryIdx < queries.length - 1) {
      for (let i = 0; i < 4; i++) {
        markers.push(null)
      }
    }
    return markers
  });

  return (
    <>
      <div className="flex h-[500px] w-full items-center justify-center overflow-x-auto">
        <div className="flex flex-row gap-1">
          {/* Cards - commented out for now */}
           {queries.map((query, queryIdx) => {
            const firstResult = query.searches[0]?.results[0]
            const isSelected = selected === queryIdx

            return (
              <div key={`card-${queryIdx}`} className="flex flex-col items-center">
                <button
                  onClick={() => handleItemClick(queryIdx)}
                  className={`w-64 p-4 rounded-lg border transition-all mb-2 ${
                    isSelected
                      ? "bg-yellow-400/10 border-yellow-400/40"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {firstResult && (
                    <>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                        {firstResult.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {firstResult.snippet}
                      </p>
                    </>
                  )}
                </button>
              </div>
            )
          })} 

          {/* Markers - horizontal row */}
          {allMarkers.map((queryIdx, markerIdx) => {
            const isMain = queryIdx !== null
            const isSelected = isMain && selected === queryIdx

            return (
              <button
                key={`marker-${markerIdx}`}
                className="relative inline-flex items-end justify-center py-1"
                onMouseEnter={() => setHoveredIndex(markerIdx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => isMain && handleItemClick(queryIdx)}
                onTouchStart={() => setHoveredIndex(markerIdx)}
                onTouchEnd={() => setHoveredIndex(null)}
              >
                <motion.div
                  className={`h-10 w-[0.19rem] rounded-[4px] ${
                    isSelected
                      ? "bg-yellow-400"
                      : "bg-zinc-300 dark:bg-zinc-100"
                  }`}
                  animate={{
                    scaleY: calculateScale(markerIdx),
                  }}
                  initial={{ scaleY: 0.4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                {hoveredIndex === markerIdx && isMain && (
                  <motion.span
                    className={`absolute -top-0.5 left-2 text-[11px] ${
                      isSelected
                        ? "text-yellow-400"
                        : "bg-zinc-300 dark:bg-zinc-100"
                    }`}
                    initial={{ opacity: 0, filter: "blur(4px)", scale: 0.4 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                  >
                    {formatTimestamp(queries[queryIdx].firstSeenAt)}
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <JamieTimelineModal
        isOpen={isModalOpen}
        query={selectedQuery}
        onClose={() => setIsModalOpen(false)}
        allQueries={queries}
        currentIndex={selected || 0}
      />
    </>
  )
}
