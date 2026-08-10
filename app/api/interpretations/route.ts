import { NextResponse } from 'next/server'
import { getInterpretations } from '@/lib/content'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const handType = searchParams.get('handType')
  const school = searchParams.get('school')

  let interpretations = getInterpretations()

  if (handType) {
    interpretations = interpretations.filter(
      (item) => item.criteria.handType === handType,
    )
  }
  if (school) {
    interpretations = interpretations.filter((item) => item.school === school)
  }

  return NextResponse.json(interpretations)
}
