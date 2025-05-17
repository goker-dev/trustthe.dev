import { NoteDtoReadable } from '@/api/kodkafa'
import Breadcrumb from '@/components/common/breadcrumb.component'
import { Markdown } from '@/components/common/markdown.component'
import { Card } from '@/components/ui/card'
import { parseMarkdown } from '@/lib/markdown'
import Image from 'next/image'

export async function Heading({
  category,
  data,
}: {
  category: string
  data: NoteDtoReadable
}) {
  // const { data: tags = [] } = await notesControllerGetTagCloud();

  const cover = data?.files?.length
    ? data.files[0]
    : { src: '/assets/images/goker-bg.jpg' }
  const markdown = parseMarkdown(data?.markdown || '')

  return (
    <>
      <Breadcrumb
        className="text-sm uppercase"
        paths={[
          // { to: "/@goker", children: "@goker" },
          // { to: "/@goker/categories", children: "CATEGORIES" },
          { children: category },
        ]}
      />
      <div className="grid grid-cols-3 gap-4">
        <Card className="group col-span-2 grid grid-cols-2 items-stretch bg-white dark:bg-white/5">
          <div className="relative min-h-48 overflow-hidden rounded-l-md">
            <Image
              className="absolute start-0 top-0 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              src={cover.src}
              alt={String(data?.title)}
              width={480}
              height={480}
            />
          </div>
          <div className="px-4 py-2.5 text-sm">
            <h2 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
              {data?.title}
            </h2>
            <Markdown content={markdown} />
          </div>
        </Card>
        {/* <TagCloud tags={tags} /> */}
      </div>
    </>
  )
}
