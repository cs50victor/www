'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ChromePreloader({
  children,
  enabled = false
}: {
  children: React.ReactNode
  enabled?: boolean
}) {
  const [showPreloader, setShowPreloader] = useState(enabled)

  useEffect(() => {
    if (!enabled) return
    const timer = setTimeout(() => {
      setShowPreloader(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [enabled])

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && <Preloader />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showPreloader ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  )
}

function Preloader() {
  const [dimension, setDimension] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, delay: 0.3 },
    },
  }

  return (
    <motion.div
      variants={{
        initial: { top: 0 },
        exit: {
          top: '-100vh',
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
        },
      }}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99] flex h-full w-full items-start justify-start pt-[20vh] pl-[10vw] bg-white dark:bg-zinc-950"
    >
      {dimension.width > 0 && (
        <>
          <motion.div
            variants={{
              initial: { opacity: 0, y: 20 },
              enter: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
            initial="initial"
            animate="enter"
            className="absolute z-10 flex flex-col items-start max-w-md px-8"
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAENJREFUeF7tzbEJACEQRNGBLeAasBCza2lLEGx0CxFGG9hBMDDxRy/72O9FMnIFapGylsu1fgoBdkXfUHLrQgdfrlJN1BdYBjQQm3UAAAAASUVORK5CYII="
              srcSet="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII= 2x"
              width="72"
              height="72"
              alt=""
              className="mb-8"
            />
            <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              This site can be reached
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">vic.so</span> is ready to connect.
            </p>
            <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500 font-mono">
              VIC_CONNECTION_ESTABLISHED
            </p>
          </motion.div>
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full">
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              className="fill-white dark:fill-zinc-950"
            />
          </svg>
        </>
      )}
    </motion.div>
  )
}
