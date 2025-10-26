'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function WorkLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <div className="absolute left-4 top-10">
        <Link
          href="/?tab=Work"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeftIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
        </Link>
      </div>
      <main>
        {children}
      </main>
    </>
  )
}
