import type { InterpretationContent } from './types'
import { cheiro } from './sources'

/**
 * Vícefaktorové kombinace. Interpretace je použitelná jen tehdy, když sedí
 * *všechna* uvedená kritéria — proto jsou psané cíleně, ne kombinatoricky.
 * Vstupy, na které tu kombinace není, pokrývá skládání z jednotlivých významů
 * čar a pahorků (viz `lib/analysis/palmReader.ts`).
 *
 * ZÁKLADNÍ VRSTVA JEN NA TYP RUKY je první v pořadí a je záměrná. Dokud
 * neexistovala, neměla žádná ze zdejších kombinací kritérium splnitelné
 * bez nalezené čáry nebo pahorku — takže když detekce z fotky nenašla nic
 * (běžný případ u horšího snímku), vyšlo „nalezeno 0 kombinací" a jistota
 * spadla na 0,29, i když byl typ ruky rozpoznaný správně. Tyhle položky
 * mají nízkou `confidence`, takže konkrétnější kombinace přebijí vždycky —
 * slouží jen jako dno, ne jako výklad na úkor přesnějšího.
 */
export const INTERPRETATIONS: InterpretationContent[] = [
  // ---------- Základní vrstva: jen typ ruky ----------
  {
    criteria: { handType: 'earth' },
    personality:
      'Váš přístup ke světu stojí na tom, co se dá ověřit a osahat. Nová věc si u vás musí zásluhy nejdřív odpracovat — a když si je odpracuje, držíte se jí pak spolehlivěji než většina lidí.',
    strengths: ['Spolehlivost v dlouhém běhu', 'Odolnost vůči tlaku', 'Smysl pro to, co funguje'],
    challenges: ['Odmítnutí věci dřív, než ji zkusíte', 'Nesdělená únava'],
    guidance:
      'Vaše síla je ve vytrvalosti, a právě proto vás okolí snadno přetíží. Hranici si musíte pojmenovat sami — nikdo ji za vás neuhlídá.',
    school: 'classical',
    confidence: 0.55,
    tags: ['praktičnost', 'stabilita'],
    source: [cheiro('The Square Type')],
  },
  {
    criteria: { handType: 'fire' },
    personality:
      'Energie u vás přichází v návalech a chce ven hned. Nejlíp vám je, když se něco rozjíždí — a nejhůř, když se čeká na povolení.',
    strengths: ['Rychlý start', 'Strhnutí ostatních', 'Odvaha do nejistého'],
    challenges: ['Ztráta zájmu po rozjezdu', 'Netrpělivost s pomalejšími'],
    guidance:
      'Rozjet věc umíte líp než dokončit. Nejvíc získáte tím, že si k sobě najdete někoho, koho baví přesně ta druhá půlka.',
    school: 'classical',
    confidence: 0.55,
    tags: ['energie', 'iniciativa'],
    source: [cheiro('The Spatulate Hand')],
  },
  {
    criteria: { handType: 'air' },
    personality:
      'Věcem potřebujete rozumět dřív, než je uděláte — a to platí i o vlastních pocitech. Odstup, který si tím držíte, je vaše výhoda i to, co vás občas připraví o bezprostřednost.',
    strengths: ['Jasné pojmenování', 'Nadhled v napětí', 'Chuť jít do hloubky'],
    challenges: ['Analýza místa jednání', 'Kritičnost k sobě i druhým'],
    guidance:
      'Ne všechno se dá promyslet dopředu. Někdy je pochopení až na druhé straně rozhodnutí, ne před ním.',
    school: 'classical',
    confidence: 0.55,
    tags: ['myšlení', 'nadhled'],
    source: [cheiro('The Philosophic Hand')],
  },
  {
    criteria: { handType: 'water' },
    personality:
      'Náladu prostředí vnímáte dřív a silněji než většina lidí kolem — často dřív, než si to stihnete vysvětlit. Je to zdroj vaší vnímavosti i vaší únavy.',
    strengths: ['Cit pro atmosféru', 'Vcítění bez vysvětlování', 'Tvořivost'],
    challenges: ['Přebírání cizích nálad', 'Zranitelnost vůči tvrdšímu jednání'],
    guidance:
      'Ne každý pocit, který ve vás vznikne, je váš. Rozlišit, co jste přijali od okolí, je u vás praktická dovednost, ne filozofie.',
    school: 'classical',
    confidence: 0.55,
    tags: ['citlivost', 'tvořivost'],
    source: [cheiro('The Conic or Artistic Hand')],
  },
  {
    criteria: { handType: 'mixed' },
    personality:
      'Nezapadáte čistě do jedné škatulky a je to na vás vidět — umíte se bavit s kýmkoliv o čemkoliv. Cenou za ten záběr bývá otázka, čemu se vlastně věnovat naplno.',
    strengths: ['Široký rozhled', 'Přizpůsobivost', 'Role prostředníka'],
    challenges: ['Roztříštěnost', 'Odkládané rozhodnutí o směru'],
    guidance:
      'Všestrannost není nedostatek zaměření. Ale jednu věc dotaženou do konce vám nikdo nenahradí — vyberte si ji vědomě, ne až zbyde čas.',
    school: 'classical',
    confidence: 0.55,
    tags: ['všestrannost', 'hledání směru'],
    source: [cheiro('The Mixed Hand')],
  },

  // ---------- Ruka Země ----------
  {
    criteria: { handType: 'earth', lines: { lifeLine: 'strong' } },
    personality:
      'Spojení praktické povahy se silnou tělesnou konstitucí. Jste člověk, na kterého se dá spolehnout i tehdy, když ostatním dojdou síly — vaše energie je vytrvalá spíš než výbušná.',
    strengths: ['Mimořádná výdrž', 'Spolehlivost v zátěži', 'Klidná síla'],
    challenges: ['Přetěžování sebe sama', 'Neochota požádat o pomoc'],
    guidance:
      'Vaše výdrž svádí k tomu nést víc, než je zdrávo. Odpočinek si plánujte stejně vědomě jako práci.',
    school: 'classical',
    confidence: 0.88,
    tags: ['vitalita', 'stabilita'],
  },
  {
    criteria: { handType: 'earth', lines: { headLine: 'strong' } },
    personality:
      'Praktické myšlení podložené pevným soustředěním. Nezajímají vás efektní teorie — chcete vědět, co obstojí v praxi, a to si ověříte sami.',
    strengths: ['Věcný úsudek', 'Soustředění', 'Odolnost vůči módním trendům'],
    challenges: ['Odmítání nevyzkoušeného', 'Podceňování intuice'],
    guidance:
      'Občas dejte šanci řešení, které zatím nemá důkaz. Ne všechno ověřené bylo ověřené odjakživa.',
    school: 'classical',
    confidence: 0.85,
    tags: ['myšlení', 'praktičnost'],
  },
  {
    criteria: { handType: 'earth', lines: { heartLine: 'strong' } },
    personality:
      'Pod věcným povrchem se skrývá hluboká citová vazba k blízkým. Své pocity nevykřikujete — projevujete je tím, co pro druhé uděláte.',
    strengths: ['Věrnost', 'Péče činem', 'Citová stálost'],
    challenges: ['Nevyslovené city', 'Očekávání, že druzí pochopí bez slov'],
    guidance:
      'To, co je pro vás samozřejmé, druzí nemusí vidět. Občas své city řekněte nahlas.',
    school: 'classical',
    confidence: 0.84,
    tags: ['vztahy', 'stálost'],
  },
  {
    criteria: { handType: 'earth', lines: { fateLine: 'strong' } },
    personality:
      'Jasně vymezená životní dráha, po které jdete krok za krokem. Nepotřebujete zkratky — víte, že se poctivá cesta vyplatí.',
    strengths: ['Cílevědomost', 'Systematičnost', 'Dlouhodobá stavba'],
    challenges: ['Neochota změnit směr', 'Přehlížení příležitostí mimo plán'],
    guidance:
      'Jednou za čas se zastavte a ověřte, že cíl, ke kterému jdete, je pořád ten váš.',
    school: 'classical',
    confidence: 0.86,
    tags: ['směřování', 'kázeň'],
  },

  // ---------- Ruka Ohně ----------
  {
    criteria: { handType: 'fire', lines: { lifeLine: 'strong' } },
    personality:
      'Výbušná energie spojená s pevným zdravím. Vydržíte tempo, které ostatní vyčerpá, a nudu snášíte hůř než námahu.',
    strengths: ['Vysoké nasazení', 'Rychlá regenerace', 'Nakažlivé nadšení'],
    challenges: ['Vyhoření z přepálení', 'Netrpělivost'],
    guidance:
      'Vaše síla není v tom, jak rychle vyrazíte, ale zda dorazíte. Naučte se úmyslně zpomalovat.',
    school: 'classical',
    confidence: 0.87,
    tags: ['energie', 'tempo'],
  },
  {
    criteria: { handType: 'fire', lines: { heartLine: 'strong' } },
    personality:
      'Vášnivá povaha, která miluje naplno a naplno i prožívá zklamání. Vaše city jsou hned vidět a jsou upřímné.',
    strengths: ['Otevřenost', 'Vřelost', 'Schopnost nadchnout druhé'],
    challenges: ['Prudké reakce', 'Rychlé vzplanutí i vychladnutí'],
    guidance:
      'Mezi pocit a reakci vložte krátkou pauzu. Ušetří vám to omluvy.',
    school: 'classical',
    confidence: 0.86,
    tags: ['vztahy', 'vášeň'],
  },
  {
    criteria: { handType: 'fire', lines: { fateLine: 'strong' } },
    personality:
      'Silné vnitřní směřování v kombinaci s energií ho prosadit. Když se pro něco rozhodnete, málokdo vás zastaví.',
    strengths: ['Průbojnost', 'Schopnost strhnout ostatní', 'Rozhodnost'],
    challenges: ['Přehlížení názorů okolí', 'Riskantní tempo'],
    guidance:
      'Vaše rychlost je přednost jen tehdy, když míříte správným směrem. Ověřujte cíl častěji než tempo.',
    school: 'classical',
    confidence: 0.85,
    tags: ['vedení', 'směřování'],
  },
  {
    criteria: { handType: 'fire', lines: { apolloLine: 'strong' } },
    personality:
      'Tvořivá energie, která potřebuje publikum. Vaše práce má šťávu a je na ní vidět, kdo ji dělal.',
    strengths: ['Výrazný osobní rukopis', 'Odvaha ukázat výsledek', 'Tvůrčí tempo'],
    challenges: ['Závislost na uznání', 'Ztráta zájmu po prvním úspěchu'],
    guidance:
      'Dokončujte i to, co už vás přestalo bavit. Právě tam se pozná řemeslo.',
    school: 'modern',
    confidence: 0.8,
    tags: ['tvořivost', 'sebevyjádření'],
  },

  // ---------- Ruka Vzduchu ----------
  {
    criteria: { handType: 'air', lines: { headLine: 'strong' } },
    personality:
      'Bystrá analytická mysl s pevným soustředěním. Rozebrat složitý problém na části je pro vás potěšení, ne práce.',
    strengths: ['Analytická síla', 'Jasné vyjadřování', 'Rychlé chápání'],
    challenges: ['Přemýšlení místo jednání', 'Chladný odstup od lidí'],
    guidance:
      'Ne každé rozhodnutí se dá promyslet do konce. Někdy je lepší dobrý krok teď než dokonalý za měsíc.',
    school: 'classical',
    confidence: 0.89,
    tags: ['myšlení', 'analýza'],
  },
  {
    criteria: { handType: 'air', lines: { mercuryLine: 'strong' } },
    personality:
      'Přirozený vypravěč a vyjednavač. Myšlenku umíte podat tak, že jí porozumí i ten, kdo o téma nestál.',
    strengths: ['Přesvědčivost', 'Obchodní cit', 'Schopnost vysvětlit složité'],
    challenges: ['Přeargumentování', 'Řeč místo činu'],
    guidance:
      'Vaše slova otevírají dveře — dbejte, aby za nimi bylo co ukázat.',
    school: 'classical',
    confidence: 0.86,
    tags: ['komunikace', 'jednání'],
  },
  {
    criteria: { handType: 'air', lines: { headLine: 'strong', heartLine: 'weak' } },
    personality:
      'Rozum jasně vede nad citem. Rozhodujete se podle argumentů a osobní zaujetí spíš potlačujete, než abyste ho brali v potaz.',
    strengths: ['Nestrannost', 'Odolnost vůči manipulaci', 'Chladná hlava v krizi'],
    challenges: ['Přehlížení citové stránky věci', 'Působení chladu na okolí'],
    guidance:
      'Data nejsou celý obrázek. Ptejte se i na to, jak se u toho lidé cítí — je to také informace.',
    school: 'classical',
    confidence: 0.82,
    tags: ['rozum', 'odstup'],
  },

  // ---------- Ruka Vody ----------
  {
    criteria: { handType: 'water', lines: { heartLine: 'strong' } },
    personality:
      'Hluboké prožívání spojené s vnímavostí k druhým. Cítíte za sebe i za ostatní a nálady kolem vás vás skutečně ovlivňují.',
    strengths: ['Empatie', 'Citová hloubka', 'Schopnost utěšit'],
    challenges: ['Přebírání cizích problémů', 'Vyčerpání z péče o druhé'],
    guidance:
      'Soucit bez hranic vede k vyhoření. Starost o sebe není sobectví, ale podmínka.',
    school: 'classical',
    confidence: 0.89,
    tags: ['empatie', 'prožívání'],
  },
  {
    criteria: { handType: 'water', lines: { intuitionLine: 'strong' } },
    personality:
      'Mimořádná vnímavost. Atmosféru v místnosti přečtete dřív, než kdokoli promluví, a vaše první dojmy bývají přesné.',
    strengths: ['Přesná tušení', 'Cit pro lidi', 'Vnímání nevyslovených signálů'],
    challenges: ['Zahlcení podněty', 'Nedůvěra k vlastnímu úsudku'],
    guidance:
      'Svým tušením věřte víc — a zároveň si k nim hledejte doklad. Kombinace obojího je vaše síla.',
    school: 'modern',
    confidence: 0.83,
    tags: ['intuice', 'vnímavost'],
  },
  {
    criteria: { handType: 'water', lines: { apolloLine: 'strong' } },
    personality:
      'Tvořivost živená vnitřním světem. Tvoříte z prožitku, ne z kalkulu, a je to na výsledku znát.',
    strengths: ['Původnost', 'Citová hloubka díla', 'Cit pro atmosféru'],
    challenges: ['Závislost na náladě', 'Nedokončené projekty'],
    guidance:
      'Nečekejte na inspiraci. Pravidelný režim vaši tvořivost neomezí, spíš ji podrží v období útlumu.',
    school: 'modern',
    confidence: 0.81,
    tags: ['tvořivost', 'citlivost'],
  },

  // ---------- Smíšená ruka ----------
  {
    criteria: { handType: 'mixed', lines: { headLine: 'strong' } },
    personality:
      'Všestrannost vedená jasnou hlavou. Přepínáte mezi obory a rolemi snadno, protože si v každém rychle najdete strukturu.',
    strengths: ['Rychlé učení', 'Široký rozhled', 'Schopnost propojovat obory'],
    challenges: ['Roztříštěnost', 'Obtížná volba jedné cesty'],
    guidance:
      'Vaše šíře je výhoda jen s kotvou. Zvolte si jednu oblast, ve které chcete být opravdu dobří.',
    school: 'modern',
    confidence: 0.8,
    tags: ['všestrannost', 'myšlení'],
  },
  {
    criteria: { handType: 'mixed', lines: { fateLine: 'weak' } },
    personality:
      'Život bez předepsané dráhy. Směr měníte podle toho, co dává smysl teď — a bere vám to jistotu, kterou jiní mají zadarmo.',
    strengths: ['Svoboda volby', 'Otevřenost příležitostem', 'Nezávislost'],
    challenges: ['Pocit, že nikam nepatříte', 'Odkládání závazků'],
    guidance:
      'Absence pevné dráhy není nedostatek. Zkuste si vlastní směr jednou za rok vědomě pojmenovat.',
    school: 'modern',
    confidence: 0.76,
    tags: ['svoboda', 'hledání'],
  },

  // ---------- Kombinace čára + čára ----------
  {
    criteria: { lines: { headLine: 'strong', heartLine: 'strong' } },
    personality:
      'Vzácná rovnováha rozumu a citu. Umíte rozhodovat s chladnou hlavou, aniž byste ztratili ohled na lidi kolem.',
    strengths: ['Vyvážený úsudek', 'Důvěryhodnost', 'Schopnost mediace'],
    challenges: ['Vnitřní rozpor mezi hlavou a srdcem', 'Zdlouhavé rozhodování'],
    guidance:
      'Když se hlava a srdce neshodnou, pojmenujte, o co každé z nich usiluje. Spor bývá řešitelný.',
    school: 'classical',
    confidence: 0.87,
    tags: ['rovnováha', 'rozhodování'],
  },
  {
    criteria: { lines: { lifeLine: 'weak', headLine: 'strong' } },
    personality:
      'Duševní síla převažuje nad tělesnou. Vaše energie jde do myšlení a soustředění, na fyzickou zátěž jí zbývá méně.',
    strengths: ['Vytrvalé soustředění', 'Práce s abstraktním', 'Trpělivost s detailem'],
    challenges: ['Podceňování tělesných potřeb', 'Vyčerpání z duševní práce'],
    guidance:
      'Hlava potřebuje tělo v pořádku. Pohyb pro vás není ztráta času, ale palivo.',
    school: 'classical',
    confidence: 0.83,
    tags: ['duševno', 'energie'],
  },
  {
    criteria: { lines: { fateLine: 'strong', headLine: 'strong' } },
    personality:
      'Jasný cíl a promyšlená cesta k němu. Nejdete za tím, co se nabízí, ale za tím, co jste si rozmysleli.',
    strengths: ['Strategické myšlení', 'Důslednost', 'Odolnost vůči rozptýlení'],
    challenges: ['Rigidita plánu', 'Obtížné přijetí náhody'],
    guidance:
      'Nejlepší plán je ten, který počítá se svou vlastní změnou. Nechte v něm místo pro neznámé.',
    school: 'classical',
    confidence: 0.85,
    tags: ['strategie', 'směřování'],
  },
  {
    criteria: { lines: { heartLine: 'strong', intuitionLine: 'strong' } },
    personality:
      'Cit a tušení jdou ruku v ruce. Lidem rozumíte na úrovni, kterou těžko vysvětlíte, a málokdy se v nich mýlíte.',
    strengths: ['Porozumění lidem', 'Přirozená důvěryhodnost', 'Cit pro načasování'],
    challenges: ['Přejímání cizích nálad', 'Obtížné odlišení svého a cizího'],
    guidance:
      'Ptejte se sami sebe, čí pocit to vlastně je. Ne všechno, co cítíte, patří vám.',
    school: 'modern',
    confidence: 0.82,
    tags: ['empatie', 'intuice'],
  },
  {
    criteria: { lines: { lifeLine: 'strong', fateLine: 'strong' } },
    personality:
      'Energie i směr pohromadě. Máte sílu jít za svým a zároveň víte, kam. To je kombinace, která obvykle někam dojde.',
    strengths: ['Průbojnost', 'Výdrž na dlouhou trať', 'Vnitřní motivace'],
    challenges: ['Nezastavitelnost i tam, kde by se hodilo couvnout', 'Přehlížení únavy'],
    guidance:
      'Umět přestat je stejná dovednost jako umět vydržet. Trénujte obojí.',
    school: 'classical',
    confidence: 0.86,
    tags: ['vitalita', 'směřování'],
  },
  {
    criteria: { lines: { mercuryLine: 'strong', apolloLine: 'strong' } },
    personality:
      'Umíte tvořit i o tom mluvit. Spojení, které z talentu dělá řemeslo s dosahem — vaše práce se k lidem dostane.',
    strengths: ['Sebeprezentace', 'Tvořivost s dosahem', 'Cit pro publikum'],
    challenges: ['Forma nad obsahem', 'Tvorba na efekt'],
    guidance:
      'Hlídejte si, aby obal nepředběhl obsah. Nejlepší prezentace je dobrá práce.',
    school: 'modern',
    confidence: 0.79,
    tags: ['tvořivost', 'komunikace'],
  },

  // ---------- Kombinace typ ruky + pahorek ----------
  {
    criteria: { handType: 'earth', mounts: { venus: 'large' } },
    personality:
      'Praktická povaha s nečekaně velkou vřelostí. Působíte věcně, ale doma a mezi svými jste ten, kdo drží pohromadě celou skupinu.',
    strengths: ['Pohostinnost', 'Tělesná vitalita', 'Věrnost blízkým'],
    challenges: ['Přílišná ochranitelskost', 'Obtížné pouštění blízkých dál'],
    guidance:
      'Vaše péče je dar, dokud v ní zůstává druhému prostor. Ptejte se, co skutečně potřebuje.',
    school: 'classical',
    confidence: 0.82,
    tags: ['vřelost', 'zázemí'],
  },
  {
    criteria: { handType: 'fire', mounts: { jupiter: 'large' } },
    personality:
      'Silná ctižádost podpořená energií ji naplnit. Přirozeně se dostáváte do čela a ostatní vás tam většinou chtějí.',
    strengths: ['Vůdčí schopnosti', 'Sebedůvěra', 'Schopnost rozhodnout'],
    challenges: ['Přehlížení druhých', 'Potřeba mít navrch'],
    guidance:
      'Vedení není o tom být první, ale o tom, aby skupina došla dál. Občas dejte prostor někomu jinému.',
    school: 'classical',
    confidence: 0.85,
    tags: ['vedení', 'ctižádost'],
  },
  {
    criteria: { handType: 'water', mounts: { luna: 'large' } },
    personality:
      'Bohatý vnitřní svět a představivost, která má vlastní život. Nápady k vám přicházejí v obrazech a vy jim rozumíte dřív, než je stihnete pojmenovat.',
    strengths: ['Tvořivá představivost', 'Hluboký vnitřní život', 'Původní pohled'],
    challenges: ['Únik do fantazie', 'Obtížný návrat k praktickým věcem'],
    guidance:
      'Své představy nechávejte dopadnout do konkrétní podoby. Jinak zůstanou jen vaše.',
    school: 'classical',
    confidence: 0.84,
    tags: ['představivost', 'vnitřní svět'],
  },
  {
    criteria: { handType: 'air', mounts: { mercury: 'large' } },
    personality:
      'Myšlení a řeč v dokonalé souhře. V jednání jste ve svém živlu — rychle chápete a stejně rychle formulujete.',
    strengths: ['Pohotovost', 'Vyjednávání', 'Schopnost vysvětlit cokoli'],
    challenges: ['Ukecání protistrany', 'Nedostatek trpělivosti s pomalejšími'],
    guidance:
      'Rychlost není vždy výhoda. Nechte druhé domyslet, i když už víte, kam míří.',
    school: 'classical',
    confidence: 0.84,
    tags: ['komunikace', 'bystrost'],
  },
  {
    criteria: { mounts: { saturn: 'large', jupiter: 'small' } },
    personality:
      'Silný smysl pro povinnost bez touhy po viditelnosti. Odvádíte poctivou práci a nepotřebujete, aby vás za ni někdo chválil.',
    strengths: ['Spolehlivost', 'Sebekázeň', 'Pokora'],
    challenges: ['Přehlédnutelnost', 'Braní odpovědnosti za druhé'],
    guidance:
      'Vaše práce si zaslouží být vidět. Přihlásit se o uznání není chlubení.',
    school: 'classical',
    confidence: 0.79,
    tags: ['odpovědnost', 'skromnost'],
  },
  {
    criteria: { mounts: { marsUpper: 'large', marsLower: 'small' } },
    personality:
      'Odolnost bez bojovnosti. Vydržíte dlouhý tlak, ale do přímého střetu se nehrnete — a to lidé někdy zaměňují za slabost.',
    strengths: ['Trpělivost', 'Klid v krizi', 'Vytrvalost'],
    challenges: ['Nevyslovené hranice', 'Snášení víc, než je zdrávo'],
    guidance:
      'Vydržet a nechat si to líbit není totéž. Hranici řekněte dřív, než ji někdo překročí.',
    school: 'classical',
    confidence: 0.81,
    tags: ['odolnost', 'hranice'],
  },
  {
    criteria: { mounts: { venus: 'small', luna: 'large' } },
    personality:
      'Vnitřní život je bohatší než ten společenský. Čerpáte spíš z představ a myšlenek než z kontaktu s lidmi.',
    strengths: ['Soběstačnost', 'Představivost', 'Schopnost být sám'],
    challenges: ['Odtažitost', 'Odkládání blízkosti'],
    guidance:
      'Samota je vaše síla, dokud si ji volíte. Ověřujte, že to není únik.',
    school: 'modern',
    confidence: 0.77,
    tags: ['samota', 'představivost'],
  },
  {
    criteria: { handType: 'earth', mounts: { saturn: 'large' } },
    personality:
      'Praktičnost spojená s pevnou kázní. Jste ten, kdo dokončí, co ostatní opustili — bez řečí a bez okolků.',
    strengths: ['Vytrvalost', 'Poctivost', 'Schopnost dotáhnout věci'],
    challenges: ['Tvrdost na sebe', 'Přílišná vážnost'],
    guidance:
      'Nároky, které kladete na sebe, by od vás nikdo jiný nečekal. Ubrat není selhání.',
    school: 'classical',
    confidence: 0.83,
    tags: ['kázeň', 'poctivost'],
  },
  {
    criteria: { handType: 'fire', mounts: { marsLower: 'large' } },
    personality:
      'Energie a průbojnost v jednom. Do konfliktu jdete přímo a rychle — což vás dostane dál, ale někdy i tam, kam jste nechtěli.',
    strengths: ['Odvaha', 'Rozhodnost', 'Schopnost prosadit se'],
    challenges: ['Zbytečné střety', 'Prudké reakce'],
    guidance:
      'Ptejte se, jestli je střet potřeba, nebo jen dostupný. Rozdíl je zásadní.',
    school: 'classical',
    confidence: 0.82,
    tags: ['odvaha', 'konflikt'],
  },
  {
    criteria: { handType: 'air', mounts: { luna: 'large' } },
    personality:
      'Analytická mysl s bohatou představivostí. Umíte promyslet i to, co ještě neexistuje — a proto vidíte možnosti, které ostatním unikají.',
    strengths: ['Původní nápady', 'Schopnost domyslet důsledky', 'Pohled dopředu'],
    challenges: ['Ztrácení se v možnostech', 'Odkládání volby'],
    guidance:
      'Nápadů máte dost. Vyberte jeden a doveďte ho do konce — zbytek počká.',
    school: 'modern',
    confidence: 0.8,
    tags: ['představivost', 'myšlení'],
  },
  {
    criteria: { handType: 'water', mounts: { venus: 'large' } },
    personality:
      'Vřelost a vnímavost v jedné osobě. Lidé se u vás cítí bezpečně a chodí za vámi s tím, co by jinde neřekli.',
    strengths: ['Vřelost', 'Důvěryhodnost', 'Schopnost naslouchat'],
    challenges: ['Nesení cizích tíží', 'Zanedbávání vlastních potřeb'],
    guidance:
      'Být přístavem pro druhé je vzácné. Hlídejte si, aby vám zbylo i pro sebe.',
    school: 'classical',
    confidence: 0.85,
    tags: ['vřelost', 'empatie'],
  },
  {
    criteria: { handType: 'mixed', mounts: { mercury: 'large' } },
    personality:
      'Přizpůsobivost spojená s darem řeči. Domluvíte se v jakémkoli prostředí a umíte být mostem mezi lidmi, kteří si jinak nerozumí.',
    strengths: ['Prostředkování', 'Přizpůsobivost', 'Sociální obratnost'],
    challenges: ['Nejasná vlastní pozice', 'Zavděčování se všem'],
    guidance:
      'Být mostem neznamená nemít vlastní břeh. Vyjasněte si, kde stojíte vy.',
    school: 'modern',
    confidence: 0.78,
    tags: ['komunikace', 'všestrannost'],
  },

  // ---------- Kombinace se slabými znaky ----------
  {
    criteria: { lines: { lifeLine: 'weak', heartLine: 'weak' } },
    personality:
      'Zdrženlivá povaha, která šetří energií i city. Působíte uzavřeně, ale uvnitř toho probíhá víc, než dáváte najevo.',
    strengths: ['Vnitřní klid', 'Nezávislost', 'Schopnost obejít se bez potvrzení'],
    challenges: ['Osamělost', 'Přehlížení vlastních potřeb'],
    guidance:
      'Otevřít se jednomu člověku není totéž jako otevřít se všem. Zkuste to v malém.',
    school: 'modern',
    confidence: 0.75,
    tags: ['zdrženlivost', 'nezávislost'],
  },
  {
    criteria: { handType: 'water', lines: { headLine: 'weak' } },
    personality:
      'Rozhodování vedené citem víc než rozborem. Váš první dojem bývá dobrý, ale pod tlakem argumentů si ho necháte rozmluvit.',
    strengths: ['Přirozený úsudek o lidech', 'Tvořivé asociace', 'Otevřenost'],
    challenges: ['Nejistota ve sporu', 'Ustupování před silnějším argumentem'],
    guidance:
      'Pocit je také důvod. Naučte se ho pojmenovat, ať ho máte čím obhájit.',
    school: 'modern',
    confidence: 0.78,
    tags: ['cit', 'rozhodování'],
  },
  {
    criteria: { handType: 'earth', lines: { intuitionLine: 'weak' } },
    personality:
      'Pevné ukotvení v tom, co je ověřitelné. Tušením nedůvěřujete a spoléháte na zkušenost — vlastní i cizí.',
    strengths: ['Věcnost', 'Odolnost vůči manipulaci', 'Spolehlivý úsudek'],
    challenges: ['Přehlížení varovných signálů', 'Nedůvěra k novému'],
    guidance:
      'Ne všechno důležité se dá doložit včas. Neodmítejte tušení jen proto, že nemá důkaz.',
    school: 'classical',
    confidence: 0.77,
    tags: ['věcnost', 'zkušenost'],
  },
  {
    criteria: { lines: { fateLine: 'weak', apolloLine: 'strong' } },
    personality:
      'Bez pevné dráhy, zato s výrazným talentem. Vaše cesta se skládá z toho, co vás baví — a drží pohromadě právě tím.',
    strengths: ['Tvůrčí svoboda', 'Původnost', 'Nezávislost na kariéře'],
    challenges: ['Existenční nejistota', 'Obtížné plánování'],
    guidance:
      'Talent bez struktury se rozpustí. Dejte si aspoň volný rámec, ať máte na čem stavět.',
    school: 'modern',
    confidence: 0.76,
    tags: ['tvořivost', 'svoboda'],
  },
  {
    criteria: { handType: 'fire', lines: { headLine: 'weak' } },
    personality:
      'Jednáte dřív, než promyslíte — a překvapivě často to vyjde. Váš instinkt je rychlejší než vaše rozvaha.',
    strengths: ['Rychlá reakce', 'Odvaha', 'Schopnost rozhýbat situaci'],
    challenges: ['Unáhlená rozhodnutí', 'Opakování stejných chyb'],
    guidance:
      'U velkých rozhodnutí si vynuťte jednu noc na rozmyšlenou. U malých pokračujte jako dosud.',
    school: 'classical',
    confidence: 0.79,
    tags: ['instinkt', 'rychlost'],
  },
  {
    criteria: { handType: 'air', lines: { intuitionLine: 'strong' } },
    personality:
      'Neobvyklé spojení rozboru a tušení. Nejdřív něco vycítíte a pak si k tomu dohledáte důvody — a obvykle je najdete.',
    strengths: ['Rychlé rozpoznání vzorců', 'Cit pro lidi', 'Přesvědčivé zdůvodnění'],
    challenges: ['Dodatečné ospravedlňování', 'Přeceňování prvního dojmu'],
    guidance:
      'Ověřujte, jestli hledáte pravdu, nebo jen důkazy pro to, co jste už rozhodli.',
    school: 'modern',
    confidence: 0.8,
    tags: ['intuice', 'analýza'],
  },
  {
    criteria: { mounts: { jupiter: 'large', apollo: 'large' } },
    personality:
      'Ctižádost i talent pohromadě. Chcete být vidět a máte čím — ta kombinace obvykle vede k viditelnému postavení.',
    strengths: ['Charisma', 'Tvůrčí ambice', 'Přirozená autorita'],
    challenges: ['Závislost na obdivu', 'Těžké snášení kritiky'],
    guidance:
      'Kritika není útok na vaši hodnotu. Naučte se v ní hledat použitelnou část.',
    school: 'classical',
    confidence: 0.82,
    tags: ['ambice', 'talent'],
  },
  {
    criteria: { mounts: { venus: 'large', marsLower: 'large' } },
    personality:
      'Vřelost spojená s průbojností. Umíte mít rádi naplno a stejně naplno se za své lidi postavit.',
    strengths: ['Ochranitelskost', 'Vášeň', 'Odvaha za druhé'],
    challenges: ['Žárlivost', 'Prudké reakce v blízkých vztazích'],
    guidance:
      'Ochrana blízkých je namístě. Ověřujte, že o ni stojí a v té podobě, jakou nabízíte.',
    school: 'classical',
    confidence: 0.8,
    tags: ['vášeň', 'ochrana'],
  },
  {
    criteria: { handType: 'mixed', lines: { heartLine: 'strong' } },
    personality:
      'Přizpůsobivost vedená srdcem. Do každého prostředí přinášíte vlastní vřelost a lidé si vás pamatují spíš podle ní než podle role.',
    strengths: ['Vřelost napříč situacemi', 'Schopnost sbližovat', 'Otevřenost'],
    challenges: ['Rozptýlení mezi příliš mnoho vztahů', 'Obtížné stanovení priorit'],
    guidance:
      'Blízkost potřebuje čas. Vyberte pár vztahů, kterým ho dáte doopravdy.',
    school: 'modern',
    confidence: 0.77,
    tags: ['vztahy', 'přizpůsobivost'],
  },
  {
    criteria: { lines: { headLine: 'strong', apolloLine: 'strong' } },
    personality:
      'Tvořivost podložená přemýšlením. Neděláte věci jen krásné — děláte je i promyšlené, a to je poznat.',
    strengths: ['Promyšlená tvorba', 'Smysl pro strukturu', 'Původnost s řemeslem'],
    challenges: ['Přílišná sebekritika', 'Zdlouhavé dokončování'],
    guidance:
      'Hotové je lepší než dokonalé. Nechte dílo odejít dřív, než ho umoříte úpravami.',
    school: 'modern',
    confidence: 0.81,
    tags: ['tvořivost', 'myšlení'],
  },
  {
    criteria: { handType: 'earth', lines: { fateLine: 'weak' } },
    personality:
      'Praktická povaha bez předepsané dráhy. Děláte to, co je právě potřeba, a svůj směr hledáte spíš prací než plánem.',
    strengths: ['Přizpůsobivost', 'Užitečnost', 'Odolnost vůči nejistotě'],
    challenges: ['Pocit nenaplnění', 'Odkládání vlastních cílů'],
    guidance:
      'Být užitečný druhým je hodnota. Zeptejte se ale i na to, co byste chtěli vy.',
    school: 'classical',
    confidence: 0.76,
    tags: ['praktičnost', 'hledání'],
  },
  {
    criteria: { mounts: { luna: 'large', saturn: 'large' } },
    personality:
      'Představivost spoutaná kázní. Sníte ve velkém, ale zároveň víte, co to bude stát — a obojí berete vážně.',
    strengths: ['Realizovatelné vize', 'Vytrvalost', 'Hloubka'],
    challenges: ['Sklon k tíži a vážnosti', 'Přehnaná odpovědnost za výsledek'],
    guidance:
      'Nechte si i sny, které nemusí být k něčemu dobré. Ne všechno musí něco přinést.',
    school: 'modern',
    confidence: 0.78,
    tags: ['vize', 'kázeň'],
  },
  {
    criteria: { handType: 'water', lines: { fateLine: 'strong' } },
    personality:
      'Vnímavá povaha s jasným posláním. Váš směr nevychází z kalkulu, ale z vnitřního přesvědčení — a proto ho tak těžko opouštíte.',
    strengths: ['Vnitřní jistota', 'Věrnost hodnotám', 'Hloubka nasazení'],
    challenges: ['Těžké přijetí odklonu', 'Zranitelnost při neúspěchu'],
    guidance:
      'Poslání se může proměnit, aniž byste zradili sami sebe. Nechte mu prostor dozrát.',
    school: 'modern',
    confidence: 0.8,
    tags: ['poslání', 'hodnoty'],
  },
  {
    criteria: { lines: { mercuryLine: 'weak', headLine: 'strong' } },
    personality:
      'Myslíte líp, než mluvíte. Uvnitř máte jasno, ale převést to do slov pro druhé je práce navíc — a často ji odpustíte.',
    strengths: ['Hloubka úvah', 'Nezávislost na uznání', 'Poctivost k sobě'],
    challenges: ['Nepochopení okolím', 'Přehlédnuté zásluhy'],
    guidance:
      'To, co je vám jasné, není jasné nikomu jinému. Vysvětlování není ztráta času.',
    school: 'classical',
    confidence: 0.78,
    tags: ['myšlení', 'komunikace'],
  },

  // ---------- Kombinace čar a pahorků ----------
  // Dokud tyhle neexistovaly, nemíchala kritéria čar a pahorků ani jedna
  // položka — a protože skóre počítá obě roviny zvlášť, byl strop jistoty
  // fakticky 0,89 místo deklarovaných 0,97. Všechny čtyři vycházejí
  // z míst, kde Cheiro sám obě roviny spojuje.
  {
    criteria: { mounts: { jupiter: 'large' }, lines: { headLine: 'strong' } },
    personality:
      'Ctižádost podložená jasnou hlavou. Cheiro tuhle dvojici čte jako nejlepší znamení úspěchu z vlastní síly — u velkého pahorku Jupitera prý rozhoduje právě čára hlavy, jestli z touhy vést vyroste vedení, nebo jen domýšlivost.',
    strengths: ['Vedení podložené úsudkem', 'Vytrvalost v cíli', 'Přirozená autorita'],
    challenges: ['Netrpělivost s nerozhodností druhých', 'Sklon přebírat i cizí odpovědnost'],
    guidance:
      'Umíte vést i rozhodovat — právě proto na vás okolí přesune víc, než je vaše. Rozlišujte, co je opravdu vaše rozhodnutí.',
    school: 'classical',
    confidence: 0.86,
    tags: ['ambice', 'úsudek'],
    source: [
      cheiro('The Mount of Jupiter and its Meaning'),
      cheiro('The Line of Head and its Variations'),
    ],
  },
  {
    criteria: { mounts: { luna: 'large' }, lines: { headLine: 'weak' } },
    personality:
      'Mimořádná představivost, kterou rozvaha málo drží při zemi. Cheiro u výrazného pahorku Luny upozorňuje, že teprve čára hlavy rozhoduje, jestli se z fantazie stane tvorba, nebo únik.',
    strengths: ['Nápaditost', 'Cit pro nezvyklé', 'Schopnost představit si, co ještě není'],
    challenges: ['Ztráta se ve vlastních představách', 'Odkládání střetu se skutečností'],
    guidance:
      'Vaše představivost je skutečný talent, ale potřebuje termín a někoho, komu se z ní budete zodpovídat. Bez toho zůstane u záměrů.',
    school: 'classical',
    confidence: 0.82,
    tags: ['představivost', 'ukotvení'],
    source: [
      cheiro('The Mount of the Moon and its Meaning'),
      cheiro('The Line of Head and its Variations'),
    ],
  },
  {
    criteria: { mounts: { venus: 'large' }, lines: { heartLine: 'strong' } },
    personality:
      'Vřelost, která je vidět i cítit. Cheiro spojuje vyvinutý pahorek Venuše s vitalitou a potřebou blízkosti; silná čára srdce k tomu přidává city, které se nedrží zpátky.',
    strengths: ['Vřelost bez vypočítavosti', 'Pohostinnost', 'Věrnost blízkým'],
    challenges: ['Prudká reakce, když se city zasáhnou', 'Sklon dávat víc, než dostáváte'],
    guidance:
      'Dávat vám jde snadno. Ověřte si občas, jestli to není jednosměrné — velkorysost bez hranic vyčerpá i vás.',
    school: 'classical',
    confidence: 0.84,
    tags: ['vřelost', 'vztahy'],
    source: [
      cheiro('The Mount of Venus and its Meaning'),
      cheiro('The Line of Heart'),
    ],
  },
  {
    criteria: { mounts: { saturn: 'large' }, lines: { lifeLine: 'strong' } },
    personality:
      'Vážnost a výdrž pohromadě. Cheiro čte výrazný pahorek Saturna jako sklon k samotě a hloubavosti; se silnou čárou života z toho není únava ze světa, ale schopnost dlouho nést, co ostatní odloží.',
    strengths: ['Vytrvalost v dlouhém běhu', 'Samostatnost', 'Odpovědnost, na kterou je spoleh'],
    challenges: ['Izolace, když je toho moc', 'Neochota požádat o pomoc'],
    guidance:
      'Unesete víc než většina lidí, a proto se snadno ocitnete sami. Samota je u vás volba, ne osud — hlídejte si, aby jí zůstala.',
    school: 'classical',
    confidence: 0.83,
    tags: ['vytrvalost', 'samostatnost'],
    source: [
      cheiro('The Mount of Saturn and its Meaning'),
      cheiro('The Line of Life and its Variations'),
    ],
  },
]
