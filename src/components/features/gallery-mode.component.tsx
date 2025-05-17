'use client'

import { NoteDtoReadable } from '@/api/kodkafa'
import { getImages } from '@/lib/image.utils'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface GalleryModeProps {
  note: NoteDtoReadable
  onClose: () => void
}

export function GalleryMode({ note: initialNote, onClose }: GalleryModeProps) {
  const [note, setNote] = useState(initialNote)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { cover } = getImages(note)

  const getPrevNextUrl = useCallback((url: string) => {
    const slug = url.split('-').slice(1)
    if (!slug) return { prevUrl: null, nextUrl: null }

    const [conceptIndex, styleIndex] = slug.map(Number)
    const totalMovements = 28 // 28x28 matrix

    // Calculate previous navigation
    let prevConceptIndex = conceptIndex
    let prevStyleIndex = styleIndex
    if (styleIndex > 0) {
      prevStyleIndex = styleIndex - 1
    } else {
      prevConceptIndex = (conceptIndex - 1 + totalMovements) % totalMovements
      prevStyleIndex = totalMovements - 1
    }

    // Calculate next navigation
    let nextConceptIndex = conceptIndex
    let nextStyleIndex = styleIndex
    if (styleIndex < totalMovements - 1) {
      nextStyleIndex = styleIndex + 1
    } else {
      nextConceptIndex = (conceptIndex + 1) % totalMovements
      nextStyleIndex = 0
    }

    const prevUrl = `/echoneo-${prevConceptIndex}-${prevStyleIndex}`
    const nextUrl = `/echoneo-${nextConceptIndex}-${nextStyleIndex}`
    return { prevUrl, nextUrl }
  }, [])

  const fetchNote = useCallback(
    async (url: string) => {
      try {
        setLoading(true)
        const slug = url.split('/').pop()
        if (!slug) return

        const response = await fetch(`/api/notes/${slug}`)
        if (!response.ok) throw new Error('Failed to fetch note')

        const data = await response.json()
        setNote(data)
        router.prefetch(url) // Prefetch the full page
      } catch (error) {
        console.error('Error fetching note:', error)
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const handleNext = useCallback(
    (slug: string) => {
      const { nextUrl } = getPrevNextUrl(slug)
      if (nextUrl) {
        fetchNote(nextUrl)
      }
    },
    [fetchNote, getPrevNextUrl],
  )

  const handlePrev = useCallback(
    (slug: string) => {
      const { prevUrl } = getPrevNextUrl(slug)
      if (prevUrl) {
        fetchNote(prevUrl)
      }
    },
    [fetchNote, getPrevNextUrl],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { prevUrl, nextUrl } = getPrevNextUrl(note.slug)
      if (e.key === 'ArrowLeft' && prevUrl) {
        fetchNote(prevUrl)
      } else if (e.key === 'ArrowRight' && nextUrl) {
        fetchNote(nextUrl)
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [fetchNote, getPrevNextUrl, onClose, note.slug],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <X className="h-8 w-8" />
      </button>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="relative aspect-4/3 w-full">
          <Image
            className={`rounded-lg object-contain transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
            src={cover.src}
            alt={note.title}
            width={1024}
            height={1024}
            priority
          />

          {/* Navigation Buttons */}
          <button
            onClick={() => handlePrev(note.slug)}
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={() => handleNext(note.slug)}
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h2 className="mb-2 text-2xl font-bold text-white">{note.title}</h2>
        </div>
      </div>
    </div>
  )
}
