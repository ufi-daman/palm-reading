import { NextResponse } from 'next/server'
import { getPalmLines } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await getPalmLines())
  } catch (error) {
    console.error('Načtení čar selhalo:', error)
    return NextResponse.json(
      { error: 'Nepodařilo se načíst čáry dlaně.' },
      { status: 500 },
    )
  }
}
