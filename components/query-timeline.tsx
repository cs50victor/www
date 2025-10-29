'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export type SearchData = {
  correlation_id: string
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
  firstSeenAt: number
  searches: SearchData[]
}

type QueryTimelineProps = {
  queries: TimelineQuery[]
  onSelectQuery?: (query: TimelineQuery) => void
}

export function QueryTimeline({ queries, onSelectQuery }: QueryTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  if (queries.length === 0) return null

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  const calculateScale = (index: number) => {
    if (hoveredIndex === null) return 0.4
    const distance = Math.abs(index - hoveredIndex)
    return Math.max(1 - distance * 0.2, 0.4)
  }

  const handleSelect = (index: number) => {
    setSelected(index)
    if (onSelectQuery) {
      onSelectQuery(queries[index])
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-8">
      <div className="flex flex-row items-center gap-2 overflow-x-auto px-4">
        {queries.map((query, i) => {
          const isSelected = selected === i
          const isHovered = hoveredIndex === i

          return (
            <button
              key={`${query.query}-${query.firstSeenAt}`}
              className="relative inline-flex shrink-0 flex-col items-center justify-center px-1"
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleSelect(i)}
              onTouchStart={() => handleMouseEnter(i)}
              onTouchEnd={handleMouseLeave}
            >
              <motion.div
                className={`h-10 w-1 rounded-[4px] ${
                  isSelected
                    ? 'bg-yellow-400'
                    : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
                animate={{
                  scale: calculateScale(i),
                }}
                initial={{ scale: 0.4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <motion.span
                className={`absolute top-12 whitespace-nowrap text-xs ${
                  isSelected
                    ? 'text-yellow-400'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{
                  opacity: isHovered ? 1 : 0.6,
                  scale: isHovered ? 1 : 0.9,
                }}
                transition={{ duration: 0.15 }}
              >
                {query.query}
              </motion.span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
