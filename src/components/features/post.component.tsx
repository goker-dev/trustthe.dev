import { NoteDtoReadable } from '@/api/kodkafa'
import DaysAgo from '@/components/common/days-ago.component'
import { Markdown } from '@/components/common/markdown.component'
import { Author } from '@/components/features/author.component'
import { Categories } from '@/components/features/categories.component'
import { LazyMediaGallery } from '@/components/features/lazy-media-gallery.component'
import { PromptNavigation } from '@/components/features/prompt-navigation.component'
import { ShareButtons } from '@/components/features/share-buttons.component'
import { Tags } from '@/components/features/tags.component'
import { discordChannels } from '@/lib/arts'
import { getDescription, getImages } from '@/lib/image.utils'
import { parseMarkdown } from '@/lib/markdown'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import readingTime from 'reading-time'
import { DiscordCta } from './discord-cta.component'
// import { GalleryModeWrapper } from "./gallery-mode-wrapper";
import { ArticleJsonLd } from './json-ld.component'

export async function Post({ note }: { note: NoteDtoReadable }) {
  if (!note?.slug) notFound()

  const isEchoneo = note.categories?.map((i) => i.slug).includes('echoneo')

  const { cover, images } = getImages(note)
  const markdown = parseMarkdown(note?.markdown || '')
  const author = 'goker'
  const stats = readingTime(String(markdown?.toString()))
  const publishedAt =
    note.updatedAt > note.createdAt ? note.updatedAt : note.createdAt
  const description = getDescription(note?.markdown || '')

  const coverRatio = isEchoneo ? '4/3' : '16/9'
  const { width, height } = {
    '18/6': { width: 1800, height: 600 },
    '16/9': { width: 1600, height: 900 },
    '4/3': { width: 1600, height: 1200 },
  }[coverRatio] || { width: 1800, height: 600 }

  const isPlaceholder = cover.src.includes('goker-bg')

  // Calculate previous and next URLs based on the note's slug
  const [slug, ...post] = note?.slug?.split('-') || []
  const [conceptIndex, styleIndex = 0] = post?.map(Number) || []
  const totalMovements = 28 // 28x28 matrix
  const forumChannelId = discordChannels[styleIndex]
  const discordChannelUrl = `https://discord.com/channels/1358816680758874273/${forumChannelId}`

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

  const prevUrl = `/${slug}/${prevConceptIndex}-${prevStyleIndex}`
  const nextUrl = `/${slug}/${nextConceptIndex}-${nextStyleIndex}`

  return (
    <>
      <article itemScope itemType="https://schema.org/Article" className="pb-8">
        <header>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl dark:text-gray-100">
            {note.title}
          </h1>
          <p className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <DaysAgo date={publishedAt} />
            <span aria-hidden="true">&middot;</span>
            <span>{stats.text}</span>
          </p>
          {!isPlaceholder && (
            <div className="relative">
              {/* {isEchoneo && (
                <GalleryModeWrapper
                  note={note}
                />
              )} */}
              <div
                className={cn(
                  'mb-8 w-full overflow-hidden rounded-lg border border-white/10',
                  `aspect-[${coverRatio}]`,
                )}
              >
                <Image
                  className="h-full w-full object-cover"
                  src={cover.src}
                  alt={note.title}
                  width={width}
                  height={height}
                  decoding="async"
                  priority
                />
              </div>
              {isEchoneo && (
                <PromptNavigation
                  prevHref={prevUrl}
                  nextHref={nextUrl}
                  className="inset-x-0 top-1/2 -translate-y-1/2 md:absolute"
                />
              )}
            </div>
          )}
        </header>

        <div className="flex w-full items-center justify-between">
          {isEchoneo && (
            <DiscordCta
              discordChannelUrl={discordChannelUrl}
              artworkCoordinates={`${conceptIndex}-${styleIndex}`}
            />
          )}
          <ShareButtons
            url={`https://${process.env.DOMAIN}/${note.slug}`}
            title={note.title}
            description={description}
            image={cover.src}
            className="flex-wrap"
          />
        </div>

        <Markdown content={markdown} />

        {!!images?.length && images?.length > 1 && (
          <LazyMediaGallery images={images} title={note.title} />
        )}

        {isEchoneo && (
          <DiscordCta
            discordChannelUrl={discordChannelUrl}
            artworkCoordinates={`${conceptIndex}-${styleIndex}`}
            detailed
          />
        )}

        <footer className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Author slug={author} note={note} />
              <Tags tags={note.tags} className="mt-4" />
              <Categories categories={note.categories} className="mt-4" />
            </div>
          </div>
        </footer>
        <ArticleJsonLd data={note} />
      </article>
    </>
  )
}
