import type { MountContent } from './types'

/** Osm pahorků dlaně včetně obou Marsových, které v prvním seedu chyběly. */
export const MOUNTS: MountContent[] = [
  {
    key: 'venus',
    nameCs: 'Pahorek Venuše',
    nameEn: 'Mount of Venus',
    location: 'Vyvýšenina u kořene palce, ohraničená čárou života',
    description:
      'Souvisí s životní energií, vřelostí, smyslností a schopností těšit se ze života.',
    meanings: {
      size: {
        small: {
          meaning: 'Zdrženlivější projev vřelosti.',
          personality: 'Blízkost dávkujete a potřebujete svůj prostor.',
        },
        medium: {
          meaning: 'Vyvážená vřelost a chuť do života.',
          personality: 'Umíte si užít společnost i klid o samotě.',
        },
        large: {
          meaning: 'Silná životní energie a přirozená přitažlivost.',
          personality: 'Lidé se u vás rádi zdrží — vyzařujete teplo.',
        },
      },
      strength: {
        weak: {
          meaning: 'Energie spíš na útlumu.',
          personality: 'Potřebujete víc regenerace, než si přiznáváte.',
        },
        normal: {
          meaning: 'Stabilní tělesná i citová energie.',
          personality: 'Držíte se v rovnováze.',
        },
        prominent: {
          meaning: 'Výrazná vitalita a smyslnost.',
          personality: 'Žijete naplno a je to na vás vidět.',
        },
      },
    },
  },
  {
    key: 'jupiter',
    nameCs: 'Pahorek Jupitera',
    nameEn: 'Mount of Jupiter',
    location: 'Pod ukazovákem',
    description: 'Souvisí s ctižádostí, sebedůvěrou a přirozenou autoritou.',
    meanings: {
      size: {
        small: {
          meaning: 'Skromnější ctižádost.',
          personality: 'Nepotřebujete být vidět, stačí vám dobře odvedená práce.',
        },
        medium: {
          meaning: 'Zdravá míra ctižádosti.',
          personality: 'Cíle si stavíte přiměřeně a plníte je.',
        },
        large: {
          meaning: 'Silná ctižádost a vůdčí sklon.',
          personality: 'Přirozeně přebíráte odpovědnost za skupinu.',
        },
      },
      strength: {
        weak: {
          meaning: 'Sebedůvěra kolísá.',
          personality: 'Své schopnosti podceňujete častěji, než by bylo namístě.',
        },
        normal: {
          meaning: 'Vyrovnaná sebedůvěra.',
          personality: 'Znáte svou cenu a nemusíte ji dokazovat.',
        },
        prominent: {
          meaning: 'Výrazná autorita a rozhodnost.',
          personality: 'Ve skupině se k vám lidé obracejí pro rozhodnutí.',
        },
      },
    },
  },
  {
    key: 'saturn',
    nameCs: 'Pahorek Saturna',
    nameEn: 'Mount of Saturn',
    location: 'Pod prostředníkem',
    description: 'Souvisí s odpovědností, rozvahou, kázní a vážností.',
    meanings: {
      size: {
        small: {
          meaning: 'Volnější vztah k závazkům.',
          personality: 'Nesvazujete se víc, než musíte.',
        },
        medium: {
          meaning: 'Zdravá odpovědnost.',
          personality: 'Na co kývnete, to dotáhnete.',
        },
        large: {
          meaning: 'Silný smysl pro povinnost.',
          personality: 'Beřete věci vážně, někdy až příliš.',
        },
      },
      strength: {
        weak: {
          meaning: 'Kázeň spíš podle nálady.',
          personality: 'Fungujete líp v pružném režimu než v pevném řádu.',
        },
        normal: {
          meaning: 'Vyrovnaná sebekázeň.',
          personality: 'Řád si umíte nastavit sami.',
        },
        prominent: {
          meaning: 'Výrazná kázeň a vytrvalost.',
          personality: 'Dokážete jít za cílem i bez vnější motivace.',
        },
      },
    },
  },
  {
    key: 'apollo',
    nameCs: 'Pahorek Apollóna',
    nameEn: 'Mount of Apollo',
    location: 'Pod prsteníkem',
    description: 'Souvisí s tvořivostí, vkusem, radostí a sebevyjádřením.',
    meanings: {
      size: {
        small: {
          meaning: 'Tvořivost v skrytu.',
          personality: 'Tvoříte pro sebe a nepotřebujete potlesk.',
        },
        medium: {
          meaning: 'Zdravý tvůrčí projev.',
          personality: 'Máte cit pro formu a děláte věci pěkně.',
        },
        large: {
          meaning: 'Silný talent a chuť ho ukazovat.',
          personality: 'Baví vás tvořit a sdílet výsledek.',
        },
      },
      strength: {
        weak: {
          meaning: 'Tvůrčí energie na útlumu.',
          personality: 'Potřebujete podnět zvenčí, abyste se rozjeli.',
        },
        normal: {
          meaning: 'Stabilní tvořivost.',
          personality: 'Nápady přicházejí pravidelně.',
        },
        prominent: {
          meaning: 'Výrazná tvůrčí síla.',
          personality: 'Tvoření je pro vás způsob, jak přemýšlet.',
        },
      },
    },
  },
  {
    key: 'mercury',
    nameCs: 'Pahorek Merkura',
    nameEn: 'Mount of Mercury',
    location: 'Pod malíčkem',
    description:
      'Souvisí s obratností v jednání, komunikací, obchodním citem a pohotovostí.',
    meanings: {
      size: {
        small: {
          meaning: 'Zdrženlivost v jednání.',
          personality: 'Raději posloucháte, než mluvíte.',
        },
        medium: {
          meaning: 'Dobrá schopnost domluvy.',
          personality: 'Umíte najít společnou řeč.',
        },
        large: {
          meaning: 'Výrazný dar řeči a obchodní cit.',
          personality: 'V jednání jste ve svém živlu.',
        },
      },
      strength: {
        weak: {
          meaning: 'Pohotovost kolísá.',
          personality: 'Nejlepší odpověď vás napadne až po rozhovoru.',
        },
        normal: {
          meaning: 'Vyrovnaná pohotovost.',
          personality: 'V debatě obstojíte.',
        },
        prominent: {
          meaning: 'Vysoká pohotovost a přesvědčivost.',
          personality: 'Reagujete rychle a trefně.',
        },
      },
    },
  },
  {
    key: 'luna',
    nameCs: 'Pahorek Luny',
    nameEn: 'Mount of Luna',
    location: 'Spodní vnější část dlaně naproti palci',
    description:
      'Souvisí s představivostí, vnímavostí, sny a vnitřním světem.',
    meanings: {
      size: {
        small: {
          meaning: 'Věcný, prakticky založený pohled.',
          personality: 'Držíte se toho, co je vidět a ověřitelné.',
        },
        medium: {
          meaning: 'Vyvážená představivost.',
          personality: 'Umíte snít, aniž byste ztratili půdu pod nohama.',
        },
        large: {
          meaning: 'Bohatá představivost a vnitřní svět.',
          personality: 'Váš vnitřní život je stejně živý jako ten vnější.',
        },
      },
      strength: {
        weak: {
          meaning: 'Fantazie spíš v pozadí.',
          personality: 'Přemýšlíte v konkrétních věcech.',
        },
        normal: {
          meaning: 'Stabilní vnímavost.',
          personality: 'Máte cit pro atmosféru.',
        },
        prominent: {
          meaning: 'Silná intuice a tvořivá představivost.',
          personality: 'Nápady k vám přicházejí obrazy, ne větami.',
        },
      },
    },
  },
  {
    key: 'marsLower',
    nameCs: 'Dolní pahorek Marsu',
    nameEn: 'Lower Mount of Mars',
    location: 'Mezi palcem a čárou života, nad pahorkem Venuše',
    description:
      'Souvisí s aktivní odvahou, průbojností a schopností postavit se za sebe.',
    meanings: {
      size: {
        small: {
          meaning: 'Konflikty raději obcházíte.',
          personality: 'Hledáte řešení dohodou, ne silou.',
        },
        medium: {
          meaning: 'Zdravá průbojnost.',
          personality: 'Ozvete se, když je potřeba, ale nevyhledáváte střet.',
        },
        large: {
          meaning: 'Výrazná odvaha a bojovnost.',
          personality: 'Do střetu jdete přímo a bez okolků.',
        },
      },
      strength: {
        weak: {
          meaning: 'Průbojnost na útlumu.',
          personality: 'Své zájmy prosazujete až po delším váhání.',
        },
        normal: {
          meaning: 'Vyrovnaná asertivita.',
          personality: 'Hranice si umíte nastavit.',
        },
        prominent: {
          meaning: 'Silná aktivní odvaha.',
          personality: 'Když jde o věc, jdete do ní naplno.',
        },
      },
    },
  },
  {
    key: 'marsUpper',
    nameCs: 'Horní pahorek Marsu',
    nameEn: 'Upper Mount of Mars',
    location: 'Na vnější hraně dlaně mezi čárou srdce a pahorkem Luny',
    description:
      'Souvisí s pasivní odvahou — výdrží, odolností a schopností vydržet tlak.',
    meanings: {
      size: {
        small: {
          meaning: 'Menší odolnost vůči dlouhodobému tlaku.',
          personality: 'Potřebujete přestávky, jinak se vyčerpáte.',
        },
        medium: {
          meaning: 'Zdravá odolnost.',
          personality: 'Nápor vydržíte a pak se srovnáte.',
        },
        large: {
          meaning: 'Vysoká odolnost a trpělivost.',
          personality: 'V krizi jste ten, kdo zůstane klidný.',
        },
      },
      strength: {
        weak: {
          meaning: 'Snadnější vyčerpání.',
          personality: 'Dlouhý tlak vás dostane dřív než prudký náraz.',
        },
        normal: {
          meaning: 'Stabilní výdrž.',
          personality: 'Umíte vydržet, dokud to má smysl.',
        },
        prominent: {
          meaning: 'Mimořádná houževnatost.',
          personality: 'Vzdát se pro vás není první možnost.',
        },
      },
    },
  },
]
