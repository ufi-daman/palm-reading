import type { Source } from './types'

/**
 * Čtyři volná díla (autorská práva vypršela, vydána před rokem 1929),
 * ze kterých vychází znalostní báze. `locator` u jednotlivých použití
 * (v lines.ts, mounts.ts, ...) upřesňuje kapitolu nebo oddíl.
 */
export function cheiro(locator: string): Source {
  return { work: 'Cheiro — Palmistry for All', year: 1916, locator }
}

export function benham(locator: string): Source {
  return { work: 'Benham — The Laws of Scientific Hand-Reading', year: 1900, locator }
}

export function dale(locator: string): Source {
  return { work: 'Mrs. J. B. Dale — Indian Palmistry', year: 1895, locator }
}

export function markun(locator: string): Source {
  return { work: 'Leo Markun — What You Should Know About Palmistry', year: 1928, locator }
}

export interface BibliographyEntry {
  work: string
  author: string
  year: number
  note: string
  gutenbergId?: number
}

export const BIBLIOGRAPHY: BibliographyEntry[] = [
  {
    work: 'The Laws of Scientific Hand-Reading',
    author: 'William G. Benham',
    year: 1900,
    note: 'Nejsystematičtější ze čtyř pramenů — pahorky, vedlejší čáry, znamení, sedm typů ruky podle tvaru.',
  },
  {
    work: 'Palmistry for All',
    author: 'Cheiro (Louis Hamon)',
    year: 1916,
    note: 'Čáry, typy rukou, praktický výklad — nejobsáhlejší popis jednotlivých čar.',
    gutenbergId: 20480,
  },
  {
    work: 'Indian Palmistry',
    author: 'Mrs. J. B. Dale',
    year: 1895,
    note: 'Indická tradice čtení z dlaně.',
    gutenbergId: 52523,
  },
  {
    work: 'What You Should Know About Palmistry',
    author: 'Leo Markun',
    year: 1928,
    note: 'Chirognomie a kritický odstup k výkladům.',
    gutenbergId: 79270,
  },
]
