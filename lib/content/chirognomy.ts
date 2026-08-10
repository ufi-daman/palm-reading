import type { Meaning } from './types'
import { cheiro, markun } from './sources'

/**
 * Chirognomie — čtení z tvaru ruky, prstů, nehtů a kůže. Nezávisí na
 * detekci čar z fotky: tyhle znaky uživatel vyplní sám (nebo je dodá AI
 * rozbor), takže fungují bez ohledu na kvalitu rozpoznávání obrazu.
 *
 * Osy odpovídají polím v `CharacteristicsSchema.additionalFeatures`.
 * Dřív byly významy natvrdo v `lib/analysis/palmReader.ts` jako jednověté
 * popisky psané bez pramene — tenhle soubor je nahrazuje.
 *
 * DVA EDITORSKÉ ŘEZY, které tu dělám vědomě:
 *
 * 1. **Lékařská tvrzení nepřebírám.** Cheiro váže nehty téměř výhradně na
 *    nemoci (plíce, srdce, zakřivení páteře, obrna). Aplikace výslovně
 *    není diagnostika a sdělovat někomu podle nehtu podezření na nemoc by
 *    bylo nepodložené i potenciálně škodlivé. Markun byl k témuž skeptický
 *    už v roce 1928 — jeho výhradu uvádím, protože je poctivější než ta
 *    tvrzení mlčky vynechat.
 * 2. **Morální odsudky nepřebírám.** Cheiro z držení prstů usuzuje na
 *    „sklon ke krádežím" a z podání ruky na proradnost. To jsou nařčení
 *    bez opory, ne popis povahy.
 */
export const CHIROGNOMY: Record<string, Record<string, Meaning>> = {
  fingerLengths: {
    short: {
      meaning:
        'Krátké prsty vůči dlani. Cheiro je spojuje se zaměřením na hmatatelné a praktické — jeho vlastní formulace je ale k tomuto typu dost odmítavá a tu nepřebíráme.',
      personality:
        'Míříte rovnou na celek a výsledek. Detail vás nezdržuje, spíš vás zdržuje, když se u něj musíte zastavit.',
      source: [cheiro('The Fingers — Length to One Another')],
    },
    normal: {
      meaning: 'Prsty úměrné dlani, bez výrazného sklonu k jednomu ani druhému pólu.',
      personality: 'Podle situace umíte přepnout mezi celkovým pohledem a soustředěním na detail.',
      source: [cheiro('The Fingers — Length to One Another')],
    },
    long: {
      meaning:
        'Dlouhé prsty vůči dlani. Cheiro: „prsty mají být dlouhé v poměru k dlani; pak značí větší intelektuálnost a duševní sílu."',
      personality:
        'Máte smysl pro detail a zálibu v důkladnosti — věci si radši projdete do hloubky, než abyste je odbyli.',
      source: [cheiro('The Fingers — Length to One Another')],
    },
  },

  nails: {
    normal: {
      meaning:
        'Pravidelné nehty. Klasické prameny u nehtů skoro nemluví o povaze, ale o zdraví — a ta tvrzení tu vědomě nepřebíráme. Už Markun k nim v roce 1928 poznamenal, že by případný orgán raději nechal vyšetřit lékařem.',
      personality: 'Vyrovnaný projev bez výrazných výkyvů.',
      source: [markun('The Hand and the Fingers'), cheiro('The Nails of the Hand')],
    },
    wide: {
      meaning:
        'Široké nehty. Markun uvádí, že normální nehet zabírá zhruba polovinu prvního článku prstu; širší tvar se v pramenech pojí s přímočařejším projevem.',
      personality: 'Jednáte otevřeně a napřímo, bez velkého obalování.',
      source: [markun('The Hand and the Fingers')],
    },
    narrow: {
      meaning:
        'Úzké nehty. V pramenech se pojí s jemnější stavbou ruky; Cheiro k nim váže hlavně zdravotní výklady, které tu nepřebíráme.',
      personality: 'Jste vnímavější k okolí a spíš zdrženliví, než abyste se hrnuli dopředu.',
      source: [markun('The Hand and the Fingers')],
    },
  },

  palmColor: {
    pale: {
      meaning:
        'Bledá dlaň. Cheiro barvu dlaně spojuje s prokrvením a tím i s tím, kolik má člověk k dispozici energie.',
      personality: 'Se silami hospodaříte opatrněji — po vypětí potřebujete skutečný odpočinek.',
      source: [cheiro('Hands, Hard and Soft')],
    },
    normal: {
      meaning: 'Přirozeně prokrvená dlaň.',
      personality: 'Vaše energie je vyrovnaná, bez velkých propadů i výbuchů.',
      source: [cheiro('Hands, Hard and Soft')],
    },
    ruddy: {
      meaning: 'Zčervenalá dlaň, kterou Cheiro pojí se silným prokrvením a živostí reakcí.',
      personality: 'Reagujete rychle a naplno — energie je spíš potřeba usměrnit než dobíjet.',
      source: [cheiro('Hands, Hard and Soft')],
    },
  },

  skinTexture: {
    fine: {
      meaning:
        'Jemná, měkká kůže. Markun cituje Heron-Allena: „Měkká ruka má v sobě víc poezie než tvrdá" — umělec s tvrdýma rukama maluje věci skutečné, s měkkýma spíš obrazy své představivosti.',
      personality:
        'Jste vnímaví k náladě prostředí a k tomu, co se nevysloví. Představivost u vás bývá silnější než potřeba všechno osahat.',
      source: [markun('The Hand and the Fingers'), cheiro('Hands, Hard and Soft')],
    },
    coarse: {
      meaning:
        'Hrubší, pevná kůže. Cheiro pevnou ruku spojuje s energickou a spolehlivou povahou; Heron-Allen u tvrdší ruky s příklonem ke skutečnému a konkrétnímu před vysněným.',
      personality:
        'Držíte se toho, co je hmatatelné a ověřitelné. Na vás se dá spolehnout spíš než na velké plány.',
      source: [cheiro('Hands, Hard and Soft'), markun('The Hand and the Fingers')],
    },
  },
}

/** Čitelné české názvy os pro zobrazení ve výsledku. */
export const CHIROGNOMY_AXIS_LABELS: Record<string, string> = {
  fingerLengths: 'Délka prstů',
  nails: 'Tvar nehtů',
  palmColor: 'Barva dlaně',
  skinTexture: 'Struktura kůže',
}
