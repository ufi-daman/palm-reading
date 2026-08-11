// Spouští se před `next build`. Když DATABASE_URL chybí, appka má běžet
// i tak (viz README) — proto migraci přeskočí, ne že by build shodila.
// Když DATABASE_URL je, ale migrace selže (např. výpadek databáze), build
// se taky nezastaví — appka je navržená běžet i s nedostupnou DB (zápisy
// statistik/AI stropu se tiše přeskočí), takže zastavit celé nasazení kvůli
// dočasnému výpadku migrace by bylo horší než nasadit se starým schématem.
import { execSync } from 'node:child_process'

if (!process.env.DATABASE_URL) {
  console.log('[deploy-migrate] DATABASE_URL není nastavená, migrace se přeskakuje.')
  process.exit(0)
}

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
} catch (error) {
  console.error('[deploy-migrate] prisma migrate deploy selhalo, pokračuji v buildu:', error.message)
}
