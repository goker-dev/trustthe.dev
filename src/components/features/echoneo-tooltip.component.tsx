'use client'

import { useEffect, useState } from 'react'

export const EchoneoTooltip = () => {
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    text: string
  } | null>(null)

  useEffect(() => {
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      const tooltipText = target.getAttribute('data-tooltip')

      if (tooltipText) {
        const rect = target.getBoundingClientRect()
        setTooltip({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 40,
          text: tooltipText,
        })
      }
    }

    const handleMouseLeave = () => {
      setTooltip(null)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTooltip(null)
      }
    }

    const gridCells = document.querySelectorAll('[data-tooltip]')
    gridCells.forEach((cell) => {
      cell.addEventListener('mouseenter', handleMouseEnter)
      cell.addEventListener('mouseleave', handleMouseLeave)
      cell.addEventListener('focus', handleMouseEnter)
      cell.addEventListener('blur', handleMouseLeave)
    })

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      gridCells.forEach((cell) => {
        cell.removeEventListener('mouseenter', handleMouseEnter)
        cell.removeEventListener('mouseleave', handleMouseLeave)
        cell.removeEventListener('focus', handleMouseEnter)
        cell.removeEventListener('blur', handleMouseLeave)
      })
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (!tooltip) return null

  return (
    <div
      role="tooltip"
      className="text-foreground bg-background pointer-events-none fixed z-50 rounded-md px-3 py-2 text-sm shadow-lg"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
      {tooltip.text}
    </div>
  )
}
