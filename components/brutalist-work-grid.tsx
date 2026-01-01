'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

type Project = {
  name: string
  year: string
  description: string
  link: string
  bgClass: string
  fontVar: string
  fontSize: string
  tag?: string
  tagColor?: string
}

const PROJECTS: Project[] = [
  {
    name: 'pdf speed reader',
    year: '2025',
    description: 'Read PDFs faster with a guided pacer that moves through text at your preferred WPM.',
    link: '/fun/pdf-speed-reader',
    bgClass: 'bg-stone-100',
    fontVar: '--font-mona-sans',
    fontSize: 'text-lg',
    tag: 'Try it live',
    tagColor: '#57534e',
  },
  {
    name: 'jamie',
    year: '2025',
    description: 'Real-time AI that listens to your conversations and searches the web.',
    link: 'https://github.com/cs50victor/jamie',
    bgClass: 'bg-stone-100',
    fontVar: '--font-mona-sans',
    fontSize: 'text-lg',
    tag: 'GitHub',
    tagColor: '#57534e',
  },
  {
    name: 'kitt2',
    year: '2023',
    description: 'Multimodal AI with real-time 3D avatar rendering.',
    link: 'https://github.com/cs50victor/kitt2',
    bgClass: 'bg-stone-100',
    fontVar: '--font-mona-sans',
    fontSize: 'text-lg',
    tag: 'GitHub',
    tagColor: '#57534e',
  },
  {
    name: 'buildspace ai',
    year: '2024',
    description: 'AI discovery platform indexing 300+ builder profiles.',
    link: 'https://github.com/cs50victor/buildspace',
    bgClass: 'bg-stone-100',
    fontVar: '--font-mona-sans',
    fontSize: 'text-lg',
    tag: 'GitHub',
    tagColor: '#b45309',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function BrutalistWorkGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {PROJECTS.map((project) => {
        const isExternal = project.link.startsWith('http')
        const Wrapper = isExternal ? 'a' : Link

        return (
          <motion.div
            key={project.name}
            variants={cardVariants}
            className="group"
          >
            <Wrapper
              href={project.link}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`block h-full min-h-[340px] ${project.bgClass} p-6 rounded-xl transition-all duration-200 hover:bg-stone-200/50 flex flex-col`}
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className={`font-[family-name:var(${project.fontVar})] ${project.fontSize} text-zinc-900 tracking-tight`}>{project.name}</h3>
                  <p className="text-sm text-zinc-500">{project.year}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-zinc-500 group-hover:text-zinc-900 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              <div className="grow" />

              <p className="text-sm text-zinc-600 mb-2 leading-relaxed text-left">
                {project.description}
              </p>

              {project.tag && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 text-xs font-medium text-zinc-600">
                    {project.tag === 'Try it live' && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                        <polygon points="4,2 10,6 4,10" />
                      </svg>
                    )}
                    {project.tag === 'GitHub' && (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    )}
                    {project.tag}
                  </span>
                </div>
              )}
            </Wrapper>
          </motion.div>
        )
      })}
    </div>
  )
}
