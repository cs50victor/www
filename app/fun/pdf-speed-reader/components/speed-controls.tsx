'use client'

import { PlayIcon, PauseIcon, SquareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SpeedControlsProps = {
  isPlaying: boolean
  wpm: number
  currentPage: number
  totalPages: number
  onPlayPause: () => void
  onStop: () => void
  onWpmChange: (wpm: number) => void
}

export function SpeedControls({
  isPlaying,
  wpm,
  currentPage,
  totalPages,
  onPlayPause,
  onStop,
  onWpmChange,
}: SpeedControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-md items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
              isPlaying
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
            )}
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 pl-0.5" />
            )}
          </button>

          <button
            onClick={onStop}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <SquareIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm text-zinc-500">WPM</span>
          <input
            type="range"
            min={100}
            max={600}
            step={25}
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
          />
          <span className="w-10 text-right text-sm font-medium tabular-nums">
            {wpm}
          </span>
        </div>

        <div className="text-sm text-zinc-500">
          Page {currentPage}/{totalPages}
        </div>
      </div>
    </div>
  )
}
