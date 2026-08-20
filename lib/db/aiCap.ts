import { prisma } from './client'

const DEFAULT_DAILY_CAP = 20

function dailyCap(): number {
  const configured = Number(process.env.VISION_DAILY_CAP)
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_DAILY_CAP
}

function startOfToday(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

/**
 * Proč se rezervace nepovedla. Dřív se obojí vracelo jako prosté `false`
 * a endpoint na to odpovídal „strop je vyčerpaný" — i když ve skutečnosti
 * jen chyběla databáze. Uživatel pak marně čekal do dalšího dne na něco,
 * co se samo nespraví.
 */
export type AiCapResult = 'ok' | 'no-database' | 'cap-reached' | 'db-error'

/**
 * Tvrdý denní strop volání AI rozboru — v paměti by na serverless
 * nefungoval (každá instance má vlastní paměť), proto počítadlo v
 * Postgresu. Bez DATABASE_URL nejde strop vynutit, takže AI rozbor
 * v tom případě zůstává vypnutý (viz app/api/vision/route.ts).
 */
export async function tryReserveAiCall(): Promise<
  { result: AiCapResult; reservationId?: string }
> {
  if (!prisma) return { result: 'no-database' }

  // Nedostupná databáze nesmí propadnout jako neošetřená výjimka —
  // endpoint by pak vrátil surovou 500 mimo svůj JSON kontrakt a klient
  // by na `response.json()` spadl s nesrozumitelnou hláškou.
  try {
    const count = await prisma.aiCallLog.count({
      where: { createdAt: { gte: startOfToday() } },
    })
    if (count >= dailyCap()) return { result: 'cap-reached' }

    const reservation = await prisma.aiCallLog.create({ data: {} })
    return { result: 'ok', reservationId: reservation.id }
  } catch (error) {
    console.error('Rezervace AI volání selhala:', error)
    return { result: 'db-error' }
  }
}

/**
 * Vrátí rezervaci zpět, když volání modelu neproběhlo úspěšně. Bez tohohle
 * kroku spálila série chyb (odmítnutí, timeout, neplatná odpověď) celý
 * denní strop, aniž by uživatel dostal jediný výsledek.
 *
 * Selhání úklidu se jen zaloguje — uživateli už se mezitím odpovídá na
 * jeho vlastní chybu a zahodit ji kvůli neúspěšnému rollbacku by bylo horší
 * než jedna nevrácená rezervace.
 */
export async function releaseAiCall(reservationId?: string): Promise<void> {
  if (!prisma || !reservationId) return
  try {
    await prisma.aiCallLog.delete({ where: { id: reservationId } })
  } catch (error) {
    console.error('Vrácení rezervace AI volání selhalo (nekritické):', error)
  }
}
