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
export type AiCapResult = 'ok' | 'no-database' | 'cap-reached'

/**
 * Tvrdý denní strop volání AI rozboru — v paměti by na serverless
 * nefungoval (každá instance má vlastní paměť), proto počítadlo v
 * Postgresu. Bez DATABASE_URL nejde strop vynutit, takže AI rozbor
 * v tom případě zůstává vypnutý (viz app/api/vision/route.ts).
 */
export async function tryReserveAiCall(): Promise<AiCapResult> {
  if (!prisma) return 'no-database'

  const count = await prisma.aiCallLog.count({
    where: { createdAt: { gte: startOfToday() } },
  })
  if (count >= dailyCap()) return 'cap-reached'

  await prisma.aiCallLog.create({ data: {} })
  return 'ok'
}
