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
  const CARD_WIDTH = 288 // matches tailwind w-72 (18rem)
  const HORIZONTAL_GUTTER = 80
  const MINOR_MARKER_SPACING = 8.5 // px target between filler ticks
  const baseWidth = Math.max(timelineItems.length * 240, CARD_WIDTH + HORIZONTAL_GUTTER * 2, 960)
  const widthBasedOnTime = timelineRange > 0 ? secondsSpan * 80 : baseWidth
  const containerWidth = Math.min(Math.max(baseWidth, widthBasedOnTime), 20000)

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

  const trackWidth = Math.max(containerWidth - CARD_WIDTH - HORIZONTAL_GUTTER * 2, 0)
  const startCenter = HORIZONTAL_GUTTER + CARD_WIDTH / 2

  const positions = timelineItems.map((item, idx) => {
    if (timelineRange === 0) {
      if (timelineItems.length === 1) return startCenter
      return startCenter + (trackWidth / (timelineItems.length - 1)) * idx
    }

    const ratio = (item.query.firstSeenAt - effectiveStart) / (timelineRange || 1)
    const clampedRatio = Math.min(Math.max(ratio, 0), 1)
    return startCenter + clampedRatio * trackWidth
  })

  const minorMarkerPositions = timelineItems.flatMap((_, idx) => {
    if (idx >= timelineItems.length - 1) return []
    const current = positions[idx]
    const next = positions[idx + 1]
    if (!Number.isFinite(current) || !Number.isFinite(next) || next <= current) return []

    const segmentWidth = next - current
    if (segmentWidth <= 40) return []

    const markerCount = Math.max(1, Math.floor(segmentWidth / MINOR_MARKER_SPACING))
    const step = segmentWidth / (markerCount + 1)
    return Array.from({ length: markerCount }, (_, markerIdx) => current + step * (markerIdx + 1))
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
      <div className="relative flex h-[450px] w-full overflow-x-scroll py-12 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden">
        <div
          className="relative h-full"
          style={{ width: `${containerWidth}px`, minWidth: `${containerWidth}px` }}
        >
          {minorMarkerPositions.map((position, idx) => (
            <div
              key={`minor-marker-${idx}`}
              className="pointer-events-none absolute bottom-0 h-11 w-px rounded-full bg-zinc-400/80 dark:bg-zinc-700/80"
              style={{ left: `${position - 0.5}px` }}
              aria-hidden={true}
            />
          ))}

          {timelineItems.map((item, sortedIdx) => {
            const { query } = item
            const isSelected = selected === item.originalIndex
            const isHovered = hoveredIndex === sortedIdx
            const position = positions[sortedIdx]

            return (
              <div
                key={`${query.query}-${item.originalIndex}`}
                className="absolute top-0 flex h-full flex-col items-center"
                style={{ left: `${position - CARD_WIDTH / 2}px` }}
              >
                <button
                  onClick={() => handleItemClick(item.originalIndex, sortedIdx)}
                  onMouseEnter={() => setHoveredIndex(sortedIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(sortedIdx)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  className={`w-72 rounded-2xl border px-6 py-5 text-left shadow-sm transition-all ${
                    isSelected
                      ? "border-yellow-500 bg-yellow-700 text-zinc-50 shadow-xl"
                      : "border-zinc-200 bg-white/95 text-zinc-900 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-zinc-700"
                  }`}
                >
                  <span
                    className={`text-[11px] uppercase tracking-[0.14em] ${
                      isSelected ? "text-white" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    Question
                  </span>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-inherit line-clamp-3">
                    {query.query}
                  </h3>
                </button>

                <div className="mt-6 flex flex-1 flex-col items-center gap-4">
                  <div
                    className={`flex-1 w-px rounded-full transition-colors ${
                      isSelected ? "bg-yellow-400/60" : "bg-zinc-400 dark:bg-zinc-700"
                    }`}
                  />
                  <button
                    className="relative flex w-8 items-end justify-center"
                    onMouseEnter={() => setHoveredIndex(sortedIdx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onTouchStart={() => setHoveredIndex(sortedIdx)}
                    onTouchEnd={() => setHoveredIndex(null)}
                    onClick={() => handleItemClick(item.originalIndex, sortedIdx)}
                  >
                    <motion.div
                      className={`w-[0.18rem] rounded-full ${
                        isSelected ? "bg-yellow-400" : "bg-zinc-400 dark:bg-zinc-100"
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
