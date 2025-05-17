import { abstractCategories } from '@/config/navigation'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  let path = request.nextUrl.searchParams.get('path') || '/'

  abstractCategories.forEach(([category, prefix]) => {
    path = path.replace(`/${category}/`, `/${prefix ? prefix + '-' : ''}`)
  })

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
