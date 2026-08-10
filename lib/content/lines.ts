import type { PalmLineContent } from './types'
import { cheiro } from './sources'

/**
 * Čáry dlaně. Významy jsou rozepsané po osách (síla / délka / kvalita),
 * protože přesně tyto osy zadává uživatel — skládání výsledku pak nepotřebuje
 * žádné mapování navíc.
 *
 * Zdroj: Cheiro, Palmistry for All (1916) — viz `source` u každého významu.
 * Vytěženo z originálu, přeloženo a přeformulováno vlastními slovy, ne
 * doslovný překlad. Klasická díla (Cheiro, Benham, Dale, Markun) si u řady
 * znaků protiřečí; kde jsem na rozpor narazil, je to řečeno v textu.
 */
export const PALM_LINES: PalmLineContent[] = [
  {
    key: 'lifeLine',
    nameCs: 'Čára života',
    nameEn: 'Life Line',
    type: 'major',
    description:
      'Vede kolem paty palce nad velkou dlaňovou tepnou. Cheiro ji spojuje s vitalitou, trávením a konstitucí — ne s délkou života v doslovném smyslu, jak se lidově traduje.',
    anatomy:
      'Obepíná pahorek Venuše od hrany mezi palcem a ukazovákem směrem k zápěstí.',
    characteristics: {
      strength: {
        weak: {
          meaning:
            'Široká a mělká čára — podle Cheira svědčí spíš o svalové síle než o síle vůle, a při zátěži drží hůř než tenká hluboká čára.',
          personality:
            'Vaše odolnost je spíš tělesná než nervová. Pod dlouhodobým tlakem potřebujete skutečný odpočinek, ne jen změnu činnosti.',
          source: [cheiro('The Line of Life')],
        },
        medium: {
          meaning: 'Vyrovnaná hloubka čáry bez výrazných výkyvů.',
          personality: 'Držíte stabilní tempo a umíte odhadnout, kdy zpomalit.',
          source: [cheiro('The Line of Life')],
        },
        strong: {
          meaning:
            'Jasná, hluboká, tenká čára — podle Cheira lepší znamení než široká: svědčí o síle vůle a nervové odolnosti, která vydrží i v nemoci.',
          personality:
            'Máte přirozenou vytrvalost — ve chvílích, kdy jiné zátěž vyčerpá, vy ještě máte rezervu.',
          source: [cheiro('The Line of Life')],
        },
      },
      length: {
        short: {
          meaning:
            'Kratší čára — Cheiro dlouhou nepřerušenou čáru spojuje s vitalitou a odolností; kratší proto čte jako signál dbát na zdraví a energii spíš cíleně než počítat s nekonečnou rezervou.',
          personality: 'Energii si dávkujete cíleně — víte, že není nekonečná, a podle toho hospodaříte.',
          source: [cheiro('The Line of Life and its Variations')],
        },
        medium: {
          meaning: 'Vyvážený životní rytmus.',
          personality: 'Střídáte nasazení a odpočinek v udržitelném poměru.',
          source: [cheiro('The Line of Life and its Variations')],
        },
        long: {
          meaning:
            'Dlouhá, jasně vedená čára bez přerušení — u Cheira normální stav zdravé konstituce: „dlouhá, jasně vyznačená a bez nepravidelností či přerušení".',
          personality: 'Vytrvalost je vaše hlavní přednost — dojdete tam, kam jiní nedojdou.',
          source: [cheiro('The Line of Life and its Variations')],
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislá čára bez přerušení — Cheirovo výchozí znamení dobré konstituce.',
          personality: 'Váš život má souvislou linku bez zásadních zvratů.',
          source: [cheiro('The Line of Life and its Variations')],
        },
        broken: {
          meaning: 'Přerušení v čáře — Cheiro ho čte jako místo tělesného oslabení, ne nutně jako trvalý stav.',
          personality: 'Prošli jste obdobím, které vás zasáhlo tělesně i psychicky — a dostali jste se z něj dál.',
          source: [cheiro('The Line of Life')],
        },
        chained: {
          meaning:
            'Čára složená z drobných článků do sebe zaklesnutých jako řetěz — u Cheira jisté znamení chatrného zdraví a nízké vitality, zvlášť na měkké dlani.',
          personality: 'Zvykli jste si zdolávat odpor a to vás zocelilo — přesto věnujte pozornost tomu, jak hospodaříte se silami.',
          source: [cheiro('The Line of Life')],
        },
        island: {
          meaning: 'Ostrůvek na čáře — ohraničené oslabení v konkrétním úseku života, ne trvalá vlastnost.',
          personality: 'Máte za sebou etapu, která vás donutila zpomalit a přehodnotit priority.',
          source: [cheiro('The Line of Life')],
        },
      },
      absent: {
        meaning: 'Čára není zřetelná — vitalita se projevuje jinými znaky dlaně.',
        personality: 'Vaši energii je třeba číst spíš z pahorků než z čar.',
      },
    },
  },
  {
    key: 'headLine',
    nameCs: 'Čára hlavy',
    nameEn: 'Head Line',
    type: 'major',
    description:
      'Cheiro ji považuje za nejdůležitější čáru ze všech — „jako střelku kompasu, bez jejíhož pochopení nelze uchopit směřování člověka". Ukazuje mentalitu, ne charakter jako celek.',
    anatomy:
      'Vodorovná čára napříč středem dlaně, začíná u hrany dlaně mezi palcem a ukazovákem.',
    characteristics: {
      strength: {
        weak: {
          meaning:
            'Široká, mělká čára ležící na povrchu — podle Cheira méně soustředění a kolísavější povaha; časté u lidí, kteří rozvinuli spíš tělesnou než duševní stránku.',
          personality: 'Vaše myšlení je pružnější než hloubkové — přeskakujete mezi tématy snadněji, než se do jednoho zaboříte.',
          source: [cheiro('The Line of Head and its Variations')],
        },
        medium: {
          meaning: 'Středně výrazná čára bez extrémů v šířce ani hloubce.',
          personality: 'Kombinujete soustředění s všestranností podle potřeby situace.',
          source: [cheiro('The Line of Head and its Variations')],
        },
        strong: {
          meaning:
            'Čistě vedená, hluboká čára — podle Cheira silnější znamení mentality než čára široká. Typická pro velké „mozkové pracovníky" s jemnými, čistými čarami.',
          personality: 'Umíte se hluboce soustředit a myšlenku dotáhnout, i když to vyžaduje dlouhé nasazení.',
          source: [cheiro('The Line of Head and its Variations')],
        },
      },
      length: {
        short: {
          meaning:
            'Kratší čára nedosahující přes celou dlaň — obecná shoda klasické palmistiky (na rozdíl od síly a kvality tuhle osu Cheiro nerozvádí do detailu) čte jako soustředění na užší, konkrétní okruh zájmů.',
          personality: 'Vaše myšlení je specializované — jdete do hloubky v tom, co si vyberete, ne do šířky.',
          source: [cheiro('The Line of Head and its Variations')],
        },
        medium: {
          meaning: 'Čára střední délky.',
          personality: 'Kombinujete šíři zájmů s dostatečným zaměřením, abyste v nich byli dobří.',
          source: [cheiro('The Line of Head and its Variations')],
        },
        long: {
          meaning:
            'Čára táhnoucí se přes celou dlaň — u Cheira spojena se schopností „prosadit se přes celou hráz dlaně" k Mentálnímu Marsu, znamení silné vůle a širokého rozhledu.',
          personality: 'Máte široký rozhled a dokážete propojovat vzdálené obory — myšlení vám nezůstává v jedné škatulce.',
          source: [cheiro('The Line of Head and its Variations')],
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislá čára bez přerušení nebo vlásečnic.',
          personality: 'Vaše myšlení má jasnou, nepřerušenou linku.',
          source: [cheiro('The Line of Head and its Secondary Signs')],
        },
        broken: {
          meaning:
            'Přerušení v čáře — Cheiro ho spojuje s obdobím, kdy se mentální směřování výrazně změnilo, ne nutně se slabostí.',
          personality: 'Prošli jste obdobím, které přesměrovalo způsob, jak přemýšlíte a rozhodujete se.',
          source: [cheiro('Changes in the Line of Head')],
        },
        chained: {
          meaning:
            'Souvislý řetěz ostrůvků po celé čáře — u Cheira znamení mentální únavy, často z chatrného zdraví, které vysává soustředění.',
          personality: 'Vaše soustředění kolísá s tím, jak se cítíte celkově — péče o zdraví se vám přímo promítá do jasnosti myšlení.',
          source: [cheiro('The Line of Head and its Secondary Signs')],
        },
        island: {
          meaning:
            'Ostrůvek na čáře — Cheiro ho čte podle polohy: pod ukazovákem časná nerozhodnost, pod prostředníkem sklon k bolestem hlavy a melancholii, pod prsteníkem slabší zrak, pod malíkem mentální únava ve stáří.',
          personality: 'Máte za sebou období, které otestovalo vaše soustředění — ohraničené, ne trvalé.',
          source: [cheiro('The Line of Head and its Secondary Signs')],
        },
      },
      absent: {
        meaning: 'Čára není zřetelná — mentalita se projevuje jinými znaky dlaně.',
        personality: 'Váš způsob myšlení je třeba číst spíš z tvaru ruky a prstů než z této čáry.',
      },
    },
  },
  {
    key: 'fateLine',
    nameCs: 'Čára osudu',
    nameEn: 'Line of Destiny (Fate)',
    type: 'major',
    description:
      'Vertikální čára středem dlaně. U Cheira ukazuje hlavní události kariéry a míru, do jaké člověk řídí vlastní směřování — ne osud v absolutním smyslu.',
    anatomy:
      'Vede svisle středem dlaně od zápěstí (nebo z čáry života, pahorku Luny či středu dlaně) směrem k pahorku Saturna pod prostředníkem.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Slabě nebo stínově vyznačená čára — cesta osudu ještě není jasně vykrystalizovaná.',
          personality: 'Vaše směřování se teprve formuje — víc než u jiných záleží na volbách, které ještě uděláte.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
        medium: {
          meaning:
            'Podle Cheira ideální stav: „nemá být příliš silně vyznačená, ale jen jasná a zřetelná" — doprovázená čárou Slunce je to nejlepší možná čára osudu.',
          personality: 'Máte jasný směr, aniž byste mu byli otrokem — necháváte si prostor reagovat na okolnosti.',
          source: [cheiro('Rising from the Line of Life')],
        },
        strong: {
          meaning:
            'Velmi silně vyznačená čára bez odboček — Cheiro ji čte jako „dítě osudu spoutané k železné cestě okolností": málo pomoci zvenčí, těžko odvratitelné zkoušky.',
          personality: 'Vaše směřování je pevně dané a těžko se od něj odchýlíte — síla i past zároveň.',
          source: [cheiro('Rising from the Line of Life')],
        },
      },
      length: {
        short: {
          meaning: 'Čára objevující se až vysoko na dlani — pozdější nástup vlastního směřování, ne jeho nedostatek.',
          personality: 'Váš životní směr se vykrystalizoval později — a o to jistěji, když přišel.',
          source: [cheiro('Rising from the Middle of the Palm')],
        },
        medium: {
          meaning: 'Čára začínající ve střední části dlaně.',
          personality: 'Vaše směřování se ustálilo v přiměřené době, ne příliš brzy ani pozdě.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
        long: {
          meaning: 'Čára od zápěstí až k pahorku Saturna — nejúplnější podoba, osud patrný od raného věku.',
          personality: 'Vaše směřování je čitelné odmalička a provází vás konzistentně celý život.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
      },
      quality: {
        clear: {
          meaning: 'Jasně vedená čára bez přerušení.',
          personality: 'Vaše cesta má srozumitelnou linku — víte, kam směřujete, i když se okolnosti mění.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
        broken: {
          meaning:
            'Čára zastavená čárou hlavy nebo srdce — Cheiro to čte jako zásah vlastní nerozvážnosti (hlava), nebo špatně umístěných citů (srdce), do kariéry.',
          personality: 'Vaše směřování se přerušilo vlivem rozhodnutí nebo vztahu — ale přerušení není konec cesty.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
        chained: {
          meaning: 'Nesouvislá, zřetězená podoba čáry — osud prochází opakovanými zvraty, ne jednou přímou linkou.',
          personality: 'Vaše cesta vede oklikami — co zvenčí vypadá jako zmatek, je jen jiný způsob postupu.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
        island: {
          meaning: 'Ostrůvek na čáře — ohraničené období nejistoty nebo zdržení v kariéře.',
          personality: 'Prošli jste obdobím profesní nejistoty, které bylo dočasné, ne trvalé.',
          source: [cheiro('The Line of Destiny or Fate')],
        },
      },
      absent: {
        meaning:
          'Chybějící čára osudu podle Cheira neznamená chybějící úspěch — jen že směřování není předem dané a formuje se čistě vlastní volbou.',
        personality: 'Váš životní směr netvoří jedna zřetelná linka — utváříte si ho průběžně, krok za krokem.',
      },
    },
  },
  {
    key: 'apolloLine',
    nameCs: 'Čára Apollónova',
    nameEn: 'Line of the Sun (Apollo)',
    type: 'minor',
    description:
      'Cheiro ji nazývá čárou úspěchu nebo záře — „bez ní život nemá štěstí, žádnou záři; i největší talent zůstává potmě a nenese ovoce." Neznamená bohatství samo o sobě, ale uznání a to, co se lidově říká „štěstí".',
    anatomy: 'Svislá čára v pravé třetině dlaně, směřuje k pahorku Slunce pod prsteníkem.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Slabě vyznačená čára — talent je přítomný, ale s obtížemi hledá uznání.',
          personality: 'Vaše kvality nejsou vidět tak snadno, jak by si zasloužily — uznání si musíte budovat vytrvaleji.',
          source: [cheiro('The Line of the Sun')],
        },
        medium: {
          meaning: 'Jedna zřetelná čára — podle Cheira to nejlepší znamení, lepší než víc slabších čar najednou.',
          personality: 'Vaše úspěchy mají jasné zaměření, ne rozptýlené do mnoha směrů najednou.',
          source: [cheiro('The Line of the Sun')],
        },
        strong: {
          meaning: 'Výrazně vyznačená čára — silný magnetismus a snadnější získávání uznání a odměny.',
          personality: 'Máte přirozený vliv na druhé a snadněji získáváte uznání za to, co děláte.',
          source: [cheiro('The Line of the Sun')],
        },
      },
      length: {
        short: {
          meaning: 'Krátká čára, patrná jen na vlastním pahorku — štěstí přichází, ale pozdě a v menší míře.',
          personality: 'Uznání, které si zasloužíte, může přijít později, než byste čekali.',
          source: [cheiro('The Line of the Sun')],
        },
        medium: {
          meaning: 'Čára střední délky spojená s jednou z hlavních čar.',
          personality: 'Vaše úspěchy stavíte postupně, v návaznosti na to, co už jste vybudovali.',
          source: [cheiro('The Line of the Sun')],
        },
        long: {
          meaning: 'Dlouhá čára od čáry života nebo osudu — úspěch daný vlastním úsilím, ne náhodou.',
          personality: 'Vaše úspěchy jsou výsledkem dlouhodobé práce, ne štěstí náhody.',
          source: [cheiro('The Line of the Sun')],
        },
      },
      quality: {
        clear: {
          meaning: 'Jedna přímá, čistá čára — podle Cheira nejlepší možné znamení.',
          personality: 'Vaše silné stránky se projevují jasně a bez rozptylování.',
          source: [cheiro('The Line of the Sun')],
        },
        broken: {
          meaning: 'Přerušená čára — období, kdy uznání dočasně ustoupilo do pozadí.',
          personality: 'Prošli jste obdobím, kdy vaše úsilí nebylo tolik vidět — dočasně, ne natrvalo.',
          source: [cheiro('The Line of the Sun')],
        },
        chained: {
          meaning:
            'Více rovnoběžných čar na pahorku Slunce — víc směrů talentu, ale s rizikem, že množství záměrů zabrání skutečnému úspěchu v jednom z nich.',
          personality: 'Máte víc talentů najednou — otázkou je, jestli se soustředíte na ten, který doopravdy dotáhnete.',
          source: [cheiro('The Line of the Sun')],
        },
        island: {
          meaning:
            'Ostrůvek na čáře — podle Cheira ničí slibovanou pozici jen po dobu, kdy se objevuje, a často souvisí s veřejně známou nepříjemností.',
          personality: 'Prošli jste obdobím, kdy vaše pověst nebo pozice byla dočasně zpochybněná.',
          source: [cheiro('The Line of the Sun')],
        },
      },
      absent: {
        meaning:
          'Podle Cheira i na jinak dobře vyznačené dlani znamená úplná absence této čáry, že uznání světa přijde těžko, i když je talent přítomný.',
        personality: 'Vaše kvality možná nejsou tolik veřejně vidět — spokojenost si budujete jinde než v uznání okolí.',
      },
    },
  },
  {
    key: 'heartLine',
    nameCs: 'Čára srdce',
    nameEn: 'Heart Line',
    type: 'major',
    description:
      'Horní z velkých vodorovných čar, nad čárou hlavy — proto se podle Cheira váže spíš k mentální stránce citů než k čistě tělesné náklonnosti. Popisuje způsob, jak člověk miluje a přijímá náklonnost.',
    anatomy:
      'Vede pod prsty od strany malíku směrem k pahorku Jupitera pod ukazovákem.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Bledá, široká čára bez hloubky — Cheiro ji čte jako blazeovanost a citový odstup.',
          personality: 'K citovým vazbám přistupujete s odstupem — nenecháte se snadno citově zaplavit.',
          source: [cheiro('The Line of Heart')],
        },
        medium: {
          meaning: 'Vyrovnaná hloubka, dobře zbarvená čára.',
          personality: 'Vaše city jsou stálé, aniž by vás ovládaly.',
          source: [cheiro('The Line of Heart')],
        },
        strong: {
          meaning: 'Hluboká, čistá a dobře zbarvená čára — Cheirův ideál této čáry.',
          personality: 'Milujete naplno a vaše city mají váhu i vytrvalost.',
          source: [cheiro('The Line of Heart')],
        },
      },
      length: {
        short: {
          meaning: 'Kratší čára — méně z „vyšších citů" náklonnosti se projevuje navenek.',
          personality: 'Vaše city jsou přímočařejší, míň zabalené do idealizace.',
          source: [cheiro('The Line of Heart')],
        },
        medium: {
          meaning: 'Čára střední délky.',
          personality: 'Vaše citové vazby jsou vyvážené, bez extrémů.',
          source: [cheiro('The Line of Heart')],
        },
        long: {
          meaning: 'Neobvykle dlouhá čára — Cheiro varuje, že u ní roste sklon k žárlivosti, zvlášť ve spojení se svažující se čárou hlavy.',
          personality: 'Cítíte hluboce a intenzivně — jen si hlídejte, aby se intenzita nezvrtla v žárlivost.',
          source: [cheiro('The Line of Heart')],
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislá, jasně vedená čára.',
          personality: 'Vaše city mají jasnou, čitelnou linku.',
          source: [cheiro('The Line of Heart')],
        },
        broken: {
          meaning: 'Přerušená čára — citová rána nebo zásadní zvrat ve vztahu, ne trvalá vlastnost.',
          personality: 'Prošli jste citovým zvratem, který vás přenastavil — a unesli jste ho.',
          source: [cheiro('Rozbor jednotlivých znaků')],
        },
        chained: {
          meaning: 'Čára jako řetěz drobných oček — u Cheira znamení flirtování a citové nestálosti spíš než hluboké, trvalé náklonnosti.',
          personality: 'Vaše city jsou proměnlivější — hledáte, spíš než se hned na dlouho upnout.',
          source: [cheiro('The Line of Heart')],
        },
        island: {
          meaning: 'Ostrůvek na čáře — ohraničené období citových zmatků.',
          personality: 'Máte za sebou období citové nejistoty, které bylo dočasné.',
          source: [cheiro('The Line of Heart')],
        },
      },
      absent: {
        meaning: 'Chybějící čára srdce podle Cheira ukazuje na chladnější, méně citově vedenou povahu.',
        personality: 'Své vztahy řídíte spíš rozumem než citovým popudem.',
      },
    },
  },
  {
    key: 'mercuryLine',
    nameCs: 'Čára Merkurova',
    nameEn: 'Line of Health (Hepatica)',
    type: 'minor',
    description:
      'Cheiro ji nazývá „teploměrem života" — nejproměnlivější ze všech čar, mění se s tím, jak zdraví kolísá. Na rozdíl od ostatních čar je podle něj nejlepším znamením, když úplně chybí.',
    anatomy: 'Vychází od pahorku Merkura pod malíkem a míří napříč dlaní k čáře života.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Slabě vyznačená nebo mizející čára.',
          personality: 'Vaše nervová soustava je odolnější, než by se čekalo.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        medium: {
          meaning: 'Čára vedená rovně dolů dlaní, aniž by se dotýkala čáry života — podle Cheira nejpříznivější poloha.',
          personality: 'Konstituce možná není nejrobustnější, ale máte houževnatost a velkou zálohu odolnosti.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        strong: {
          meaning:
            'Hluboce vyznačená čára dotýkající se nebo protínající čáru života — Cheiro to čte jako varovné znamení podtékající nemoci, ne jako sílu.',
          personality: 'Vaše tělo vám dává zřetelné signály, kdy zpomalit — vyplatí se je nepřehlížet.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
      },
      length: {
        short: {
          meaning: 'Krátká čára, patrná jen v části dlaně.',
          personality: 'Období zvýšené citlivosti na zátěž se u vás projevuje jen omezeně, ne trvale.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        medium: {
          meaning: 'Čára střední délky.',
          personality: 'Vaše citlivost na životní tempo kolísá přiměřeně s okolnostmi.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        long: {
          meaning: 'Dlouhá čára táhnoucí se přes celou dlaň až k čáře života.',
          personality: 'Nervová soustava je u vás citlivým barometrem celkového stavu — všímejte si jejích signálů.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
      },
      quality: {
        clear: {
          meaning: 'Jasně vedená přímá čára.',
          personality: 'Vaše tělesné signály jsou čitelné a konzistentní.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        broken: {
          meaning: 'Přerušovaná, zkroucená nebo nažloutlá čára — Cheiro ji spojuje s trávicími potížemi.',
          personality: 'Vaše energie kolísá nárazově — všímejte si vzorců, kdy k tomu dochází.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        chained: {
          meaning: 'Nesouvislá, zřetězená podoba čáry, zvlášť ve spojení se slabou čárou života — zvýšená citlivost na zátěž.',
          personality: 'Doporučuje se věnovat pozornost odpočinku víc, než by se na první pohled zdálo nutné.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
        island: {
          meaning: 'Ostrůvek v horní části čáry — u Cheira spojen s citlivostí dýchacích cest.',
          personality: 'Máte za sebou období, kdy si tělo řeklo o zpomalení — dočasné, ne trvalé.',
          source: [cheiro('The Line of Health or the Hepatica')],
        },
      },
      absent: {
        meaning:
          'Podle Cheira je „vynikajícím znamením" čáru vůbec nemít — znamená to mimořádně odolnou konstituci a klidnou nervovou soustavu.',
        personality: 'Vaše nervová soustava je stabilní a odolná vůči zátěži — vzácné a příznivé znamení.',
      },
    },
  },
  {
    key: 'intuitionLine',
    nameCs: 'Čára intuice',
    nameEn: 'Line of Intuition',
    type: 'minor',
    description:
      'Vzácná čára, kterou Cheiro nachází hlavně na filozofických, kónických a psychických typech ruky. Znamená mimořádně citlivý temperament, tušení a intuici — v jeho zkušenosti častěji u žen, ale s výraznými výjimkami.',
    anatomy: 'Půlkruh od pahorku Merkura k pahorku Luny, nebo jen na pahorku Luny samotném.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Slabě naznačená čára.',
          personality: 'Vaše intuice se ozývá tiše — vyplatí se jí naslouchat pozorněji.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        medium: {
          meaning: 'Zřetelně, ale ne dramaticky vyznačená čára.',
          personality: 'Máte vyvinutý cit pro věci, které se nedají čistě rozumově zdůvodnit.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        strong: {
          meaning:
            'Jasně vyznačený půlkruh — Cheiro ho spojuje s mimořádnými schopnostmi: živé sny, které se naplňují, inspirovaná řeč a psaní na nejvyšší úrovni.',
          personality: 'Vaše intuice je silná a spolehlivá — bere ji vážně, i když ji nedokážete vždy racionálně zdůvodnit.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
      },
      length: {
        short: {
          meaning: 'Krátký, jasně ohraničený oblouk.',
          personality: 'Vaše intuice se projevuje v konkrétních situacích, ne jako trvalý stav.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        medium: {
          meaning: 'Oblouk střední délky.',
          personality: 'Intuici používáte jako doplněk k rozumové úvaze, ne místo ní.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        long: {
          meaning: 'Plný půlkruh od pahorku Merkura k pahorku Luny.',
          personality: 'Vaše vnímavost přesahuje běžné racionální vysvětlení — Cheiro tuhle kombinaci spojuje s neobyčejnými schopnostmi.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
      },
      quality: {
        clear: {
          meaning: 'Čistě vyznačený oblouk bez přerušení.',
          personality: 'Vaše vnitřní hlas je konzistentní a spolehlivý.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        broken: {
          meaning: 'Přerušovaný oblouk.',
          personality: 'Vaše intuice se ozývá nárazově, ne stále.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        chained: {
          meaning: 'Nesouvislá, řetězovitá podoba čáry.',
          personality: 'Vaše vnímavost kolísá s celkovým rozpoložením — v klidu je silnější.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
        island: {
          meaning: 'Ostrůvek na čáře.',
          personality: 'Prošli jste obdobím, kdy bylo těžké rozeznat intuici od úzkosti.',
          source: [cheiro('The Line of Intuition and the Via Lasciva')],
        },
      },
      absent: {
        meaning: 'Podle Cheira jde o vzácnou čáru — její nepřítomnost je běžná a neznamená nedostatek vnímavosti.',
        personality: 'Své vhledy budujete spíš zkušeností a pozorováním než náhlou intuicí.',
      },
    },
  },
  {
    key: 'venusLine',
    nameCs: 'Venušin pás',
    nameEn: 'Girdle of Venus',
    type: 'minor',
    description:
      'Cheiro výslovně odmítá časté ztotožnění s hrubou smyslností — dlaň dělí čára hlavy na tělesnou (dolní) a duševní (horní) polovinu, a Venušin pás leží v horní, takže podle něj ukazuje spíš mentální, přemýšlivý vztah k tématu smyslnosti než jednání samotné.',
    anatomy: 'Půlkruh od základny ukazováku k základně malíku, nad čárou srdce.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Slabě naznačený nebo přerušovaný pás.',
          personality: 'Téma smyslnosti a estetiky vás zajímá spíš okrajově.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        medium: {
          meaning: 'Zřetelně, ale mírně vyznačený pás.',
          personality: 'Máte vyvinutý smysl pro krásu a jemné vnímání — bez přehnané citlivosti na náladovost.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        strong: {
          meaning:
            'Výrazně vyznačený, souvislý pás — u Cheira spojen se sklonem číst a přemýšlet o vztazích a smyslnosti spíš teoreticky než je prakticky prožívat.',
          personality: 'Máte silnou vnitřní citlivost na krásu a vztahy, kterou spíš promýšlíte než impulzivně jednáte.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
      },
      length: {
        short: {
          meaning: 'Krátký, útržkovitý oblouk.',
          personality: 'Vaše citlivost na estetiku a náladu se projevuje jen v některých situacích.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        medium: {
          meaning: 'Oblouk střední délky mezi ukazovákem a malíkem.',
          personality: 'Vaše citová a estetická citlivost je vyvážená.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        long: {
          meaning: 'Plný oblouk od ukazováku až k malíku, případně přecházející z pahorku Saturna na Merkur.',
          personality: 'Vaše prožívání je intenzivní a citlivé na okolí — Cheiro u výrazné podoby varuje před sklonem k neklidným náladám.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislý, jasně vedený pás.',
          personality: 'Vaše citlivost je stálá, ne nárazová.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        broken: {
          meaning: 'Přerušovaný pás.',
          personality: 'Vaše nálady kolísají — ve chvílích klidu se to projevuje míň.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        chained: {
          meaning:
            'Pás složený z drobných článků — u Cheira spojen s hysterickým temperamentem a proměnlivými náladami, které komplikují soužití s okolím.',
          personality: 'Vaše nálady mohou být pro okolí náročné odhadnout — pojmenování si vzorce vám i jim pomůže.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
        island: {
          meaning: 'Ostrůvek na pásu.',
          personality: 'Máte za sebou období silné citové nestability, které bylo ohraničené.',
          source: [cheiro('The Girdle of Venus, the Ring of Saturn, and the Bracelets')],
        },
      },
      absent: {
        meaning: 'Chybějící Venušin pás neznamená nedostatek citlivosti — jen že se neprojevuje tímto konkrétním znakem.',
        personality: 'Vaše estetické a citové vnímání je čitelné spíš z jiných znaků dlaně.',
      },
    },
  },
]
