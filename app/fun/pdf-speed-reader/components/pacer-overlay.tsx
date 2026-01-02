'use client'

import { motion } from 'motion/react'
import type { WordChunk } from '../lib/types'

type PacerOverlayProps = {
  chunks: WordChunk[]
  currentChunkIndex: number
  containerHeight: number
}

export function PacerOverlay({
  chunks,
  currentChunkIndex,
  containerHeight,
}: PacerOverlayProps) {
  const currentChunk = chunks[currentChunkIndex]

  if (!currentChunk || chunks.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute bg-amber-200/60 rounded-sm"
        animate={{
          x: currentChunk.x,
          y: currentChunk.y,
          width: currentChunk.width + 8,
          height: Math.max(currentChunk.height, 12),
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
        }}
        style={{
          marginLeft: -4,
          boxShadow: '0 0 0 2px rgb(251 191 36)',
        }}
      />

      <motion.div
        className="absolute left-0 right-0 bg-white/60"
        animate={{
          y: currentChunk.y + currentChunk.height + 4,
          height: Math.max(containerHeight - currentChunk.y - currentChunk.height, 0),
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
      />
    </div>
  )
}
