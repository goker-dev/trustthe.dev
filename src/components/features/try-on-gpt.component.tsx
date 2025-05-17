'use client'

import { Button } from '@/components/ui/button'
import { Check, ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function TryOnGptButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  const [promptUrl, setPromptUrl] = useState('')

  useEffect(() => {
    const url = window?.location?.href
    if (/\/echoneo\/[^\/]+\/prompt$/.test(url)) {
      setPromptUrl(url)
    }
  }, [])

  const handleClick = async () => {
    if (!promptUrl) return

    const message = `Please generate an image using the prompt:
        ${prompt}
        ${promptUrl}`
    try {
      // await navigator.clipboard.writeText(message)
      setCopied(true)
      window.open(`https://chatgpt.com/?prompt=${encodeURI(message)}`, '_blank')
    } catch (e) {
      console.error('Copy failed:', e)
    } finally {
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (!promptUrl) return null

  return (
    <div className="">
      <Button
        onClick={handleClick}
        className="rounded-2xl px-4 py-2 text-sm font-medium shadow-md"
        variant="default"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied & opening ChatGPT...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate with ChatGPT
          </>
        )}
      </Button>
    </div>
  )
}
