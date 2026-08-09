import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { PALM_LINES } from '@/lib/content/lines'
import { MOUNTS } from '@/lib/content/mounts'
import { HAND_TYPES } from '@/lib/content/hand-types'
import { INTERPRETATIONS } from '@/lib/content/interpretations'

export const dynamic = 'force-dynamic'

/** Naplní databázi znalostní bází. Opakované volání je bezpečné — data se přepíšou. */
export async function POST() {
  try {
    await prisma.interpretation.deleteMany({})
    await prisma.palmLine.deleteMany({})
    await prisma.mount.deleteMany({})
    await prisma.handType.deleteMany({})

    for (const line of PALM_LINES) {
      await prisma.palmLine.create({
        data: {
          key: line.key,
          nameCs: line.nameCs,
          nameEn: line.nameEn,
          type: line.type,
          description: line.description,
          anatomy: line.anatomy,
          characteristics: JSON.stringify(line.characteristics),
        },
      })
    }

    for (const mount of MOUNTS) {
      await prisma.mount.create({
        data: {
          key: mount.key,
          nameCs: mount.nameCs,
          nameEn: mount.nameEn,
          location: mount.location,
          description: mount.description,
          meanings: JSON.stringify(mount.meanings),
        },
      })
    }

    for (const handType of HAND_TYPES) {
      await prisma.handType.create({
        data: {
          name: handType.name,
          nameCs: handType.nameCs,
          element: handType.element,
          description: handType.description,
          personality: handType.personality,
          characteristics: JSON.stringify(handType.characteristics),
          strengths: JSON.stringify(handType.strengths),
          challenges: JSON.stringify(handType.challenges),
        },
      })
    }

    for (const interpretation of INTERPRETATIONS) {
      await prisma.interpretation.create({
        data: {
          criteria: JSON.stringify(interpretation.criteria),
          personality: interpretation.personality,
          strengths: JSON.stringify(interpretation.strengths),
          challenges: JSON.stringify(interpretation.challenges),
          guidance: interpretation.guidance,
          school: interpretation.school,
          source: interpretation.source ?? null,
          confidence: interpretation.confidence,
          tags: JSON.stringify(interpretation.tags),
        },
      })
    }

    return NextResponse.json({
      success: true,
      counts: {
        palmLines: PALM_LINES.length,
        mounts: MOUNTS.length,
        handTypes: HAND_TYPES.length,
        interpretations: INTERPRETATIONS.length,
      },
    })
  } catch (error) {
    console.error('Naplnění databáze selhalo:', error)
    return NextResponse.json(
      { success: false, error: 'Naplnění databáze selhalo.' },
      { status: 500 },
    )
  }
}
