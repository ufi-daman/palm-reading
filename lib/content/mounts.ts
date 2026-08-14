import type { MountContent } from './types'
import { cheiro, dale, markun } from './sources'

/**
 * Osm pahorků dlaně (oba Marsovy zvlášť). Zdroj: Cheiro, Palmistry for All
 * (1916), kapitola "The Mounts of the Hand and their Meaning" — vytěženo a
 * přeformulováno vlastními slovy, viz `source` u každého významu.
 *
 * Cheiro spojuje pahorky i s daty narození (astrologické "positive/negative"
 * dělení) — tuhle vrstvu vynechávám, aplikace datum narození nesbírá a
 * nebyla by čitelná ze samotné dlaně, o kterou tu jde.
 */
export const MOUNTS: MountContent[] = [
  {
    key: 'venus',
    nameCs: 'Pahorek Venuše',
    nameEn: 'Mount of Venus',
    location: 'Vyvýšenina u kořene palce, ohraničená čárou života',
    description:
      'Cheiro ho spojuje s touhou po lásce a společnosti, se smyslem pro krásu a s uměleckým, citovým temperamentem — vysoký pahorek kryje důležitou tepnu dlaně, proto ho spojuje i s celkovou vitalitou.',
    meanings: {
      size: {
        small: {
          meaning:
            'Plochý nebo málo vyvinutý pahorek — city podle Cheira spíš duševní než tělesné povahy; Dale u plochého pahorku čte přímo citový chlad, stejně jako Markun u plochého pahorku.',
          personality: 'Vaše náklonnost je hlubší, než na první pohled ukazujete — méně sázíte na smyslové gesto.',
          source: [
            cheiro('The Mount of Venus and its Meaning'),
            dale('No. 16 — Mount of Venus'),
            markun('The Mounts'),
          ],
        },
        medium: {
          meaning: 'Dobře tvarovaný, ale ne příliš velký pahorek — u Cheira výborné znamení touhy po lásce a kráse bez přehnané smyslnosti.',
          personality: 'Umíte si užít blízkost i krásu kolem sebe, aniž by vás to ovládalo.',
          source: [cheiro('The Mount of Venus and its Meaning')],
        },
        large: {
          meaning:
            'Výrazně vyvinutý pahorek — silná cirkulace, vitalita a podle Cheira i výraznější smyslová přitažlivost; Dale ke stejnému znaku dodává přísnější čtení — sklon k vrtkavosti a koketérii. Markun na stejném místě čte silnou touhu.',
          personality: 'Vyzařujete vitalitu a přitažlivost, kterou lidé kolem vás vnímají.',
          source: [
            cheiro('The Mount of Venus and its Meaning'),
            dale('No. 16 — Mount of Venus'),
            markun('The Mounts'),
          ],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý, málo pružný pahorek.',
          personality: 'Vaše energie je spíš klidová — regeneraci berete vážně.',
          source: [cheiro('The Mount of Venus and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost a tvar.',
          personality: 'Držíte stabilní vitalitu bez výkyvů.',
          source: [cheiro('The Mount of Venus and its Meaning')],
        },
        prominent: {
          meaning: 'Pevný, výrazně vystupující pahorek — podle Cheira dominantní vitalita a pohostinnost, ale i sklon k žárlivosti, když jsou city zasaženy.',
          personality: 'Jste velkorysí a pohostinní, ale když se dotknou vašich citů, reagujete intenzivně.',
          source: [cheiro('The Mount of Venus and its Meaning')],
        },
      },
    },
  },
  {
    key: 'jupiter',
    nameCs: 'Pahorek Jupitera',
    nameEn: 'Mount of Jupiter',
    location: 'Vyvýšenina u kořene ukazováku',
    description:
      'Cheiro ho spojuje s touhou vést, organizovat a řídit — na dobré dlani (s jasnou čárou hlavy) nejlepší možné znamení úspěchu z vlastní síly charakteru.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — menší potřeba vést nebo být středem dění.',
          personality: 'Vedení přenecháváte raději druhým, spokojíte se s méně viditelnou rolí.',
          source: [cheiro('The Mount of Jupiter and its Meaning')],
        },
        medium: {
          meaning: 'Zřetelně, ale ne přehnaně vyvinutý pahorek.',
          personality: 'Máte přirozenou autoritu, aniž byste ji museli okázale prosazovat.',
          source: [cheiro('The Mount of Jupiter and its Meaning')],
        },
        large: {
          meaning:
            'Velký pahorek — touha dominovat, vést a organizovat; se slabou čárou hlavy podle Cheira spíš pýcha a domýšlivost, se silnou nejlepší znamení úspěchu z charakteru. Dale jde ve stejném směru přímočařeji: velmi vyvinutý pahorek u něj znamená pýchu až tyranii, slabě vyvinutý zas nečinnost — stejnou dvojici (hrdost/marnivost při přehnaném vývoji) shrnuje z tradice i Markun.',
          personality: 'Máte silnou ambici vést a rozhodovat — do jaké míry vám to slouží, záleží na tom, jak jasně myslíte.',
          source: [cheiro('The Mount of Jupiter and its Meaning'), dale('No. 1 — Mount of Jupiter'), markun('The Mounts')],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek.',
          personality: 'Ambice u vás není hnacím motorem — spokojenost hledáte jinde.',
          source: [cheiro('The Mount of Jupiter and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Vaše ambice je zdravá a přiměřená.',
          source: [cheiro('The Mount of Jupiter and its Meaning')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — Cheiro spojuje s poctivostí, přímočarostí a nesnášenlivostí k podvádění, ale i se sklonem přehánět to do extrémů.',
          personality: 'Jste přímočaří a čestní až do morku kosti — a nesnesete, když to tak druzí nejsou.',
          source: [cheiro('The Mount of Jupiter and its Meaning')],
        },
      },
    },
  },
  {
    key: 'saturn',
    nameCs: 'Pahorek Saturna',
    nameEn: 'Mount of Saturn',
    location: 'Vyvýšenina u kořene prostředníku',
    description:
      'Cheiro ho spojuje s láskou k samotě, opatrností, klidnou rozhodností a sklonem k vážným, přemítavým tématům. Úplná absence podle něj ukazuje lehkovážnější pohled na život.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — lehčí, méně introspektivní pohled na věci.',
          personality: 'Váš přístup k životu je odlehčenější — nezatěžujete se přemítáním nad každou volbou.',
          source: [cheiro('The Mount of Saturn and its Meaning')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek bez přehánění.',
          personality: 'Máte zdravou dávku opatrnosti a vážnosti, aniž by vás ovládala.',
          source: [cheiro('The Mount of Saturn and its Meaning')],
        },
        large: {
          meaning:
            'Výrazně vyvinutý pahorek — silná vůle, ale i sklon k pocitu osamělosti a k tomu nechat se vést fatalismem. Dale u velmi vyvinutého pahorku podobně čte mlčenlivost a smutek, u zřetelně vyvinutého moudrost a rozvahu; stejný směr (samotářství, smutek, askeze) shrnuje z tradice i Markun.',
          personality: 'Jste nezávislí a hluboce přemýšliví — jen si hlídejte, aby vás to neizolovalo od druhých.',
          source: [
            cheiro('The Mount of Saturn and its Meaning'),
            dale('No. 2 — Mount of Saturn'),
            markun('The Mounts'),
          ],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek — podle Cheira lehkovážnější pohled na život.',
          personality: 'Život berete odlehčeně — nehledáte za vším hlubší smysl.',
          source: [cheiro('The Mount of Saturn and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Vaše vážnost a smysl pro odpovědnost jsou přiměřené.',
          source: [cheiro('The Mount of Saturn and its Meaning')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — hluboká oddanost tomu, čemu věříte, ale i sklon k zasmušilosti a přehnané izolaci.',
          personality: 'Pro to, čemu věříte, uděláte téměř cokoliv — jen nezapomeňte, že blízkost s druhými vám neubírá na síle.',
          source: [cheiro('The Mount of Saturn and its Meaning')],
        },
      },
    },
  },
  {
    key: 'apollo',
    nameCs: 'Pahorek Apollóna',
    nameEn: 'Mount of the Sun (Apollo)',
    location: 'Vyvýšenina u kořene prsteníku',
    description:
      'Cheiro: „vždy dobrý pahorek, mít ho velký" — touha zazářit, smysl pro krásu, širokorysá a slunná povaha. Řekové mu dávali i jméno Apollónův.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — menší potřeba veřejného uznání.',
          personality: 'Uznání okolí pro vás není hnacím motorem — spokojenost hledáte jinde.',
          source: [cheiro('The Mount of the Sun and its Meaning')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek.',
          personality: 'Máte cit pro krásu a širokorysost, aniž byste to museli okázale předvádět.',
          source: [cheiro('The Mount of the Sun and its Meaning')],
        },
        large: {
          meaning:
            'Velký pahorek — touha zářit, smysl pro krásu ve všem, širokorysost a štědrost, slunná, silná osobnost. Dale je k výraznému pahorku přísnější — u přehnaně vyvinutého vidí spíš chamtivost a neupřímnost, kde Cheiro čte jen širokorysost; Markun ve stejném znaku shodně vidí bohatství, nadání a zálibu v okázalosti.',
          personality: 'Máte přirozenou zářivost a velkorysost — lidé se k vám stahují.',
          source: [
            cheiro('The Mount of the Sun and its Meaning'),
            dale('No. 3 — Mount of the Sun, "Apollo"'),
            markun('The Mounts'),
          ],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek.',
          personality: 'Veřejná pozornost vás moc neláká — dáváte přednost soukromí.',
          source: [cheiro('The Mount of the Sun and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Máte přiměřenou míru sebevědomí a smyslu pro estetiku.',
          source: [cheiro('The Mount of the Sun and its Meaning')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — intenzivní city v obou směrech, hrdost a citlivost na křivdu, ale i sklon k melancholii, když se zklamou v druhých.',
          personality: 'Milujete i odmítáte naplno — žádná polovičatost. Zraňuje vás, když se ve druhých zklamete.',
          source: [cheiro('The Mount of the Sun and its Meaning')],
        },
      },
    },
  },
  {
    key: 'mercury',
    nameCs: 'Pahorek Merkura',
    nameEn: 'Mount of Mercury',
    location: 'Vyvýšenina u kořene malíku',
    description:
      'Cheiro ho spojuje hlavně s myslí — rychlostí úsudku, výřečností a schopností přizpůsobit se vědě i obchodu. Na dobré dlani prospěšný, na dlani se špatnými znaky zesiluje i jejich stinné stránky.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — pomalejší, rozvážnější myšlení.',
          personality: 'Přemýšlíte pomaleji, ale důkladněji — rychlost pro vás není prioritou.',
          source: [cheiro('The Mount of Mercury and its Meaning')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek.',
          personality: 'Máte bystrou mysl a přirozenou výřečnost, kterou umíte použít, kdy je potřeba.',
          source: [cheiro('The Mount of Mercury and its Meaning')],
        },
        large: {
          meaning:
            'Velký pahorek — rychlost myšlení, vtip, výřečnost, přizpůsobivost vědě i obchodu; se slabou čárou hlavy podle Cheira riziko roztěkanosti a nespolehlivosti. Dale je u přehnaně velkého pahorku přísnější a čte v tom sklon k neupřímnosti a vypočítavosti — tutéž dvojici (řečnost a obchodní nadání na jedné straně, nespolehlivost při přehnání na druhé) shrnuje z tradice i Markun.',
          personality: 'Vaše mysl je rychlá a přizpůsobivá — ideální pro obchod, vědu i komunikaci s lidmi.',
          source: [
            cheiro('The Mount of Mercury and its Meaning'),
            dale('No. 4 — Mount of Mercury'),
            markun('The Mounts'),
          ],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek.',
          personality: 'Komunikace a rychlé reagování nejsou vaše silná stránka — spíš promýšlíte věci do hloubky.',
          source: [cheiro('The Mount of Mercury and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Vaše myšlení je pružné a přiměřeně rychlé.',
          source: [cheiro('The Mount of Mercury and its Meaning')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — silná adaptabilita a bystrost, ale u afligovaných znaků i sklon k trikům a nervozitě.',
          personality: 'Umíte se rychle přizpůsobit novým situacím a lidem — dávejte pozor, aby vás rychlost nesvedla ke zkratkám.',
          source: [cheiro('The Mount of Mercury and its Meaning')],
        },
      },
    },
  },
  {
    key: 'luna',
    nameCs: 'Pahorek Luny',
    nameEn: 'Mount of the Moon (Luna)',
    location: 'Vyvýšenina na vnější hraně dlaně u zápěstí',
    description:
      'Cheiro ho spojuje s představivostí, romantikou, ideály a touhou po změně a cestování — vyvinutý pahorek Luny je u něj častý u vynálezců, umělců a lidí s mimořádně živou fantazií.',
    meanings: {
      size: {
        small: {
          meaning:
            'Plochý pahorek — praktičtější, méně snivá povaha; Dale u plochého, propadlého pahorku podobně čte strohost a menší sklon k výřečnosti.',
          personality: 'Držíte se pevně na zemi — fantazie u vás ustupuje praktickému uvažování.',
          source: [cheiro('The Mount of the Moon and its Meaning'), dale('No. 14 — Mount of the Moon')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek.',
          personality: 'Máte živou představivost, kterou umíte propojit s praktickým uvažováním.',
          source: [cheiro('The Mount of the Moon and its Meaning')],
        },
        large: {
          meaning:
            'Vysoký, dobře vyvinutý pahorek — silná představivost, vynalézavost, touha po změně a cestování, časté u vynálezců a umělců. Markun ze stejné tradice shodně shrnuje: dobře vyvinutý pahorek Luny dává obraznost, lásku k tajemnu a touhu po dálkách.',
          personality: 'Vaše představivost je vaší hnací silou — táhne vás to k novému, neobvyklému a k cestování.',
          source: [cheiro('The Mount of the Moon and its Meaning'), markun('The Mounts')],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek — Cheiro ho spojuje s klidnějším, méně rozkolísaným založením.',
          personality: 'Vaše rozpoložení je stabilnější — méně podléháte výkyvům nálad.',
          source: [cheiro('The Mount of the Moon and its Meaning')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Kombinujete fantazii s dostatečnou stabilitou.',
          source: [cheiro('The Mount of the Moon and its Meaning')],
        },
        prominent: {
          meaning: 'Výrazně vyvinutý pahorek — mimořádná citlivost na okolí a náladovost, ale i inventivnost a schopnost překonávat nezdary.',
          personality: 'Jste citliví na atmosféru kolem sebe víc, než si možná uvědomujete — a přesto se po pádu rychle zvednete.',
          source: [cheiro('The Mount of the Moon and its Meaning')],
        },
      },
    },
  },
  {
    key: 'marsLower',
    nameCs: 'Dolní pahorek Marsu',
    nameEn: 'Lower Mount of Mars',
    location: 'Mezi palcem a začátkem čáry života',
    description:
      'Cheiro ho nazývá „pozitivní" Mars — tělesná odvaha, bojovnost a schopnost vést. Leží při horní části čáry života.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — menší sklon k přímé konfrontaci.',
          personality: 'Konfliktům se raději vyhýbáte, než abyste do nich šli po hlavě.',
          source: [cheiro('The First Mount of Mars')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek.',
          personality: 'Máte odvahu postavit se za to, na čem vám záleží, aniž byste hledali konflikt.',
          source: [cheiro('The First Mount of Mars')],
        },
        large: {
          meaning:
            'Výrazně vyvinutý pahorek — bojovná povaha, silná potřeba vést a nesnášenlivost vůči zasahování do vlastních plánů. Dale ho na stejném místě spojuje prostě s odvahou.',
          personality: 'Jste přirození bojovníci — jdete si za svým a špatně snášíte, když vám do toho někdo mluví.',
          source: [cheiro('The First Mount of Mars'), dale('No. 15 — Plane and Place of Mars')],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek.',
          personality: 'Vaše energie je klidnější, míň konfrontační.',
          source: [cheiro('The First Mount of Mars')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Umíte se prosadit, aniž byste zbytečně vyostřovali situace.',
          source: [cheiro('The First Mount of Mars')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — prudká, ale rychle odeznívající povaha; velkorysost a odvaha ve spojení s impulzivitou.',
          personality: 'Váš temperament je prudký, ale spravedlivý — bouře rychle přejde a vy litujete, co jste v ní řekli.',
          source: [cheiro('The First Mount of Mars')],
        },
      },
    },
  },
  {
    key: 'marsUpper',
    nameCs: 'Horní pahorek Marsu',
    nameEn: 'Upper Mount of Mars',
    location: 'Mezi čárou srdce a čárou hlavy, na vnější hraně dlaně',
    description:
      'Cheiro ho nazývá „negativní" nebo mentální Mars — stejné bojovné vlastnosti jako dolní Mars, ale přenesené do mysli: vytrvalost, taktika a mentální odvaha místo fyzické.',
    meanings: {
      size: {
        small: {
          meaning: 'Málo vyvinutý pahorek — menší sklon k mentálnímu „boji" v diskusi.',
          personality: 'Debatám a prosazování názorů silou argumentu dáváte přednost před vyhrocováním.',
          source: [cheiro('The Second Mount of Mars')],
        },
        medium: {
          meaning: 'Zřetelně vyvinutý pahorek.',
          personality: 'V diskusi umíte argumentovat vytrvale, aniž byste museli zvyšovat hlas.',
          source: [cheiro('The Second Mount of Mars')],
        },
        large: {
          meaning: 'Výrazně vyvinutý pahorek — mentální vytrvalost, taktické myšlení, výborní organizátoři a stratégové.',
          personality: 'Vaše síla je v hlavě, ne v hlasitosti — myslíte v tazích dopředu a málokdy vás něco zaskočí.',
          source: [cheiro('The Second Mount of Mars')],
        },
      },
      strength: {
        weak: {
          meaning: 'Plochý pahorek.',
          personality: 'Vaše přístup ke konfliktu je smířlivější, míň strategický.',
          source: [cheiro('The Second Mount of Mars')],
        },
        normal: {
          meaning: 'Vyvážená pevnost.',
          personality: 'Máte zdravou dávku vytrvalosti v prosazování svých názorů.',
          source: [cheiro('The Second Mount of Mars')],
        },
        prominent: {
          meaning: 'Pevný, výrazný pahorek — silný magnetismus a schopnost přesvědčit druhé, ale i sklon k skryté tvrdohlavosti.',
          personality: 'Máte přirozenou přesvědčivost — jen si hlídejte, aby se z trpělivosti nestala tichá tvrdohlavost.',
          source: [cheiro('The Second Mount of Mars')],
        },
      },
    },
  },
]
