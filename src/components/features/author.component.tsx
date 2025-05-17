import { NoteDtoReadable, notesControllerFindOneBySlug } from '@/api/kodkafa'
import DaysAgo from '@/components/common/days-ago.component'
import { getImages } from '@/lib/image.utils'
import Image from 'next/image'
import Link from 'next/link'

export async function Author({
  slug,
  note,
}: {
  slug: string
  note: Partial<NoteDtoReadable>
}) {
  const { data } = await notesControllerFindOneBySlug({
    path: { slug, domain: String(process.env.DOMAIN) },
  })

  if (!data) return <>NOT FOUND</>
  const { cover } = getImages(data)

  const authorHref = `/about`
  const authorTitle = data?.title || 'THE DEV'

  const publishedAt =
    ((note?.updatedAt || 0) > (note?.createdAt || 0)
      ? note?.updatedAt
      : note?.createdAt) || ''

  return (
    <div
      className="author mt-6 flex w-full items-center gap-3"
      data-author={authorTitle}
      data-role="creator"
      aria-label={`Author block: Created by ${authorTitle}`}
    >
      <Link href={authorHref} aria-label={`Visit profile of ${authorTitle}`}>
        <Image
          className="h-10 w-10 rounded-full object-cover"
          src={cover.src}
          alt={cover.altText || authorTitle}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="grow">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
          <Link href={authorHref} className="hover:underline">
            Created by <strong className="tracking-wide">{authorTitle}</strong>
          </Link>
        </p>
        <div className="text-sm text-gray-500">
          <DaysAgo date={publishedAt} />
        </div>
      </div>
    </div>
  )
}
