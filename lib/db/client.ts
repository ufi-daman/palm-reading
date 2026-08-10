import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma?: PrismaClient | null }

/**
 * Statistiky jsou volitelné — aplikace i bez DATABASE_URL musí normálně
 * číst z dlaně. Bez proměnné vrátíme null a volající zápis tiše přeskočí
 * (viz lib/db/stats.ts), místo aby appka spadla na chybějícím klientovi.
 */
function createPrismaClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) return null

  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
