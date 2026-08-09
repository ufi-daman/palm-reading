import { NextResponse } from 'next/server'
import { getInterpretations } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const handType = searchParams.get('handType')
    const school = searchParams.get('school')

    let interpretations = await getInterpretations()

    if (handType) {
      interpretations = interpretations.filter(
        (item) => item.criteria.handType === handType,
      )
    }
    if (school) {
      interpretations = interpretations.filter((item) => item.school === school)
    }

    return NextResponse.json(interpretations)
  } catch (error) {
    console.error('Načtení interpretací selhalo:', error)
    return NextResponse.json(
      { error: 'Nepodařilo se načíst interpretace.' },
      { status: 500 },
    )
  }
}
