'use client'

import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { JamieHorizontalTimeline, SearchPayload, TimelineQuery } from '@/components/jamie-horizontal-timeline'
import { useMediaPermission } from '@/hooks/useMediaPermission'
import { generateRandomName, generateRoomName } from '@/lib/nameGenerator'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense, useRef, useMemo, useEffect } from 'react'
import {
  LiveKitRoom,
  useDataChannel,
  useLocalParticipant,
} from '@livekit/components-react'
import NumberFlow from '@number-flow/react'
import { sampleSearchPayloads } from './demo-data'
import { JamieTimelineModal } from '@/components/jamie-timeline-modal'
import { differenceInSeconds } from 'date-fns'

const LOCAL_TESTING = process.env.NEXT_PUBLIC_IS_LOCAL

type TranscriptData = {
  text: string
  is_final: boolean
  confidence?: number
  started_at_ms?: number
  last_word_at_ms?: number
}

const TRANSCRIPT_TOPIC = 'jamie.transcript'
const SEARCH_TOPIC = 'jamie.search'

function LandingPage() {
  const { hasPermission, isChecking, error, requestPermission } =
    useMediaPermission()
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const router = useRouter()

  const handleStart = async () => {
    setIsJoining(true)
    setJoinError(null)
    try {
      const participantName = generateRandomName()
      const roomName = generateRoomName()

      const workerResponse = await fetch('/api/start-jamie-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName }),
      })

      if (!workerResponse.ok) {
        const data = await workerResponse.json()
        throw new Error(data.error || 'Server error, please contact me')
      }

      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      })

      if (!response.ok) {
        throw new Error('Failed to get token')
      }

      const { token } = await response.json()
      router.push(`/work/jamie?room=${roomName}&token=${token}`)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to join room'
      console.error('Failed to join room:', err)
      setJoinError(errorMessage)
      setIsJoining(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex flex-col items-center gap-8">
        <h1 className="-mt-62 font-serif text-2xl font-semibold tracking-tighter md:text-3xl">
          Jamie
        </h1>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-slate-50 ring-1 ring-zinc-200/50 dark:bg-zinc-900 dark:ring-zinc-800/50" />
          <Orb
            key="landing-orb"
            className="h-[400px] w-[400px]"
            colors={['#FF6B6B', '#4ECDC4']}
            seed={12345}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          {!hasPermission ? (
            <Button
              className="min-w-28 rounded-xl"
              variant="outline"
              onClick={requestPermission}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Enable Mic'}
            </Button>
          ) : (
            <Button
              className="min-w-28 rounded-xl"
              variant="outline"
              onClick={handleStart}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Start'}
            </Button>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {error}{' '}
              <a
                href="https://twitter.com/vicdotso"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                contact me
              </a>
            </p>
          )}
          {joinError && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {joinError}{' '}
              <a
                href="https://twitter.com/vicdotso"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                contact me
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function RoomContentCore({
  seconds,
  isPaused,
  timelineQueries,
  pauseTimeline,
  setSeconds,
  selected,
  setSelected,
  isModalOpen,
  setIsModalOpen,
}: {
  seconds: number
  isPaused: boolean
  timelineQueries: TimelineQuery[]
  pauseTimeline: (paused: boolean) => void
  setSeconds: React.Dispatch<React.SetStateAction<number>>
  selected: number | null
  setSelected: React.Dispatch<React.SetStateAction<number | null>>
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-8xl relative -mt-32 flex w-full flex-col items-center gap-8">
          {timelineQueries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <p className="max-w-md text-center font-mono text-xl text-wrap text-zinc-600 dark:text-zinc-400">
                Start talking..
                <br />
                <br />
                Jamie is listening and will provide live web searches.
              </p>
            </div>
          ) : (
            <JamieHorizontalTimeline
              queries={timelineQueries}
              selected={selected}
              setSelected={setSelected}
              setIsModalOpen={setIsModalOpen}
            />
          )}
          <div className="mt-4 flex w-full flex-col items-center gap-4">
            <div className="font-bebas flex items-center text-5xl tracking-tight text-zinc-900 dark:text-zinc-100">
              {Math.floor(seconds / 3600) > 0 && (
                <>
                  <NumberFlow value={Math.floor(seconds / 3600)} />
                  <span>:</span>
                </>
              )}
              <NumberFlow
                value={Math.floor((seconds % 3600) / 60)}
                format={{
                  minimumIntegerDigits: Math.floor(seconds / 3600) > 0 ? 2 : 1,
                }}
              />
              <span>:</span>
              <NumberFlow
                value={seconds % 60}
                format={{ minimumIntegerDigits: 2 }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
                onClick={() => pauseTimeline(!isPaused)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:hover:bg-zinc-300"
              >
                {isPaused ? (
                  <svg
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-current text-zinc-100 dark:text-zinc-900"
                  >
                    <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 10 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-current text-zinc-100 dark:text-zinc-900"
                  >
                    <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
                  </svg>
                )}
              </button>
              <button
                aria-label="Reset timer"
                onClick={() => {
                  setSeconds(0)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <JamieTimelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allQueries={timelineQueries}
        currentIndex={selected ?? 0}
      />
    </>
  )
}

function RoomContentDemo() {
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryMapRef = useRef(new Map<string, TimelineQuery>())

  const timelineQueries = useMemo(() => {
    sampleSearchPayloads.forEach((search, index) => {
      const existing = queryMapRef.current.get(search.query)

      if (existing) {
        existing.searches.push(search)
      } else {
        queryMapRef.current.set(search.query, {
          query: search.query,
          firstSeenAtInSeconds: index * 15,
          searches: [search],
        })
      }
    })

    return Array.from(queryMapRef.current.values()).sort((a, b) => a.firstSeenAtInSeconds - b.firstSeenAtInSeconds)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  const pauseTimeline = (paused: boolean) => {
    setIsPaused(paused)
  }

  return (
    <RoomContentCore
      seconds={seconds}
      setSeconds={setSeconds}
      isPaused={isPaused}
      timelineQueries={timelineQueries}
      pauseTimeline={pauseTimeline}
      selected={selected}
      setSelected={setSelected}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}
function RoomContent() {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([])
  const [searches, setSearches] = useState<SearchPayload[]>([])
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const roomStartTime = useRef(Date.now())
  const firstSeenAtMap = useRef(new Map<string, number>())
  const { localParticipant } = useLocalParticipant()

  const transcriptDecoder = new TextDecoder()
  const searchDecoder = new TextDecoder()

  useDataChannel(TRANSCRIPT_TOPIC, (msg) => {
    const text = transcriptDecoder.decode(msg.payload)
    const data: TranscriptData = JSON.parse(text)
    setTranscripts((prev) => [...prev, data])
  })

  useDataChannel(SEARCH_TOPIC, (msg) => {
    const text = searchDecoder.decode(msg.payload)
    const data: SearchPayload = JSON.parse(text)
    console.log('Received search payload:', { query: data.query, resultCount: data.results.length })
    setSearches((prev) => [...prev, data])
  })

  const timelineQueries = useMemo(() => {
    const queryMap = new Map<string, TimelineQuery>()

    searches.forEach((search) => {
      const existing = queryMap.get(search.query)

      if (existing) {
        existing.searches.push(search)
      } else {
        let firstSeenAt = firstSeenAtMap.current.get(search.query)

        if (firstSeenAt === undefined) {
          firstSeenAt = differenceInSeconds(Date.now(), roomStartTime.current)
          firstSeenAtMap.current.set(search.query, firstSeenAt)
          console.log(`Inserted ${search.query} at ${firstSeenAt} seconds`)
        }

        queryMap.set(search.query, {
          query: search.query,
          firstSeenAtInSeconds: firstSeenAt,
          searches: [search],
        })
      }
    })

    const result = Array.from(queryMap.values()).sort(
      (a, b) => a.firstSeenAtInSeconds - b.firstSeenAtInSeconds,
    )
    console.log('timelineQueries computed:', result.length, 'queries from', searches.length, 'searches')
    return result
  }, [searches])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const pauseTimeline = (paused: boolean) => {
    setIsPaused(paused)
    localParticipant?.setMicrophoneEnabled(!paused)
  }

  return (
    <RoomContentCore
      seconds={seconds}
      isPaused={isPaused}
      timelineQueries={timelineQueries}
      pauseTimeline={pauseTimeline}
      setSeconds={setSeconds}
      selected={selected}
      setSelected={setSelected}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    />
  )
}

function RoomPage({ room, token }: { room: string; token: string }) {
  const livekitUrl = process.env.NEXT_PUBLIC_JAMIE_LIVEKIT_URL!

  return (
    <div className="flex min-h-screen flex-col">
      <LiveKitRoom
        serverUrl={livekitUrl}
        token={token}
        connect={true}
        audio={true}
        video={false}
        className="h-full w-full"
      >
        <RoomContent />
      </LiveKitRoom>
    </div>
  )
}

function JamiePageContent() {
  const searchParams = useSearchParams()
  const room = searchParams.get('room')
  const token = searchParams.get('token')

  if (room && token) {
    return <RoomPage room={room} token={token} />
  }

  if (LOCAL_TESTING) {
    return <RoomContentDemo />
  }

  return <LandingPage />
}

export default function JamiePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <JamiePageContent />
    </Suspense>
  )
}
