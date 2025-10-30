'use client'

import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'
import { QueryTimeline, TimelineQuery, SearchData } from '@/components/query-timeline'
import { JamieHorizontalTimeline } from '@/components/jamie-horizontal-timeline'
import { useMediaPermission } from '@/hooks/useMediaPermission'
import { generateRandomName, generateRoomName } from '@/lib/nameGenerator'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense, useRef, useMemo, useEffect } from 'react'
import { LiveKitRoom, useDataChannel, useLocalParticipant, useTrackVolume } from '@livekit/components-react'
import NumberFlow from '@number-flow/react'

type TranscriptData = {
  correlation_id: string
  text: string
  is_final: boolean
  confidence?: number
  started_at_ms?: number
  last_word_at_ms?: number
}

const TRANSCRIPT_TOPIC = 'jamie.transcript';
const SEARCH_TOPIC = 'jamie.search'

const sampleTimelineQueries: TimelineQuery[] = [
  {
    query: "What is quantum entanglement?",
    firstSeenAt: Date.now() - 300000,
    searches: [
      {
        correlation_id: "q1-1",
        query: "What is quantum entanglement?",
        results: [
          {
            title: "Quantum Entanglement Explained - Stanford Physics",
            url: "https://physics.stanford.edu/quantum-entanglement",
            snippet: "Quantum entanglement is a physical phenomenon where pairs of particles interact in ways such that the quantum state of each particle cannot be described independently.",
            published_at: "2024-03-15"
          },
          {
            title: "Understanding Entanglement: The Spooky Action",
            url: "https://quantummagazine.org/entanglement-explained",
            snippet: "Einstein called it 'spooky action at a distance.' When two particles become entangled, measuring one instantly affects the other, regardless of distance.",
            published_at: "2024-02-20"
          },
          {
            title: "Quantum Mechanics: Entanglement Basics",
            url: "https://mit.edu/quantum/entanglement-101",
            snippet: "A fundamental property of quantum mechanics where particles share correlations that cannot be explained by classical physics.",
          }
        ]
      }
    ]
  },
  {
    query: "How does photosynthesis work?",
    firstSeenAt: Date.now() - 280000,
    searches: [
      {
        correlation_id: "q2-1",
        query: "How does photosynthesis work?",
        results: [
          {
            title: "Photosynthesis Process - Khan Academy",
            url: "https://khanacademy.org/biology/photosynthesis",
            snippet: "Plants convert light energy into chemical energy through photosynthesis. The process occurs in chloroplasts and involves light-dependent and light-independent reactions.",
            published_at: "2024-01-10"
          },
          {
            title: "The Complete Guide to Plant Photosynthesis",
            url: "https://nature.com/articles/photosynthesis-guide",
            snippet: "During photosynthesis, plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. This process sustains nearly all life on Earth.",
          },
          {
            title: "Chlorophyll and Light Absorption",
            url: "https://biology.edu/chlorophyll-light",
            snippet: "Chlorophyll absorbs red and blue light while reflecting green, which is why plants appear green to our eyes.",
            published_at: "2023-11-05"
          }
        ]
      }
    ]
  },
  {
    query: "What causes the northern lights?",
    firstSeenAt: Date.now() - 260000,
    searches: [
      {
        correlation_id: "q3-1",
        query: "What causes the northern lights?",
        results: [
          {
            title: "Aurora Borealis: The Science Behind Northern Lights",
            url: "https://nasa.gov/aurora-borealis-explained",
            snippet: "The northern lights occur when charged particles from the sun collide with gases in Earth's atmosphere, creating stunning light displays.",
            published_at: "2024-03-01"
          },
          {
            title: "Understanding Aurora Formation",
            url: "https://space.com/aurora-science",
            snippet: "Solar wind carries charged particles that interact with Earth's magnetic field, funneling them toward the poles where they create auroras.",
          }
        ]
      }
    ]
  },
  {
    query: "How do neural networks learn?",
    firstSeenAt: Date.now() - 240000,
    searches: [
      {
        correlation_id: "q4-1",
        query: "How do neural networks learn?",
        results: [
          {
            title: "Deep Learning Fundamentals - MIT",
            url: "https://mit.edu/deep-learning/neural-networks",
            snippet: "Neural networks learn through backpropagation, adjusting weights based on error gradients to minimize loss functions over many iterations.",
            published_at: "2024-02-28"
          },
          {
            title: "Training Neural Networks: A Comprehensive Guide",
            url: "https://deeplearning.ai/training-guide",
            snippet: "Networks learn by processing training data, comparing outputs to expected results, and updating internal parameters through gradient descent.",
          },
          {
            title: "Gradient Descent and Optimization",
            url: "https://arxiv.org/neural-optimization",
            snippet: "The optimization process involves calculating gradients and adjusting weights to find the minimum of the cost function.",
            published_at: "2024-01-15"
          },
          {
            title: "Backpropagation Algorithm Explained",
            url: "https://stanford.edu/cs231n/backprop",
            snippet: "Backpropagation efficiently computes gradients for all network parameters by applying the chain rule from output to input layers.",
          }
        ]
      }
    ]
  },
  {
    query: "What is CRISPR gene editing?",
    firstSeenAt: Date.now() - 220000,
    searches: [
      {
        correlation_id: "q5-1",
        query: "What is CRISPR gene editing?",
        results: [
          {
            title: "CRISPR-Cas9: Revolutionary Gene Editing Tool",
            url: "https://nature.com/crispr-explained",
            snippet: "CRISPR allows scientists to precisely edit DNA sequences. The Cas9 enzyme acts as molecular scissors, cutting DNA at specific locations.",
            published_at: "2024-03-10"
          },
          {
            title: "Gene Editing Technology Overview",
            url: "https://broadinstitute.org/crispr",
            snippet: "Discovered in bacteria as an immune system, CRISPR has been adapted as a powerful tool for genetic modification in various organisms.",
          }
        ]
      }
    ]
  },
  {
    query: "How does blockchain technology work?",
    firstSeenAt: Date.now() - 200000,
    searches: [
      {
        correlation_id: "q6-1",
        query: "How does blockchain technology work?",
        results: [
          {
            title: "Blockchain Basics - MIT Technology Review",
            url: "https://technologyreview.com/blockchain-guide",
            snippet: "A blockchain is a distributed ledger where transactions are recorded in blocks and linked cryptographically, creating an immutable chain.",
            published_at: "2024-02-15"
          },
          {
            title: "Understanding Distributed Ledgers",
            url: "https://blockchain.info/how-it-works",
            snippet: "Each block contains a cryptographic hash of the previous block, timestamp, and transaction data, making the chain tamper-resistant.",
          },
          {
            title: "Consensus Mechanisms in Blockchain",
            url: "https://ethereum.org/consensus",
            snippet: "Blockchains use consensus algorithms like Proof of Work or Proof of Stake to validate transactions without central authority.",
            published_at: "2024-01-20"
          }
        ]
      }
    ]
  },
  {
    query: "What is dark matter?",
    firstSeenAt: Date.now() - 180000,
    searches: [
      {
        correlation_id: "q7-1",
        query: "What is dark matter?",
        results: [
          {
            title: "Dark Matter Mystery - NASA Science",
            url: "https://nasa.gov/dark-matter-explained",
            snippet: "Dark matter is invisible matter that makes up about 27% of the universe. We can't see it directly but know it exists through its gravitational effects.",
            published_at: "2024-03-05"
          },
          {
            title: "The Search for Dark Matter",
            url: "https://cern.ch/dark-matter-research",
            snippet: "Scientists are using particle accelerators and deep underground detectors to search for dark matter particles called WIMPs.",
          }
        ]
      }
    ]
  },
  {
    query: "How do vaccines train the immune system?",
    firstSeenAt: Date.now() - 160000,
    searches: [
      {
        correlation_id: "q8-1",
        query: "How do vaccines train the immune system?",
        results: [
          {
            title: "Vaccine Immunology - CDC",
            url: "https://cdc.gov/vaccine-immunology",
            snippet: "Vaccines introduce weakened or inactive pathogens to trigger immune response without causing disease, creating memory cells for future protection.",
            published_at: "2024-02-01"
          },
          {
            title: "mRNA Vaccine Technology",
            url: "https://nih.gov/mrna-vaccines",
            snippet: "mRNA vaccines teach cells to produce a protein that triggers an immune response, offering a new approach to vaccination.",
            published_at: "2024-01-25"
          },
          {
            title: "Adaptive Immunity and Vaccination",
            url: "https://immunology.org/vaccination-guide",
            snippet: "The adaptive immune system learns to recognize specific pathogens through B and T cell activation, providing long-term immunity.",
          }
        ]
      }
    ]
  },
  {
    query: "What causes ocean tides?",
    firstSeenAt: Date.now() - 140000,
    searches: [
      {
        correlation_id: "q9-1",
        query: "What causes ocean tides?",
        results: [
          {
            title: "Tidal Forces - NOAA Ocean Service",
            url: "https://noaa.gov/tides-explained",
            snippet: "Ocean tides are caused by gravitational forces from the Moon and Sun. The Moon's gravity pulls ocean water, creating high and low tides.",
            published_at: "2024-02-10"
          },
          {
            title: "Understanding Tidal Patterns",
            url: "https://oceanservice.noaa.gov/tidal-patterns",
            snippet: "Most coastal areas experience two high tides and two low tides per day due to Earth's rotation and the Moon's orbit.",
          }
        ]
      }
    ]
  },
  {
    query: "How does Bitcoin mining work?",
    firstSeenAt: Date.now() - 120000,
    searches: [
      {
        correlation_id: "q10-1",
        query: "How does Bitcoin mining work?",
        results: [
          {
            title: "Bitcoin Mining Explained - Blockchain.com",
            url: "https://blockchain.com/mining-guide",
            snippet: "Miners solve complex mathematical puzzles to validate transactions and add new blocks to the blockchain, earning Bitcoin rewards.",
            published_at: "2024-03-01"
          },
          {
            title: "Proof of Work and Mining",
            url: "https://bitcoin.org/how-mining-works",
            snippet: "Mining requires massive computational power to find a hash that meets specific criteria, securing the network through energy expenditure.",
          },
          {
            title: "Mining Economics and Energy Usage",
            url: "https://cambridge.org/bitcoin-energy",
            snippet: "Bitcoin mining consumes significant electricity, leading to debates about sustainability and the future of proof-of-work systems.",
            published_at: "2024-02-20"
          }
        ]
      }
    ]
  },
  {
    query: "What is string theory?",
    firstSeenAt: Date.now() - 100000,
    searches: [
      {
        correlation_id: "q11-1",
        query: "What is string theory?",
        results: [
          {
            title: "String Theory Basics - Caltech",
            url: "https://caltech.edu/string-theory-intro",
            snippet: "String theory proposes that fundamental particles are actually tiny vibrating strings of energy. Different vibration patterns create different particles.",
            published_at: "2024-01-30"
          },
          {
            title: "Extra Dimensions in String Theory",
            url: "https://cern.ch/string-theory-dimensions",
            snippet: "The theory requires 10 or 11 dimensions to be mathematically consistent, with extra dimensions curled up at microscopic scales.",
          }
        ]
      }
    ]
  },
  {
    query: "How do starfish regenerate limbs?",
    firstSeenAt: Date.now() - 80000,
    searches: [
      {
        correlation_id: "q12-1",
        query: "How do starfish regenerate limbs?",
        results: [
          {
            title: "Starfish Regeneration - Marine Biology",
            url: "https://marinebio.org/starfish-regeneration",
            snippet: "Starfish can regrow lost arms through stem cell activation and tissue differentiation. Some species can regenerate entire bodies from a single arm.",
            published_at: "2024-02-05"
          },
          {
            title: "Cellular Mechanisms of Regeneration",
            url: "https://science.org/regeneration-research",
            snippet: "The process involves wound healing, cell proliferation, and differentiation guided by specific genetic pathways.",
          }
        ]
      }
    ]
  }
];

function LandingPage() {
  const { hasPermission, isChecking, error, requestPermission } = useMediaPermission()
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room'
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
          <div className="absolute bg-slate-50 inset-0 rounded-full ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 dark:bg-zinc-900" />
          <Orb
            key="landing-orb"
            className='h-[400px] w-[400px]'
            colors={["#FF6B6B", "#4ECDC4"]}
            seed={12345}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          {!hasPermission ? (
            <Button
              className='min-w-28 rounded-xl'
              variant="outline"
              onClick={requestPermission}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Enable Mic'}
            </Button>
          ) : (
            <Button
              className='min-w-28 rounded-xl'
              variant="outline"
              onClick={handleStart}
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Start'}
            </Button>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
          {joinError && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {joinError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function RoomContent() {
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([])
  const [searches, setSearches] = useState<SearchData[]>([])
  const [selectedQuery, setSelectedQuery] = useState<TimelineQuery | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  // const { microphoneTrack } = useLocalParticipant()

  // const volume = useTrackVolume(microphoneTrack?.audioTrack)
  // const volumeRef = useRef(0)
  // volumeRef.current = volume

  // const transcriptDecoder = new TextDecoder()
  // const searchDecoder = new TextDecoder()

  // useDataChannel(TRANSCRIPT_TOPIC, (msg) => {
  //   const text = transcriptDecoder.decode(msg.payload)
  //   const data: TranscriptData = JSON.parse(text)
  //   setTranscripts(prev => {
  //     const existing = prev.findIndex(t => t.correlation_id === data.correlation_id)
  //     if (existing >= 0) {
  //       const updated = [...prev]
  //       updated[existing] = data
  //       return updated
  //     }
  //     return [...prev, data]
  //   })
  // })

  // useDataChannel(SEARCH_TOPIC, (msg) => {
  //   const text = searchDecoder.decode(msg.payload)
  //   const data: SearchData = JSON.parse(text)
  //   setSearches(prev => [...prev, data])
  // })

  // const timelineQueries = useMemo(() => {
  //   const queryMap = new Map<string, TimelineQuery>()

  //   searches.forEach((search) => {
  //     const existing = queryMap.get(search.query)

  //     if (existing) {
  //       existing.searches.push(search)
  //     } else {
  //       queryMap.set(search.query, {
  //         query: search.query,
  //         firstSeenAt: Date.now(),
  //         searches: [search]
  //       })
  //     }
  //   })

  //   return Array.from(queryMap.values()).sort((a, b) => a.firstSeenAt - b.firstSeenAt)
  // }, [searches])

  const timelineQueries = sampleTimelineQueries;

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="-mt-62 relative flex w-full max-w-8xl flex-col items-center gap-8">
        {timelineQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="font-mono text-wrap text-xl text-zinc-600 dark:text-zinc-400 text-center max-w-md">
              Start talking..
              <br />
              <br />
              Jamie is listening and will provide live web searches.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full">
              <div className="ml-46">
                <JamieHorizontalTimeline queries={timelineQueries} />
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-4 mt-4">
              <div className="text-7xl font-bebas tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center">
                {Math.floor(seconds / 3600) > 0 && (
                  <>
                    <NumberFlow value={Math.floor(seconds / 3600)} />
                    <span>:</span>
                  </>
                )}
                <NumberFlow value={Math.floor((seconds % 3600) / 60)} format={{ minimumIntegerDigits: Math.floor(seconds / 3600) > 0 ? 2 : 1 }} />
                <span>:</span>
                <NumberFlow value={seconds % 60} format={{ minimumIntegerDigits: 2 }} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label={isPaused ? "Resume timer" : "Pause timer"}
                  onClick={() => setIsPaused(p => !p)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
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
                    setIsPaused(false)
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
          </>
        )}
      </div>
    </div>
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
  return <RoomContent />

  return <LandingPage />
}

export default function JamiePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <JamiePageContent />
    </Suspense>
  )
}
