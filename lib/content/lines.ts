import type { PalmLineContent } from './types'

/**
 * Osm čar dlaně. Významy jsou rozepsané po osách (síla / délka / kvalita),
 * protože přesně tyto osy zadává uživatel — skládání výsledku pak nepotřebuje
 * žádné mapování navíc.
 */
export const PALM_LINES: PalmLineContent[] = [
  {
    key: 'lifeLine',
    nameCs: 'Čára života',
    nameEn: 'Life Line',
    type: 'major',
    description:
      'Nejznámější čára dlaně. Navzdory rozšířenému omylu neurčuje délku života, ale vitalitu, tělesnou konstituci a to, jak člověk hospodaří se svou energií.',
    anatomy:
      'Začíná na hraně dlaně mezi palcem a ukazovákem a obloukem obchází pahorek Venuše směrem k zápěstí.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Jemná konstituce a citlivější hospodaření s energií.',
          personality:
            'Síly si dávkujete a po vypětí potřebujete skutečný odpočinek, ne jen změnu činnosti.',
        },
        medium: {
          meaning: 'Vyrovnaná vitalita bez výrazných výkyvů.',
          personality: 'Držíte stabilní tempo a umíte odhadnout, kdy zpomalit.',
        },
        strong: {
          meaning: 'Silná tělesná konstituce a velká zásoba energie.',
          personality:
            'Máte přirozený tah na branku a snesete zátěž, která by jiné vyčerpala.',
        },
      },
      length: {
        short: {
          meaning: 'Energie soustředěná do kratších, intenzivních úseků.',
          personality: 'Dáváte přednost hloubce zážitku před jeho trváním.',
        },
        medium: {
          meaning: 'Vyvážený životní rytmus.',
          personality: 'Střídáte nasazení a odpočinek v udržitelném poměru.',
        },
        long: {
          meaning: 'Dlouhodobá výdrž a schopnost jít za cílem roky.',
          personality: 'Vytrvalost je vaše hlavní přednost — dojdete tam, kam jiní nedojdou.',
        },
      },
      quality: {
        clear: {
          meaning: 'Nepřerušený tok energie.',
          personality: 'Váš život má souvislou linku bez zásadních zvratů.',
        },
        broken: {
          meaning: 'Výrazné životní zlomy a změny směru.',
          personality: 'Prošli jste proměnami, které vás přesměrovaly — a unesli jste je.',
        },
        chained: {
          meaning: 'Opakující se překážky a období oslabení.',
          personality: 'Zvykli jste si zdolávat odpor a to vás zocelilo.',
        },
        island: {
          meaning: 'Ohraničené období útlumu nebo zdravotní zátěže.',
          personality: 'Máte za sebou etapu, která vás donutila zpomalit a přehodnotit priority.',
        },
      },
      absent: {
        meaning: 'Čára není zřetelná — vitalita se projevuje jinými znaky dlaně.',
        personality: 'Vaši energii je třeba číst spíš z pahorků než z čar.',
      },
    },
  },
  {
    key: 'heartLine',
    nameCs: 'Čára srdce',
    nameEn: 'Heart Line',
    type: 'major',
    description:
      'Horní z velkých vodorovných čar. Popisuje citový život, způsob navazování vztahů a to, jak dáváte a přijímáte náklonnost.',
    anatomy:
      'Vychází z hrany dlaně pod malíčkem a míří napříč horní částí dlaně k ukazováku.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Zdrženlivější projev citů.',
          personality: 'City prožíváte uvnitř a najevo je dáváte jen lidem, kterým věříte.',
        },
        medium: {
          meaning: 'Vyrovnaný citový život.',
          personality: 'Udržujete rovnováhu mezi srdcem a rozumem.',
        },
        strong: {
          meaning: 'Hluboké a intenzivní prožívání.',
          personality: 'Milujete naplno a vaše náklonnost je znát na první pohled.',
        },
      },
      length: {
        short: {
          meaning: 'Výběrovost ve vztazích.',
          personality: 'Blízkých lidí máte málo, zato jsou to vazby na celý život.',
        },
        medium: {
          meaning: 'Přirozená míra otevřenosti.',
          personality: 'Sbližujete se postupně a bez křečí.',
        },
        long: {
          meaning: 'Velkorysost a široký citový záběr.',
          personality: 'Staráte se o druhé a vztahy jsou pro vás těžištěm života.',
        },
      },
      quality: {
        clear: {
          meaning: 'Srozumitelný a stabilní citový život.',
          personality: 'Víte, co cítíte, a umíte to pojmenovat.',
        },
        broken: {
          meaning: 'Citové zlomy, které přenastavily vztahy.',
          personality: 'Zklamání vás naučilo rozlišovat, komu se otevřít.',
        },
        chained: {
          meaning: 'Složitější a proměnlivé citové vazby.',
          personality: 'Ve vztazích řešíte víc vrstev najednou.',
        },
        island: {
          meaning: 'Ohraničené období citového odloučení.',
          personality: 'Prošli jste časem, kdy bylo potřeba být chvíli sám se sebou.',
        },
      },
      absent: {
        meaning: 'Čára není zřetelná — city se projevují spíš přes pahorek Venuše.',
        personality: 'Náklonnost dáváte najevo činy víc než slovy.',
      },
    },
  },
  {
    key: 'headLine',
    nameCs: 'Čára hlavy',
    nameEn: 'Head Line',
    type: 'major',
    description:
      'Prostřední vodorovná čára. Ukazuje způsob myšlení, soustředění a rozhodování — nikoli inteligenci jako takovou.',
    anatomy:
      'Začíná u hrany dlaně mezi palcem a ukazovákem a vede napříč středem dlaně.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Volnější, asociativní myšlení.',
          personality: 'Nápady k vám přicházejí spíš v klidu než pod tlakem.',
        },
        medium: {
          meaning: 'Vyrovnaná schopnost soustředění.',
          personality: 'Zvládáte přepínat mezi detailem a celkem.',
        },
        strong: {
          meaning: 'Pevné soustředění a jasná analýza.',
          personality: 'Když se do něčeho zakousnete, dotáhnete to do konce.',
        },
      },
      length: {
        short: {
          meaning: 'Praktické, přímočaré myšlení.',
          personality: 'Jdete rovnou k jádru věci a nezdržujete se teorií.',
        },
        medium: {
          meaning: 'Rovnováha mezi rozvahou a rozhodností.',
          personality: 'Rozhodujete se dost rychle, ale ne unáhleně.',
        },
        long: {
          meaning: 'Sklon k důkladnému promýšlení souvislostí.',
          personality: 'Než se rozhodnete, obrátíte věc ze všech stran.',
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislé a přehledné myšlení.',
          personality: 'Držíte myšlenkovou linku a neztrácíte se v odbočkách.',
        },
        broken: {
          meaning: 'Zásadní změny v pohledu na svět.',
          personality: 'Nebojíte se přehodnotit názor, když dostanete lepší data.',
        },
        chained: {
          meaning: 'Období roztříštěné pozornosti.',
          personality: 'Potřebujete prostředí bez rušení, jinak se vaše síla ztrácí.',
        },
        island: {
          meaning: 'Ohraničené období duševního přetížení.',
          personality: 'Máte za sebou etapu, kdy toho bylo v hlavě příliš.',
        },
      },
      absent: {
        meaning: 'Čára není zřetelná — rozhodování je vedeno spíš citem.',
        personality: 'Spoléháte na první dojem a bývá dobrý.',
      },
    },
  },
  {
    key: 'fateLine',
    nameCs: 'Čára osudu',
    nameEn: 'Fate Line',
    type: 'major',
    description:
      'Svislá čára středem dlaně. Popisuje míru životního směřování — jak silně vás vede vnitřní záměr nebo vnější okolnosti.',
    anatomy: 'Stoupá od zápěstí středem dlaně vzhůru k prostředníku.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Volné směřování bez pevné dráhy.',
          personality: 'Cestu si tvoříte za pochodu a nevadí vám to.',
        },
        medium: {
          meaning: 'Jasný směr s prostorem pro odbočky.',
          personality: 'Víte, kam míříte, ale nejste na to upnutí.',
        },
        strong: {
          meaning: 'Silné a zřetelné životní směřování.',
          personality: 'Máte poslání, které vás táhne dopředu skoro samo.',
        },
      },
      length: {
        short: {
          meaning: 'Směr se vyjasnil až v určité fázi života.',
          personality: 'Své místo jste našli později — a o to jistěji.',
        },
        medium: {
          meaning: 'Postupně se upevňující dráha.',
          personality: 'Vaše cesta dává smysl zpětně víc než průběžně.',
        },
        long: {
          meaning: 'Směr patrný od raného věku.',
          personality: 'Už odmala jste tíhli k tomu, co děláte dnes.',
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislá a čitelná životní dráha.',
          personality: 'Vaše rozhodnutí na sebe navazují.',
        },
        broken: {
          meaning: 'Zásadní změny povolání nebo životní role.',
          personality: 'Umíte začít znovu a nebrat to jako prohru.',
        },
        chained: {
          meaning: 'Cesta s opakovaným odporem okolí.',
          personality: 'O své místo jste se museli přihlásit sami.',
        },
        island: {
          meaning: 'Ohraničené období tápání.',
          personality: 'Prošli jste časem, kdy nebylo jasné, kam dál.',
        },
      },
      absent: {
        meaning: 'Čára chybí — směr si určujete zcela sami.',
        personality: 'Nenecháte se vést okolnostmi, volíte si vlastní dráhu.',
      },
    },
  },
  {
    key: 'apolloLine',
    nameCs: 'Čára Apollónova',
    nameEn: 'Apollo Line',
    type: 'minor',
    description:
      'Svislá čára pod prsteníkem. Vypovídá o tvořivosti, sebevyjádření a o tom, nakolik je vaše práce vidět.',
    anatomy: 'Stoupá od spodní části dlaně vzhůru k prsteníku.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Tvořivost zatím čeká na svůj prostor.',
          personality: 'Talent máte, jen jste ho ještě nepostavili do světla.',
        },
        medium: {
          meaning: 'Zdravá míra tvořivosti.',
          personality: 'Umíte věci dělat po svém, aniž byste na to upozorňovali.',
        },
        strong: {
          meaning: 'Výrazný tvůrčí talent a přirozené uznání okolí.',
          personality: 'Vaše práce mluví za vás.',
        },
      },
      length: {
        short: {
          meaning: 'Tvořivost soustředěná do konkrétní oblasti.',
          personality: 'Nerozptylujete se, máte své pole.',
        },
        medium: {
          meaning: 'Vyvážené tvůrčí projevy.',
          personality: 'Tvoření je součástí života, ne jeho jediným obsahem.',
        },
        long: {
          meaning: 'Tvořivost prostupující celý život.',
          personality: 'Bez tvoření byste se necítili sami sebou.',
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislý tvůrčí projev.',
          personality: 'Máte rozpoznatelný osobní rukopis.',
        },
        broken: {
          meaning: 'Střídání tvůrčích období a útlumů.',
          personality: 'Tvoříte ve vlnách a je to pro vás přirozené.',
        },
        chained: {
          meaning: 'Tvořivost narážející na okolnosti.',
          personality: 'O prostor pro svou práci se musíte hlásit.',
        },
        island: {
          meaning: 'Ohraničené období tvůrčího bloku.',
          personality: 'Zažili jste čas, kdy se nedařilo nic dokončit.',
        },
      },
      absent: {
        meaning: 'Čára chybí — talent se projevuje mimo veřejnou rovinu.',
        personality: 'Tvoříte pro sebe, ne pro publikum.',
      },
    },
  },
  {
    key: 'mercuryLine',
    nameCs: 'Čára Merkurova',
    nameEn: 'Mercury Line',
    type: 'minor',
    description:
      'Svislá čára pod malíčkem. Souvisí s komunikací, obchodním citem a také s tím, jak tělo reaguje na stres.',
    anatomy: 'Stoupá od spodní části dlaně vzhůru k malíčku.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Komunikace není hlavní nástroj.',
          personality: 'Raději ukážete výsledek, než abyste ho popisovali.',
        },
        medium: {
          meaning: 'Dobrá schopnost domluvy.',
          personality: 'Vyjednáte, co potřebujete, bez zbytečného tlaku.',
        },
        strong: {
          meaning: 'Výrazný dar řeči a obchodní cit.',
          personality: 'Umíte přesvědčit a lidé vám naslouchají.',
        },
      },
      length: {
        short: {
          meaning: 'Stručnost a věcnost.',
          personality: 'Řeknete to podstatné a končíte.',
        },
        medium: {
          meaning: 'Vyvážený projev.',
          personality: 'Přizpůsobíte styl posluchači.',
        },
        long: {
          meaning: 'Široký komunikační záběr.',
          personality: 'Domluvíte se prakticky s kýmkoli.',
        },
      },
      quality: {
        clear: {
          meaning: 'Srozumitelné a přímé vyjadřování.',
          personality: 'Nenecháváte prostor pro nedorozumění.',
        },
        broken: {
          meaning: 'Období komunikačních nedorozumění.',
          personality: 'Naučili jste se ověřovat, že vám bylo rozuměno.',
        },
        chained: {
          meaning: 'Napětí mezi tím, co cítíte a co říkáte.',
          personality: 'Slova volíte opatrně, někdy až příliš.',
        },
        island: {
          meaning: 'Ohraničené období zvýšeného stresu.',
          personality: 'Máte za sebou etapu, kdy se napětí projevilo i tělesně.',
        },
      },
      absent: {
        meaning: 'Čára chybí — sdělování probíhá jinými cestami.',
        personality: 'Jste spíš pozorovatel než vypravěč.',
      },
    },
  },
  {
    key: 'intuitionLine',
    nameCs: 'Čára intuice',
    nameEn: 'Intuition Line',
    type: 'minor',
    description:
      'Obloučková čára při vnější hraně dlaně. Popisuje vnímavost, tušení a citlivost na atmosféru.',
    anatomy: 'Vychází od zápěstí a obloukem stoupá podél vnější hrany dlaně.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Rozhodování stojí spíš na faktech.',
          personality: 'Věříte tomu, co si můžete ověřit.',
        },
        medium: {
          meaning: 'Rozum a tušení v rovnováze.',
          personality: 'Intuici berete jako vodítko, ne jako důkaz.',
        },
        strong: {
          meaning: 'Silná vnímavost a přesná tušení.',
          personality: 'Náladu v místnosti přečtete dřív, než někdo promluví.',
        },
      },
      length: {
        short: {
          meaning: 'Tušení se objevuje v konkrétních situacích.',
          personality: 'Intuice se u vás zapíná, když jde o hodně.',
        },
        medium: {
          meaning: 'Vyrovnaná vnímavost.',
          personality: 'Signály zachytíte, ale nenecháte se jimi řídit.',
        },
        long: {
          meaning: 'Vnímavost jako trvalý rys.',
          personality: 'Prostředí vás ovlivňuje víc, než si připouštíte.',
        },
      },
      quality: {
        clear: {
          meaning: 'Spolehlivé a čitelné tušení.',
          personality: 'Svému prvnímu dojmu můžete věřit.',
        },
        broken: {
          meaning: 'Kolísavá důvěra ve vlastní úsudek.',
          personality: 'Někdy si svá tušení rozmluvíte — a pak jich litujete.',
        },
        chained: {
          meaning: 'Vnímavost, která zatěžuje.',
          personality: 'Nasáváte nálady druhých a stojí vás to energii.',
        },
        island: {
          meaning: 'Ohraničené období zahlcení podněty.',
          personality: 'Zažili jste čas, kdy bylo všeho kolem příliš.',
        },
      },
      absent: {
        meaning: 'Čára chybí — orientace stojí na zkušenosti a rozvaze.',
        personality: 'Spoléháte na to, co znáte a co jste si ověřili.',
      },
    },
  },
  {
    key: 'venusLine',
    nameCs: 'Venušin pás',
    nameEn: 'Girdle of Venus',
    type: 'minor',
    description:
      'Obloučková čára nad čárou srdce. Souvisí s citlivostí, vnímáním krásy a intenzitou prožívání.',
    anatomy: 'Tvoří oblouk mezi ukazovákem a malíčkem nad čárou srdce.',
    characteristics: {
      strength: {
        weak: {
          meaning: 'Klidné a vyrovnané prožívání.',
          personality: 'Nenecháte se snadno rozhodit.',
        },
        medium: {
          meaning: 'Zdravá citlivost.',
          personality: 'Vnímáte jemné odstíny, ale zůstáváte při zemi.',
        },
        strong: {
          meaning: 'Vysoká citlivost a intenzivní prožitky.',
          personality: 'Krásu i nespravedlnost vnímáte silněji než ostatní.',
        },
      },
      length: {
        short: {
          meaning: 'Citlivost soustředěná do vybraných oblastí.',
          personality: 'Máte témata, která se vás dotýkají osobně.',
        },
        medium: {
          meaning: 'Vyvážená míra vnímavosti.',
          personality: 'Umíte se dojmout, aniž byste se ztratili.',
        },
        long: {
          meaning: 'Široce rozprostřená citlivost.',
          personality: 'Prožíváte naplno a málokdy vlažně.',
        },
      },
      quality: {
        clear: {
          meaning: 'Souvislá, zvládnutá citlivost.',
          personality: 'Své prožívání máte pod kontrolou.',
        },
        broken: {
          meaning: 'Kolísání mezi otevřeností a uzavřením.',
          personality: 'Střídáte období, kdy se otevřete, a kdy se stáhnete.',
        },
        chained: {
          meaning: 'Citlivost provázená neklidem.',
          personality: 'Vnitřní napětí patří k vaší povaze.',
        },
        island: {
          meaning: 'Ohraničené období citového přetížení.',
          personality: 'Máte za sebou etapu, kdy toho bylo na vás moc.',
        },
      },
      absent: {
        meaning: 'Pás chybí — prožívání je věcné a klidné.',
        personality: 'Emoce vás neovládají, spíš je pozorujete.',
      },
    },
  },
]
