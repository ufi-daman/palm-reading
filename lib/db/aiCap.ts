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
 * Tvrdý denní strop volání AI rozboru — v paměti by na serverless
 * nefungoval (každá instance má vlastní paměť), proto počítadlo v
 * Postgresu. Bez DATABASE_URL nejde strop vynutit, takže AI rozbor
 * v tom případě zůstává vypnutý (viz app/api/vision/route.ts).
 *
 * Vrací true a zapíše nový záznam, pokud je pod stropem; jinak jen vrátí
 * false beze změny.
 */
export async function tryReserveAiCall(): Promise<boolean> {
  if (!prisma) return false

  const count = await prisma.aiCallLog.count({
    where: { createdAt: { gte: startOfToday() } },
  })
  if (count >= dailyCap()) return false

  await prisma.aiCallLog.create({ data: {} })
  return true
}
