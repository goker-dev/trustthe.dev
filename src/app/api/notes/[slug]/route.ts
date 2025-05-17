import { notesControllerFindOneBySlug } from '@/api/kodkafa'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const { data } = await notesControllerFindOneBySlug({
      path: { slug, domain: String(process.env.DOMAIN) },
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Note not found',
        message: process.env.NODE_ENV === 'development' ? error : null,
      },
      { status: 404 },
    )
  }
}
