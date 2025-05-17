'use client'

import type { HTMLAttributes, ReactElement } from 'react'

type Props = HTMLAttributes<HTMLTimeElement> & {
  date: string
  className?: string
}

export default function DaysAgo({
  className = '',
  date = '',
  ...props
}: Props): ReactElement {
  const ms = Date.parse(date) || Date.now()
  const localDate = new Date(ms)
  const now = Date.now()
  const days = ((now - ms) / 86400000) >> 0

  return (
    <time
      {...props}
      className={`${className}`}
      title={localDate?.toISOString()}
      dateTime={date}
    >
      {days ? `${days} days ago` : 'today'}
    </time>
  )
}
