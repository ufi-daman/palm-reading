import { NextResponse } from 'next/server'
import { getHandTypes } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await getHandTypes())
  } catch (error) {
    console.error('Načtení typů rukou selhalo:', error)
    return NextResponse.json(
      { error: 'Nepodařilo se načíst typy rukou.' },
      { status: 500 },
    )
  }
}
