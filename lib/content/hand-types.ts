import type { HandTypeContent } from './types'

/** Pět typů rukou včetně smíšeného, který v prvním seedu chyběl. */
export const HAND_TYPES: HandTypeContent[] = [
  {
    name: 'earth',
    nameCs: 'Ruka Země',
    element: 'Země',
    description:
      'Čtvercová dlaň s kratšími, silnými prsty. Pevná kůže a výrazné, nepočetné čáry.',
    personality:
      'Praktický a spolehlivý člověk se smyslem pro to, co skutečně funguje. Důvěřuje zkušenosti víc než teorii.',
    characteristics: [
      'Realistický pohled na svět',
      'Vztah k fyzické práci a řemeslu',
      'Potřeba stability a řádu',
      'Důraz na hmatatelné výsledky',
    ],
    strengths: ['Spolehlivost', 'Vytrvalost', 'Praktičnost', 'Klid v zátěži'],
    challenges: [
      'Nedůvěra k novým postupům',
      'Pomalejší rozhodování',
      'Sklon k zatvrzelosti',
    ],
  },
  {
    name: 'fire',
    nameCs: 'Ruka Ohně',
    element: 'Oheň',
    description:
      'Obdélníková dlaň s kratšími prsty. Teplá kůže a výrazné, energické čáry.',
    personality:
      'Energický a přesvědčivý člověk, který strhne ostatní. Jedná rychle a řídí se instinktem.',
    characteristics: [
      'Vysoká úroveň energie',
      'Přirozené charisma',
      'Rychlé rozhodování',
      'Potřeba akce a změny',
    ],
    strengths: ['Charisma', 'Odvaha', 'Schopnost vést', 'Nadšení'],
    challenges: [
      'Unáhlenost',
      'Netrpělivost s pomalejšími',
      'Narušování harmonie ve skupině',
    ],
  },
  {
    name: 'air',
    nameCs: 'Ruka Vzduchu',
    element: 'Vzduch',
    description:
      'Čtvercová dlaň s dlouhými, tenkými prsty. Suchá kůže a jemné, četné čáry.',
    personality:
      'Přemýšlivý a sdílný člověk, který si věci potřebuje pojmenovat. Baví ho rozebírat, jak co funguje.',
    characteristics: [
      'Analytické myšlení',
      'Potřeba komunikace',
      'Zvídavost',
      'Přizpůsobivost',
    ],
    strengths: ['Bystrost', 'Vyjadřování', 'Pružnost', 'Odstup od emocí'],
    challenges: [
      'Ulpívání na povrchu',
      'Přílišná kritičnost',
      'Odtržení od vlastních citů',
    ],
  },
  {
    name: 'water',
    nameCs: 'Ruka Vody',
    element: 'Voda',
    description:
      'Obdélníková dlaň s dlouhými prsty. Jemná kůže a hustá síť tenkých čar.',
    personality:
      'Vnímavý a soucitný člověk s bohatým vnitřním životem. Rozumí náladám dřív, než jsou vyslovené.',
    characteristics: [
      'Silné prožívání',
      'Vyvinutá intuice',
      'Tvořivá představivost',
      'Ohled na druhé',
    ],
    strengths: ['Intuice', 'Empatie', 'Tvořivost', 'Vnímavost k detailu'],
    challenges: [
      'Citová kolísavost',
      'Snadná zranitelnost',
      'Sklon ustoupit místo prosazení se',
    ],
  },
  {
    name: 'mixed',
    nameCs: 'Smíšená ruka',
    element: 'Kombinace',
    description:
      'Ruka spojující znaky několika typů — tvar dlaně neodpovídá délce prstů ani povaze čar.',
    personality:
      'Přizpůsobivý člověk, který se dokáže naladit na různá prostředí. Nemá jedinou pevnou polohu a je to jeho výhoda.',
    characteristics: [
      'Široký záběr schopností',
      'Snadné přizpůsobení situaci',
      'Zájem o různorodá témata',
      'Střídání přístupů podle potřeby',
    ],
    strengths: ['Všestrannost', 'Přizpůsobivost', 'Široký rozhled', 'Prostředník mezi lidmi'],
    challenges: [
      'Obtížné určení priorit',
      'Rozptýlení mezi příliš mnoho směrů',
      'Nesnadné hledání vlastní role',
    ],
  },
]
