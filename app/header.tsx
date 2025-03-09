'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { NAME, PROFESSION } from '@/lib/constants'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="font-semibold lowercase text-2xl tracking-tighter text-muted-background">
          {NAME}
        </Link>
        <div className='text-sm opacity-70 ml-1'>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            delay={0.5}
          >
            {`${PROFESSION}`}
          </TextEffect>
        </div>
      </div>
    </header>
  )
}
