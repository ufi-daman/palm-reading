import { NextResponse } from 'next/server'
import { getMounts } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(await getMounts())
  } catch (error) {
    console.error('Načtení pahorků selhalo:', error)
    return NextResponse.json(
      { error: 'Nepodařilo se načíst pahorky dlaně.' },
      { status: 500 },
    )
  }
}
