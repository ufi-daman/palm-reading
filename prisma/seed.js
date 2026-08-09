const { PrismaClient } = require('@prisma/client')
const Database = require('better-sqlite3')
const { PrismaBetterSqlite3Adapter } = require('@prisma/adapter-better-sqlite3')

const db = new Database('./prisma/dev.db')
const adapter = new PrismaBetterSqlite3Adapter(db)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database with palm reading knowledge...')

  // Clear existing data
  await prisma.interpretation.deleteMany({})
  await prisma.palmLine.deleteMany({})
  await prisma.mount.deleteMany({})
  await prisma.handType.deleteMany({})

  // Create Hand Types
  console.log('📖 Creating hand types...')
  await prisma.handType.create({
    data: {
      name: 'earth',
      nameCs: 'Rukou Země',
      element: 'Země',
      description: 'Čtvercová dlaň s plnými prsty. Hrubší kůže, silné linie.',
      personality: 'Praktická, pracovitá a spolehlivá osoba. Realistické hledisko.',
      characteristics: JSON.stringify(['Realistické hledisko', 'Fyzická aktivita', 'Stabilita', 'Spolehlivost']),
      strengths: JSON.stringify(['Pracovitost', 'Vytrvalost', 'Praktičnost', 'Spolehlivost']),
      challenges: JSON.stringify(['Příliš materialistické', 'Pomalé rozhodování', 'Rigidní myšlení']),
    },
  })

  await prisma.handType.create({
    data: {
      name: 'fire',
      nameCs: 'Rukou Ohně',
      element: 'Oheň',
      description: 'Obdélníková dlaň s dlouhými prsty. Tenká, teplá kůže.',
      personality: 'Energická, vášnivá a charismatická osoba. Impulzivní vůdce.',
      characteristics: JSON.stringify(['Energetika', 'Intuice', 'Charisma', 'Vášeň']),
      strengths: JSON.stringify(['Charisma', 'Vedení', 'Odvaha', 'Kreativita']),
      challenges: JSON.stringify(['Impulsivnost', 'Netrpělivost', 'Porušování harmonii']),
    },
  })

  await prisma.handType.create({
    data: {
      name: 'air',
      nameCs: 'Rukou Vzduchu',
      element: 'Vzduch',
      description: 'Čtvercová dlaň s dlouhými, tenkými prsty. Suché dělabky.',
      personality: 'Intelektuální, komunikativní a analytická osoba. Myslitel.',
      characteristics: JSON.stringify(['Intelekt', 'Komunikace', 'Zvědavost', 'Flexibilita']),
      strengths: JSON.stringify(['Intelekt', 'Komunikace', 'Adaptabilita', 'Analytičnost']),
      challenges: JSON.stringify(['Povrchní myšlení', 'Nadměrná kritika', 'Málo cítění']),
    },
  })

  await prisma.handType.create({
    data: {
      name: 'water',
      nameCs: 'Rukou Vody',
      element: 'Voda',
      description: 'Obdélníková dlaň s krátkými prsty. Jemná kůže.',
      personality: 'Emocionální, intuitivní a soucitná osoba. Umělecký typ.',
      characteristics: JSON.stringify(['Emoce', 'Intuice', 'Kreativita', 'Soucit']),
      strengths: JSON.stringify(['Intuice', 'Empatia', 'Kreativita', 'Umělecké schopnosti']),
      challenges: JSON.stringify(['Emoční nestabilita', 'Snadné zranění', 'Pasivita']),
    },
  })

  // Create Palm Lines
  console.log('📋 Creating palm lines...')
  await prisma.palmLine.create({
    data: {
      nameCs: 'Linie života',
      nameEn: 'Life Line',
      type: 'major',
      description: 'Nejznámější čára, která začíná mezi palcem a ukazovákem a obíhá palec. Odráží fyzickou vitalitu a zdraví.',
      anatomy: 'Vychází z hrany dlaně blízko u palce a obíhá mount venuše.',
      characteristics: JSON.stringify({
        strong: { long: { meaning: 'Dlouhý, zdravý a produktivní život', personality: 'Energetická osoba s velkou vitalitou' } },
        broken: { meaning: 'Životní změny a překážky', personality: 'Osoba prochází transformací' },
      }),
    },
  })

  await prisma.palmLine.create({
    data: {
      nameCs: 'Linie srdce',
      nameEn: 'Heart Line',
      type: 'major',
      description: 'Běží horizontálně přes vrch dlaně. Reprezentuje emoce, lásku a vztahy.',
      anatomy: 'Vychází z hrany dlaně pod malíčkem a běží přes horní část dlaně k ukazovacímu prsty.',
      characteristics: JSON.stringify({
        long: { meaning: 'Hluboký a intenzivní citový život', personality: 'Osoba schopná intenzivního cítění' },
      }),
    },
  })

  await prisma.palmLine.create({
    data: {
      nameCs: 'Linie hlavy',
      nameEn: 'Head Line',
      type: 'major',
      description: 'Běží horizontálně přes střed dlaně. Reprezentuje myšlení, rozum a intelekt.',
      anatomy: 'Vychází z hrany dlaně a běží přes střed dlaně.',
      characteristics: JSON.stringify({
        long: { meaning: 'Silné analytické a myšlenkové schopnosti', personality: 'Intelektuální osoba' },
      }),
    },
  })

  await prisma.palmLine.create({
    data: {
      nameCs: 'Linie osudu',
      nameEn: 'Fate Line',
      type: 'major',
      description: 'Běží vertikálně přes střed dlaně. Reprezentuje osud, poslání a cíle v životě.',
      anatomy: 'Vychází ze základny dlaně a běží vertikálně směrem k střednímu prsty.',
      characteristics: JSON.stringify({
        present: { meaning: 'Silný osudový vliv a cílevědomost', personality: 'Osoba se jasnou cestou' },
      }),
    },
  })

  // Create Mounts
  console.log('🏔️ Creating mounts...')
  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Venuše',
      nameEn: 'Mount of Venus',
      location: 'Základna palce, v dlaní',
      description: 'Reprezentuje lásku, vášeň, energii a sexualitu. Odráží fyzickou vitalitu.',
      meanings: JSON.stringify({
        large: { meaning: 'Vysoká energie a přitažlivost', personality: 'Velmi charismatická osoba' },
      }),
    },
  })

  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Jupitera',
      nameEn: 'Mount of Jupiter',
      location: 'Pod ukazovacím prstem',
      description: 'Reprezentuje ambici, vedení a spiritualitu. Odráží vůdcovský potenciál.',
      meanings: JSON.stringify({
        large: { meaning: 'Velké ambice', personality: 'Ambiciózní osoba' },
      }),
    },
  })

  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Saturna',
      nameEn: 'Mount of Saturn',
      location: 'Pod středním prstem',
      description: 'Reprezentuje odpovědnost, vážnost a smysl pro povinnost.',
      meanings: JSON.stringify({
        large: { meaning: 'Silný smysl povinnosti', personality: 'Velmi odpovědná osoba' },
      }),
    },
  })

  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Apolla',
      nameEn: 'Mount of Apollo',
      location: 'Pod prsteníčkem',
      description: 'Reprezentuje tvořivost, talent a vyjádření. Odráží umělecký potenciál.',
      meanings: JSON.stringify({
        large: { meaning: 'Silný umělecký talent', personality: 'Velmi talentovaná osoba' },
      }),
    },
  })

  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Merkura',
      nameEn: 'Mount of Mercury',
      location: 'Pod malíčkem',
      description: 'Reprezentuje komunikaci, obchodní schopnosti a duševní flexibilitu.',
      meanings: JSON.stringify({
        large: { meaning: 'Vynikající komunikace', personality: 'Řečník a komunikátor' },
      }),
    },
  })

  await prisma.mount.create({
    data: {
      nameCs: 'Vyvýšenina Měsíce',
      nameEn: 'Mount of Luna',
      location: 'Spodní část dlaně pod malíčkem',
      description: 'Reprezentuje intuici, imaginaci a sny. Odráží duhovní citlivost.',
      meanings: JSON.stringify({
        large: { meaning: 'Silná intuice a imaginace', personality: 'Velmi intuitivní osoba' },
      }),
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    db.close()
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    if (db) db.close()
    await prisma.$disconnect()
    process.exit(1)
  })
