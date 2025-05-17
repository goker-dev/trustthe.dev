import {
  NoteDtoReadable,
  notesControllerFindAllByCategory,
} from '@/api/kodkafa'
import { Markdown } from '@/components/common/markdown.component'
import { NoteCard } from '@/components/features/note-card.component'
import { coverRatios } from '@/config/navigation'
import { parseMarkdown } from '@/lib/markdown'
import { asPrefix } from '@/lib/seo/url-slug.utils'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'

import { CollectionPageJsonLd } from './json-ld.component'

export async function Category({ note }: { note: NoteDtoReadable }) {
  if (!note?.slug) notFound()

  // const { cover } = getImages(note)
  const markdown = parseMarkdown(note?.markdown || '')
  // const description = getDescription(note.markdown || "");

  const { data } = await notesControllerFindAllByCategory({
    path: { category: note.id, domain: String(process.env.DOMAIN) },
    query: {
      status: 'published',
      type: 'content',
      limit: 28,
    },
  })

  const coverRatio = coverRatios(note.slug)
  // const isWide = ['moods'].some((slug) => note.slug.includes(slug))

  const prefix = asPrefix(note.slug)

  return (
    <>
      <section className="border-foreground/5 mb-8 flex flex-col overflow-hidden rounded-lg border bg-white shadow md:flex-row dark:bg-white/5">
        {/*{!isWide && (*/}
        {/*  <div className="relative aspect-[18/6] w-full md:aspect-[16/9] md:w-1/2">*/}
        {/*    <Image*/}
        {/*      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"*/}
        {/*      src={cover.src}*/}
        {/*      alt={`Cover for category ${note.title}`}*/}
        {/*      width={800}*/}
        {/*      height={450}*/}
        {/*      quality={75}*/}
        {/*      decoding="async"*/}
        {/*      sizes="(max-width: 768px) 100vw, 50vw"*/}
        {/*      priority*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}

        <div
          className={cn(
            'flex w-full flex-col justify-center p-4 sm:p-6 md:w-1/2',
            // isWide && 'md:w-full',
          )}
        >
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {note.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none [&_h2]:my-1 [&_h2]:text-sm [&_h2]:font-bold [&_hr]:mt-2 [&_p]:my-1! [&_p]:text-sm [&_p]:leading-tight">
            <Markdown content={markdown} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data?.list.map((i: NoteDtoReadable) => (
          <NoteCard
            key={`post-${i.slug}`}
            {...i}
            coverRatio={coverRatio}
            prefix={prefix}
          />
        ))}
      </section>
      <CollectionPageJsonLd data={note} />
    </>
  )
}
