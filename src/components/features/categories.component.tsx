import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function Categories({
  categories,
  className,
}: {
  categories?: { id?: string; slug?: string; title?: string }[]
  className?: string
}) {
  return (
    <>
      {categories && categories?.length > 0 && (
        <div
          className={cn(
            'categories mt-2 flex flex-wrap gap-2 text-xs capitalize [&_a]:no-underline',
            className,
          )}
        >
          {categories.map((i) => (
            <Badge key={i.id} asChild>
              <Link
                href={`/${i.slug}`}
                aria-label={`View all posts in ${i.title}`}
              >
                {i.title}
              </Link>
            </Badge>
          ))}
        </div>
      )}
    </>
  )
}
