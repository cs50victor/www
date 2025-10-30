"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { JamieTimelineModal } from "./jamie-timeline-modal"
import type { TimelineQuery } from "./query-timeline"

interface JamieHorizontalTimelineProps {
  queries: TimelineQuery[]
  startTime?: number
}

export function JamieHorizontalTimeline({ queries, startTime }: JamieHorizontalTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (queries.length === 0) return null

  const timelineItems = queries
    .map((query, originalIndex) => ({ query, originalIndex }))
    .sort((a, b) => a.query.firstSeenAt - b.query.firstSeenAt)

  const earliestSeenAt = timelineItems[0].query.firstSeenAt
  const latestSeenAt = timelineItems[timelineItems.length - 1].query.firstSeenAt
  const providedStart = typeof startTime === "number" ? startTime : earliestSeenAt
  const effectiveStart = Math.min(providedStart, earliestSeenAt)
  const timelineRange = Math.max(latestSeenAt - effectiveStart, 0)
  const secondsSpan = timelineRange > 0 ? timelineRange / 1000 : Math.max(timelineItems.length - 1, 1)
  const baseWidth = Math.max(timelineItems.length * 240, 960)
  const widthBasedOnTime = timelineRange > 0 ? secondsSpan * 80 : baseWidth
  const containerWidth = Math.min(Math.max(baseWidth, widthBasedOnTime), 20000)
  const CARD_WIDTH = 288 // matches w-72

  const formatTimestamp = (timestamp: number) => {
    const totalSeconds = Math.max(0, Math.floor((timestamp - effectiveStart) / 1000))
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const trackWidth = Math.max(containerWidth - CARD_WIDTH, 0)

  const positions = timelineItems.map((item, idx) => {
    if (timelineRange === 0) {
      if (timelineItems.length === 1) return trackWidth / 2
      return (trackWidth / (timelineItems.length - 1)) * idx
    }

    const ratio = (item.query.firstSeenAt - effectiveStart) / (timelineRange || 1)
    const raw = ratio * trackWidth
    return Math.min(Math.max(raw, 0), trackWidth)
  })

  const calculateScale = (sortedIndex: number) => {
    if (hoveredIndex === null) return 0.5
    const distance = Math.abs(sortedIndex - hoveredIndex)
    return Math.max(1 - distance * 0.25, 0.5)
  }

  const handleItemClick = (originalIndex: number, sortedIndex: number) => {
    setSelected(originalIndex)
    setHoveredIndex(sortedIndex)
    setIsModalOpen(true)
  }

  const selectedQuery = selected !== null ? queries[selected] : null

  return (
    <>
      <div className="relative flex h-[500px] w-full overflow-x-auto">
        <div
          className="relative h-full px-16 py-12"
          style={{ width: `${containerWidth}px`, minWidth: `${containerWidth}px` }}
        >
          <div className="absolute inset-x-12 bottom-20 h-px rounded-full bg-zinc-200 dark:bg-zinc-800" />

          {timelineItems.map((item, sortedIdx) => {
            const { query } = item
            const isSelected = selected === item.originalIndex
            const isHovered = hoveredIndex === sortedIdx
            const position = positions[sortedIdx]

            return (
              <div
                key={`${query.query}-${item.originalIndex}`}
                className="absolute top-0 flex h-full flex-col items-center"
                style={{ left: `${position}px` }}
              >
                <button
                  onClick={() => handleItemClick(item.originalIndex, sortedIdx)}
                  onMouseEnter={() => setHoveredIndex(sortedIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(sortedIdx)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  className={`w-72 rounded-2xl border px-6 py-5 text-left shadow-sm transition-all ${
                    isSelected
                      ? "border-yellow-400/60 bg-zinc-900 text-zinc-50 shadow-xl"
                      : "border-zinc-200 bg-white/95 text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-zinc-700"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                    Question
                  </span>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-inherit line-clamp-3">
                    {query.query}
                  </h3>
                </button>

                <div className="mt-6 flex flex-1 flex-col items-center">
                  <div
                    className={`h-20 w-px rounded-full transition-colors ${
                      isSelected ? "bg-yellow-400/60" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                  <button
                    className="relative mt-3 flex h-16 w-10 items-end justify-center"
                    onMouseEnter={() => setHoveredIndex(sortedIdx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onTouchStart={() => setHoveredIndex(sortedIdx)}
                    onTouchEnd={() => setHoveredIndex(null)}
                    onClick={() => handleItemClick(item.originalIndex, sortedIdx)}
                  >
                    <motion.div
                      className={`w-[0.22rem] rounded-full ${
                        isSelected ? "bg-yellow-400" : "bg-zinc-300 dark:bg-zinc-100"
                      }`}
                      animate={{ scaleY: calculateScale(sortedIdx) }}
                      initial={{ scaleY: 0.5 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      style={{ height: "2.75rem" }}
                    />
                    {(isHovered || isSelected) && (
                      <motion.span
                        className="absolute top-full mt-2 whitespace-nowrap text-[11px] font-bebas tracking-wide text-zinc-900 dark:text-zinc-100"
                        initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {formatTimestamp(query.firstSeenAt)}
                      </motion.span>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <JamieTimelineModal
        isOpen={isModalOpen}
        query={selectedQuery}
        onClose={() => setIsModalOpen(false)}
        allQueries={queries}
        currentIndex={selected ?? 0}
      />
    </>
  )
}
