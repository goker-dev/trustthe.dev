'use client'

import Image from 'next/image'
import Link from 'next/link'

export function ChatHeader({
  slug,
  connectionStatus,
}: {
  slug: string
  connectionStatus: 'connected' | 'disconnected'
}) {
  // const { data } = await notesControllerFindOneBySlug({
  //     path: { slug, domain: String(process.env.DOMAIN) },
  // });

  // if (!data) return <>NOT FOUND</>;
  // const { cover } = getImages(data);

  // const authorHref = `/${data?.slug}`;

  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div
        className="author flex w-full items-center gap-3"
        data-author="Goker"
        data-author-original-name="Göker"
        data-role="creator"
        aria-label={`Author block: Created by Göker`}
      >
        <Link href={`/${slug}`} aria-label={`Visit profile of Göker`}>
          <Image
            className="h-14 w-14 rounded-full object-cover"
            src={'/assets/images/goker.jpg'}
            alt={'Göker'}
            width={120}
            height={120}
            decoding="async"
          />
        </Link>
        <div className="grow">
          <h3 className="font-semibold">Chat Support</h3>
          <p className="text-sm opacity-90">
            {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  )
}
