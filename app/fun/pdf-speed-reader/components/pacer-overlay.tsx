'use client'

import { motion } from 'motion/react'
import type { LineData } from '../lib/types'

type PacerOverlayProps = {
  lines: LineData[]
  currentLineIndex: number
  containerHeight: number
}

export function PacerOverlay({
  lines,
  currentLineIndex,
  containerHeight,
}: PacerOverlayProps) {
  const currentLine = lines[currentLineIndex]

  if (!currentLine || lines.length === 0) {
    return null
  }

  const pacerY = currentLine.yPosition
  const lineHeight = currentLine.height

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute left-0 right-0 bg-amber-200/50"
        animate={{
          y: pacerY,
          height: Math.max(lineHeight, 20),
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
        }}
        style={{ borderTop: '2px solid rgb(251 191 36)' }}
      />

      <motion.div
        className="absolute left-0 right-0 bg-white/70"
        animate={{
          y: pacerY + lineHeight + 2,
          height: Math.max(containerHeight - pacerY - lineHeight, 0),
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
