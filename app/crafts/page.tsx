'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/?tab=Work')
  }, [router])

  return null
}
