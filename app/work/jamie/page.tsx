'use client'

import { Button } from '@/components/ui/button'
import { Orb } from '@/components/ui/orb'

export default function JamiePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative flex flex-col items-center gap-8">
        <h1 className="-mt-62 font-serif text-2xl font-semibold tracking-tighter md:text-3xl">
          Jamie
        </h1>
        <div className="relative">
          <div className="absolute bg-slate-50 inset-0 rounded-full ring-1 ring-zinc-200/50 dark:ring-zinc-800/50" />
          <Orb 
            className='h-[400px] w-[400px]'
            colors={["#FF6B6B", "#4ECDC4"]}
            seed={12345}
          />
        </div>
        <Button 
          className='min-w-28 rounded-xl'
          variant="outline"
        >
          Start
        </Button>
      </div>
    </div>
  )
}
