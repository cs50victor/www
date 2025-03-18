'use client'
import Link from 'next/link'
import { NAME } from '@/lib/constants'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between font-serif">
      <Link
        href="/"
        className="text-muted-background text-2xl font-extrabold tracking-tighter lowercase"
      >
        {NAME}
      </Link>
    </header>
  )
}
