import { useState } from 'react'

export function useMediaPermission() {
  const [hasPermission, setHasPermission] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkPermission = async () => {
    try {
      setIsChecking(true)
      setError(null)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Media devices not supported')
        setIsChecking(false)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())

      setHasPermission(true)
    } catch (err) {
      if (err instanceof Error) {
        const errName = err.name.toLowerCase()
        if (errName.includes('notallowederror') || errName.includes('permissiondeniederror')) {
          setError('Microphone permission denied')
        } else if (errName.includes('notfounderror')) {
          setError('No microphone found')
        } else {
          setError('Failed to access microphone')
        }
      }
      setHasPermission(false)
    } finally {
      setIsChecking(false)
    }
  }

  const requestPermission = async () => {
    await checkPermission()
  }

  return { hasPermission, isChecking, error, requestPermission }
}
