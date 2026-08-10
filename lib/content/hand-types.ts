import type { HandTypeContent } from './types'
import { cheiro } from './sources'

/**
 * Pět typů rukou podle živlů (Země/Oheň/Vzduch/Voda/Smíšená) je moderní
 * zjednodušení — žádný ze čtyř pramenů tuhle terminologii nepoužívá.
 * Všechny čtyři (Cheiro, Benham, Dale, Markun) sdílejí stejnou klasickou
 * francouzskou typologii sedmi typů (Elementární, Čtvercová, Lopatovitá,
 * Filozofická, Kónická/Umělecká, Psychická/Idealistická, Smíšená), ze
 * které živlový systém vychází — čtvercová dlaň s krátkými prsty
 * odpovídá "Čtvercové" ruce, podlouhlá s krátkými prsty "Lopatovité" atd.
 * Popisy níže proto čerpají z odpovídajícího klasického typu u Cheira a
 * korespondenci s živlem uvádí výslovně, ne jako by Cheiro sám mluvil o
 * "ruce Země".
 */
export const HAND_TYPES: HandTypeContent[] = [
  {
    name: 'earth',
    nameCs: 'Ruka Země',
    element: 'Země',
    description:
      'Čtvercová dlaň s kratšími, silnými prsty. Odpovídá Cheirovu klasickému typu "Čtvercová" (Square) ruka — praktická, logická, spíš materialistická.',
    personality:
      'Praktický a spolehlivý člověk se smyslem pro to, co skutečně funguje. Cheiro: „patří k zemi a věcem země" — málo imaginace, hodně metodičnosti a pečlivosti.',
    characteristics: [
      'Realistický pohled na svět — věří jen tomu, co dokáže prokázat rozumem a zkušeností',
      'Vztah k fyzické práci a řemeslu',
      'Metodičnost a pečlivost ve všem, co dělá',
      'Sklon k tradičnímu, i nábožnému cítění — spíš ze zvyku než z hloubavosti',
    ],
    strengths: ['Spolehlivost', 'Vytrvalost', 'Praktičnost', 'Klid v zátěži'],
    challenges: [
      'Nedůvěra k novým postupům',
      'Málo prostoru pro imaginaci a idealismus',
      'Sklon k tvrdohlavosti, zvlášť s dlouhým, tuhým palcem',
    ],
    source: [cheiro('The Square Type')],
  },
  {
    name: 'fire',
    nameCs: 'Ruka Ohně',
    element: 'Oheň',
    description:
      'Obdélníková dlaň s kratšími prsty. Odpovídá Cheirovu typu "Lopatovitá" (Spatulate) ruka — neúnavná energie, originalita, sklon k impulzivnímu jednání.',
    personality:
      'Energický a přesvědčivý člověk, který strhne ostatní. Cheiro: lidé tohoto typu jsou „stále do něčeho buší" — nabití energií, vynalézaví, plní iniciativy.',
    characteristics: [
      'Neúnavná energie a potřeba stále něco dělat',
      'Originalita a sklon k vynalézavosti',
      'Impulzivnost — čím širší dlaň u zápěstí, tím víc jednání vede popud, ne rozvaha',
      'Emocionální, demonstrativní projev',
    ],
    strengths: ['Charisma', 'Odvaha', 'Schopnost vést', 'Nadšení'],
    challenges: [
      'Unáhlenost a impulzivní jednání',
      'Netrpělivost s pomalejšími',
      'Prudká, i když rychle odeznívající povaha',
    ],
    source: [cheiro('The Spatulate Hand')],
  },
  {
    name: 'air',
    nameCs: 'Ruka Vzduchu',
    element: 'Vzduch',
    description:
      'Čtvercová dlaň s dlouhými, tenkými prsty. Odpovídá Cheirovu typu "Filozofická" (Philosophic) ruka — studijní, přemítavá povaha s lehce osamělým sklonem.',
    personality:
      'Přemýšlivý a sdílný člověk, který si věci potřebuje pojmenovat. Cheiro tento typ spojuje s hlubokým čtenářstvím, láskou k literatuře a sklonem k samotářské, přemítavé práci.',
    characteristics: [
      'Analytické, studijní myšlení',
      'Potřeba četby a hlubšího porozumění věcem',
      'Sklon k samotářštější, přemítavé práci',
      'Kloubnaté prsty podle Cheira dávají pečlivost a smysl pro detail, ale zpomalují impuls jednat',
    ],
    strengths: ['Bystrost', 'Vyjadřování', 'Pružnost', 'Odstup od emocí'],
    challenges: [
      'Ulpívání na povrchu, pokud chybí hloubka zájmu',
      'Přílišná kritičnost',
      'Sklon k izolaci od praktického světa',
    ],
    source: [cheiro('The Philosophic Hand')],
  },
  {
    name: 'water',
    nameCs: 'Ruka Vody',
    element: 'Voda',
    description:
      'Obdélníková dlaň s dlouhými prsty. Nejblíž má ke dvěma Cheirovým typům najednou — "Kónické/umělecké" (Conic) ruce citovostí a vnímavostí ke kráse, a "Psychické/idealistické" (Psychic) ruce hloubkou vnitřního prožívání.',
    personality:
      'Vnímavý a soucitný člověk s bohatým vnitřním životem. Cheiro o kónickém typu: emocionální, umělecký temperament, mimořádně citlivý na barvy, hudbu a atmosféru.',
    characteristics: [
      'Silné, citlivé prožívání',
      'Vnímavost ke kráse a atmosféře prostředí',
      'Bohatá představivost',
      'Menší zájem o praktickou, materiální stránku života',
    ],
    strengths: ['Intuice', 'Empatie', 'Tvořivost', 'Vnímavost k detailu'],
    challenges: [
      'Citová kolísavost',
      'Snadná zranitelnost vůči tvrdším typům lidí',
      'Sklon k nepraktičnosti — u extrémní podoby (Cheirův „Psychický" typ) i k odtržení od reálného života',
    ],
    source: [cheiro('The Conic or Artistic Hand'), cheiro('The Psychic or Idealistic Hand')],
  },
  {
    name: 'mixed',
    nameCs: 'Smíšená ruka',
    element: 'Kombinace',
    description:
      'Ruka spojující znaky několika typů — tvar dlaně neodpovídá délce prstů ani povaze čar. Přesně odpovídá Cheirovu typu "Smíšená" (Mixed) ruka.',
    personality:
      'Přizpůsobivý člověk, který se dokáže naladit na různá prostředí. Cheiro: „všestrannost sama" — ale proměnlivost účelu často brání dotáhnout jeden talent do konce.',
    characteristics: [
      'Široký záběr schopností',
      'Snadné přizpůsobení situaci',
      'Zájem o různorodá témata — dokáže mluvit téměř o čemkoliv',
      'Jasná, přímá čára hlavy je podle Cheira klíčová k tomu, aby se z všestrannosti vytříbil jeden skutečný talent',
    ],
    strengths: ['Všestrannost', 'Přizpůsobivost', 'Široký rozhled', 'Prostředník mezi lidmi'],
    challenges: [
      'Obtížné určení priorit',
      'Rozptýlení mezi příliš mnoho směrů — „trochu ze všeho, nic pořádně"',
      'Nesnadné hledání vlastní role',
    ],
    source: [cheiro('The Mixed Hand')],
  },
]
