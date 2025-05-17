// src/components/echoneo-grid.tsx

import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'
import { EchoneoTooltip } from './echoneo-tooltip.component'

// Ordered list of art movement names
const artMovements: string[] = [
  'Prehistoric Art',
  'Ancient Egyptian Art',
  'Ancient Greek Art',
  'Ancient Roman Art',
  'Early Christian & Byzantine Art',
  'Romanesque Art',
  'Gothic Art',
  'Renaissance',
  'Mannerism',
  'Baroque',
  'Rococo',
  'Neoclassicism',
  'Romanticism',
  'Realism',
  'Impressionism',
  'Post-Impressionism',
  'Fauvism',
  'Expressionism',
  'Cubism',
  'Futurism',
  'Dadaism',
  'Surrealism',
  'Abstract Expressionism',
  'Pop Art',
  'Minimalism',
  'Conceptual Art',
  'Postmodernism',
  'Contemporary Art',
]

const GRID_SIZE = artMovements.length
const RELEASE = [0, 3]

interface GridCellProps {
  rowIndex: number
  colIndex: number
  href: string
  tooltipText: string
}

const GridCell = ({ rowIndex, colIndex, href, tooltipText }: GridCellProps) => {
  return (
    <Link
      href={href}
      data-tooltip={tooltipText}
      aria-label={tooltipText}
      title={tooltipText}
      className={cn(
        'border-muted flex aspect-square items-center justify-center rounded-sm border',
        'bg-background text-muted-foreground transition-colors duration-150 ease-in-out',
        'hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground',
        'focus:ring-ring focus:z-10 focus:ring-1 focus:ring-offset-1 focus:outline-none',
        'h-3.5 w-3.5',
        RELEASE[0] > rowIndex ? 'bg-foreground' : '',
        RELEASE[0] === rowIndex && RELEASE[1] >= colIndex
          ? 'bg-foreground'
          : '',
      )}
    >
      <span className="sr-only">{tooltipText}</span>
    </Link>
  )
}

interface Props {
  className?: string
}

export const EchoneoGrid: React.FC<Props> = ({ className }) => {
  const getTooltipText = (rowIndex: number, colIndex: number): string => {
    if (rowIndex >= GRID_SIZE || colIndex >= GRID_SIZE) {
      return `Invalid Coordinates [${rowIndex}, ${colIndex}]`
    }

    const conceptMovementName = artMovements[rowIndex]
    const styleMovementName = artMovements[colIndex]

    if (colIndex === 0) {
      return `${conceptMovementName} concept depicted in ${artMovements[0]} style`
    }

    if (rowIndex === 0) {
      return `${artMovements[0]} concept depicted in ${styleMovementName} style`
    }

    return `${conceptMovementName} concept depicted in ${styleMovementName} style`
  }

  // Generate grid cell elements
  const gridCells = []
  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
    for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
      const href = `/echoneo/${rowIndex}-${colIndex}`
      const tooltipText = getTooltipText(rowIndex, colIndex)

      gridCells.push(
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          rowIndex={rowIndex}
          colIndex={colIndex}
          href={href}
          tooltipText={tooltipText}
        />,
      )
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'gap-0.1 grid grid-cols-[repeat(28,_minmax(0,_1fr))] p-1',
          'bg-muted rounded-md border',
          className,
        )}
        role="grid"
        aria-label="Echoneo Art Movement Combination Grid"
      >
        {gridCells}
      </div>
      <EchoneoTooltip />
    </div>
  )
}

EchoneoGrid.displayName = 'EchoneoGrid'
