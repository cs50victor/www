'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PersistenceData } from '../lib/types'

const STORAGE_KEY = 'pdf-speed-reader-state'
const DB_NAME = 'pdf-speed-reader'
const STORE_NAME = 'files'

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

async function saveFileToIDB(file: File): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put(file, 'current-file')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function getFileFromIDB(): Promise<File | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get('current-file')
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

async function clearFileFromIDB(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete('current-file')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function usePersistence() {
  const [savedState, setSavedState] = useState<PersistenceData | null>(null)
  const [savedFile, setSavedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSavedState() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored) as PersistenceData
          setSavedState(data)

          if (!data.pdfUrl) {
            const file = await getFileFromIDB()
            setSavedFile(file)
          }
        }
      } catch {
        // ignore errors
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedState()
  }, [])

  const saveState = useCallback(
    async (data: Omit<PersistenceData, 'timestamp'>, file?: File) => {
      const toSave: PersistenceData = {
        ...data,
        timestamp: Date.now(),
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
      setSavedState(toSave)

      if (file) {
        await saveFileToIDB(file)
        setSavedFile(file)
      }
    },
    []
  )

  const clearState = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY)
    await clearFileFromIDB()
    setSavedState(null)
    setSavedFile(null)
  }, [])

  return {
    savedState,
    savedFile,
    isLoading,
    saveState,
    clearState,
  }
}
