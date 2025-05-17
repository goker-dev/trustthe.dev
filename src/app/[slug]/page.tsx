import {
  NoteDtoReadable,
  notesControllerFindAllByTags,
  notesControllerFindOneBySlug,
} from '@/api/kodkafa'
import Breadcrumb from '@/components/common/breadcrumb.component'
import { Container } from '@/components/common/container.component'
import { Category } from '@/components/features/category.component'
import { Post } from '@/components/features/post.component'
import Profile from '@/components/features/profile.component'
import { metadataGenerator } from '@/lib/seo/metadata.generator'
import { asSlug } from '@/lib/seo/url-slug.utils'
import { notFound } from 'next/navigation'

export const revalidate = 2592000
export const dynamicParams = true

export async function generateStaticParams() {
  const notes = await notesControllerFindAllByTags({
    path: { domain: String(process.env.DOMAIN), tags: 'Echoneo' },
  })
  const paths =
    notes.data?.list?.map((note: NoteDtoReadable) => {
      const [slug, post] = note.slug.split('-')
      return {
        params: { slug, post },
      }
    }) || []
  return paths
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await notesControllerFindOneBySlug({
    path: { slug, domain: String(process.env.DOMAIN) },
  })
  return metadataGenerator(data, { ogType: 'website' })
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // console.log('SLUG', slug, asSlug(slug))
  const { data: note } = await notesControllerFindOneBySlug({
    path: { slug: asSlug(slug), domain: String(process.env.DOMAIN) },
  })
  const type = note?.tags?.includes('profile')
    ? 'profile'
    : note?.type || 'content'
  if (!note) return notFound()
  return (
    <Container>
      <Breadcrumb
        className="text-xs uppercase"
        paths={[{ children: note.slug }]}
      />
      {type === 'category' && <Category note={note} />}
      {type === 'content' && <Post note={note} />}
      {type === 'profile' && <Profile note={note} />}
    </Container>
  )
}
