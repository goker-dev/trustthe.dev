import Breadcrumb from '@/components/common/breadcrumb.component'
import { ReactNode } from 'react'

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ tags: string }>
  children: ReactNode
}) {
  const { tags } = await params
  return (
    <div className="mx-auto max-w-full px-4 lg:px-8">
      <Breadcrumb
        className="text-sm uppercase"
        paths={[
          { to: '/', children: 'TAGS' },
          {
            children: tags
              .split(',')
              .map((i: string) => i.trim()?.replace('-', '/'))
              .join(','),
          },
        ]}
      />
      {children}
    </div>
  )
}
