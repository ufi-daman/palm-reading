import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

/**
 * SQLite cesty v DATABASE_URL jsou relativní ke kořeni projektu. Prisma CLI a
 * Next.js runtime ale běží z různých pracovních adresářů, takže relativní cestu
 * převádíme na absolutní — jinak vzniknou dvě různé databáze.
 */
function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  if (!raw.startsWith('file:')) return raw

  const filePath = raw.slice('file:'.length)
  if (path.isAbsolute(filePath)) return raw

  return `file:${path.resolve(process.cwd(), filePath)}`
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabaseUrl() })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
