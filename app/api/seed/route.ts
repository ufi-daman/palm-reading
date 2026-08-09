import { prisma } from '@/lib/db/client'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🌱 Seeding database...')

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
        characteristics: JSON.stringify(['Realistické hledisko', 'Fyzická aktivita', 'Stabilita']),
        strengths: JSON.stringify(['Pracovitost', 'Vytrvalost', 'Praktičnost']),
        challenges: JSON.stringify(['Příliš materialistické', 'Pomalé rozhodování']),
      },
    })

    await prisma.handType.create({
      data: {
        name: 'fire',
        nameCs: 'Rukou Ohně',
        element: 'Oheň',
        description: 'Obdélníková dlaň s dlouhými prsty. Tenká, teplá kůže.',
        personality: 'Energická, vášnivá a charismatická osoba.',
        characteristics: JSON.stringify(['Energetika', 'Intuice', 'Charisma']),
        strengths: JSON.stringify(['Charisma', 'Vedení', 'Odvaha']),
        challenges: JSON.stringify(['Impulsivnost', 'Netrpělivost']),
      },
    })

    await prisma.handType.create({
      data: {
        name: 'air',
        nameCs: 'Rukou Vzduchu',
        element: 'Vzduch',
        description: 'Čtvercová dlaň s dlouhými prsty. Suché dělabky.',
        personality: 'Intelektuální, komunikativní a analytická osoba.',
        characteristics: JSON.stringify(['Intelekt', 'Komunikace', 'Flexibilita']),
        strengths: JSON.stringify(['Intelekt', 'Komunikace', 'Adaptabilita']),
        challenges: JSON.stringify(['Povrchní myšlení', 'Nadměrná kritika']),
      },
    })

    await prisma.handType.create({
      data: {
        name: 'water',
        nameCs: 'Rukou Vody',
        element: 'Voda',
        description: 'Obdélníková dlaň s krátkými prsty. Jemná kůže.',
        personality: 'Emocionální, intuitivní a soucitná osoba.',
        characteristics: JSON.stringify(['Emoce', 'Intuice', 'Kreativita']),
        strengths: JSON.stringify(['Intuice', 'Empatia', 'Kreativita']),
        challenges: JSON.stringify(['Emoční nestabilita', 'Snadné zranění']),
      },
    })

    // Create Palm Lines
    console.log('📋 Creating palm lines...')

    await prisma.palmLine.create({
      data: {
        nameCs: 'Linie života',
        nameEn: 'Life Line',
        type: 'major',
        description: 'Nejznámější čára. Odráží fyzickou vitalitu a zdraví.',
        anatomy: 'Vychází z hrany dlaně a obíhá palec.',
        characteristics: JSON.stringify({
          strong: { meaning: 'Silná vitalita' },
          broken: { meaning: 'Životní změny' },
        }),
      },
    })

    await prisma.palmLine.create({
      data: {
        nameCs: 'Linie srdce',
        nameEn: 'Heart Line',
        type: 'major',
        description: 'Běží horizontálně. Reprezentuje emoce a lásku.',
        anatomy: 'Běží přes horní část dlaně.',
        characteristics: JSON.stringify({
          long: { meaning: 'Hluboké cítění' },
        }),
      },
    })

    await prisma.palmLine.create({
      data: {
        nameCs: 'Linie hlavy',
        nameEn: 'Head Line',
        type: 'major',
        description: 'Běží přes střed dlaně. Reprezentuje intelekt.',
        anatomy: 'Vychází z hrany dlaně.',
        characteristics: JSON.stringify({
          long: { meaning: 'Silný intelekt' },
        }),
      },
    })

    await prisma.palmLine.create({
      data: {
        nameCs: 'Linie osudu',
        nameEn: 'Fate Line',
        type: 'major',
        description: 'Běží vertikálně. Reprezentuje osud a cíle.',
        anatomy: 'Běží od základny dlaně nahoru.',
        characteristics: JSON.stringify({
          present: { meaning: 'Jasná cesta' },
        }),
      },
    })

    // Create Mounts
    console.log('🏔️ Creating mounts...')

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Venuše',
        nameEn: 'Mount of Venus',
        location: 'Základna palce',
        description: 'Reprezentuje lásku a energii.',
        meanings: JSON.stringify({
          large: { meaning: 'Vysoká energie' },
        }),
      },
    })

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Jupitera',
        nameEn: 'Mount of Jupiter',
        location: 'Pod ukazovacím prstem',
        description: 'Reprezentuje ambici a vedení.',
        meanings: JSON.stringify({
          large: { meaning: 'Velké ambice' },
        }),
      },
    })

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Saturna',
        nameEn: 'Mount of Saturn',
        location: 'Pod středním prstem',
        description: 'Reprezentuje odpovědnost.',
        meanings: JSON.stringify({
          large: { meaning: 'Silná odpovědnost' },
        }),
      },
    })

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Apolla',
        nameEn: 'Mount of Apollo',
        location: 'Pod prsteníčkem',
        description: 'Reprezentuje tvořivost.',
        meanings: JSON.stringify({
          large: { meaning: 'Silný talent' },
        }),
      },
    })

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Merkura',
        nameEn: 'Mount of Mercury',
        location: 'Pod malíčkem',
        description: 'Reprezentuje komunikaci.',
        meanings: JSON.stringify({
          large: { meaning: 'Vynikající komunikace' },
        }),
      },
    })

    await prisma.mount.create({
      data: {
        nameCs: 'Vyvýšenina Měsíce',
        nameEn: 'Mount of Luna',
        location: 'Spodní část dlaně',
        description: 'Reprezentuje intuici.',
        meanings: JSON.stringify({
          large: { meaning: 'Silná intuice' },
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully!',
    })
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
