import { NoteDtoReadable } from '@/api/kodkafa'
import { Markdown } from '@/components/common/markdown.component'
import { getImages } from '@/lib/image.utils'
import { parseMarkdown } from '@/lib/markdown'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PersonJsonLd } from './json-ld.component'
export default async function Profile({ note }: { note: NoteDtoReadable }) {
  if (!note?.slug) notFound()

  const { cover } = getImages(note)
  const markdown = parseMarkdown(note?.markdown || '')

  return (
    <>
      {/* <SEOMeta
                title={note.title}
                description={`Profile of ${note.title}`}
                url={`https://${process.env.DOMAIN}/${note.slug}`}
                canonical={`https://${process.env.DOMAIN}/${note.slug}`}
                type="ProfilePage"
            /> */}

      <article
        itemScope
        itemType="https://schema.org/ProfilePage"
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <figure className="flex items-start justify-center">
          <div className="border-foreground/10 aspect-square w-full max-w-[300px] rounded-full border-4 shadow-sm">
            <Image
              className="h-full w-full rounded-full object-cover object-center"
              src={cover.src}
              alt={String(note.title)}
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>

        <div className="lg:col-span-2">
          <header>
            <h1
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100"
              itemProp="name"
            >
              {note.title}
            </h1>
          </header>
          <section className="text-neutral-800 dark:text-neutral-200 [&_article>p]:py-1.5">
            <Markdown content={markdown} />
          </section>
        </div>
        <PersonJsonLd data={note} />
      </article>
    </>
  )
}
