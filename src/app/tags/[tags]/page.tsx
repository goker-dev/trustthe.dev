import {
  NoteDtoReadable,
  notesControllerFindAllByTags,
  notesControllerGetTagCloud,
  TagCloudDto,
} from '@/api/kodkafa'
import { NoteCard } from '@/components/features/note-card.component'
import { metadataGenerator } from '@/lib/seo/metadata.generator'
import { tagPrefix } from '@/lib/seo/url-slug.utils'

export const revalidate = 2592000

export async function generateStaticParams() {
  const tags = await notesControllerGetTagCloud({
    path: { domain: String(process.env.DOMAIN) },
  })
  const paths =
    tags.data?.map((tag: TagCloudDto) => {
      return {
        params: { tags: tag.name },
      }
    }) || []
  return paths
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tags: string }>
}) {
  const { tags: _tags } = await params
  const tags = _tags

  return metadataGenerator(undefined, {
    title: `gokerArt - ${tags}`,
    description: `gokerArt - ${tags}`,
    ogType: 'website',
  })
}
export default async function Page({
  params,
}: {
  params: Promise<{ tags: string }>
}) {
  const { tags: _tags } = await params
  const tags = _tags

  const { data } = await notesControllerFindAllByTags({
    path: { tags, domain: String(process.env.DOMAIN) },
    query: {
      status: 'published',
      type: 'content',
      limit: 28,
    },
  })

  return (
    <>
      <div className="3xl:columns-5 mt-4 columns-1 gap-8 space-y-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {data?.list.map((i: NoteDtoReadable) => (
          <NoteCard
            key={`post-${i.slug}`}
            {...i}
            prefix={tagPrefix(i.tags, i.categories)}
          />
        ))}
      </div>
    </>
  )
}
