import { TagCloudDto } from '@/api/kodkafa'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'
import { useCallback, useMemo } from 'react'

const range = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const opacity = [60, 65, 70, 75, 85, 95, 0]

interface Props {
  prefix?: string
  className?: string
  tags: TagCloudDto[]
  limit?: number
  skipSizing?: boolean
}

const TagCloud: React.FC<Props> = ({
  tags,
  className = '',
  // limit = 10,
  skipSizing = false,
  prefix = '',
}) => {
  const [min, ratio] = useMemo(() => {
    const max = Object.values(tags).reduce((a, b) => Math.max(a, b.usage), 0)
    const min = Object.values(tags).reduce((a, b) => Math.min(a, b.usage), 0)
    return [min, range.length / (max - min)]
  }, [tags])

  const size = useCallback(
    (s: number) => ((ratio * (s - min)) >> 0) - 1,
    [ratio, min],
  )

  return (
    <div
      className={`flex flex-row flex-wrap place-content-center content-center items-center align-middle ${className}`}
    >
      {tags.map((i) => {
        const slug = String(i.name)
          .toLowerCase()
          .replace(' ', '-')
          .replace('/', '-')

        const to = i.name.replace(' ', '-').toLowerCase()
        const href = prefix ? `${prefix}/tags/${to}` : `/tags/${to}`

        return (
          <span
            key={slug}
            // to={`/@goker/tags/${slug}`}
            className={cn(
              'hover:underline',
              !skipSizing &&
                `mx-1 p-1 text-${range[size(i.usage)]} opacity-[.${opacity[size(i.usage)]}]`,
            )}
          >
            <Link href={href}>{i.name}</Link>
          </span>
        )
      })}
    </div>
  )
}

export default TagCloud
