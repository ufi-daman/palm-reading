# Čtení z dlaně — interaktivní knihovna

Webová aplikace v češtině pro čtení z dlaně. Primární cesta je fotka: vyfotíte
dlaň, aplikace v prohlížeči rozpozná typ ruky a čáry a rovnou sestaví čtení.
Cokoliv detekce nenajde nebo najde špatně, se dá opravit v panelu pod
výsledkem — a bez focení jde celé čtení sestavit i ručně.

## Jak to funguje

```
vyfoťte dlaň → rozpoznání v prohlížeči → ČTENÍ
                                            ↓
                                "Upřesnit čtení" → oprava/doplnění
```

1. **Naváděné focení** (`components/GuidedCapture.tsx`) — živý náhled z
   kamery kontroluje ostrost a expozici, spoušť se odemkne až po splnění
   obou. Bez kamery nebo při zamítnutém oprávnění nabídne rovnou výběr
   souboru. Fotka zůstává jen ve vašem prohlížeči.
2. **Rozpoznání typu ruky** — MediaPipe Hand Landmarker (21 bodů ruky,
   self-hosted WASM i model, žádné volání Google CDN) spočítá poměry dlaně
   a prstů čistě geometricky.
3. **Detekce čar** (`lib/vision/lines/`) — vlastní implementace nad
   `ImageData`, bez OpenCV.js: homografie normalizuje dlaň do rámce
   512×512 → CLAHE + bilaterální filtr → vícemeřítkový Frangiho hřebenový
   filtr (σ 1–5 px, chytá hlavní i vedlejší čáry) → Otsuův práh →
   Zhang-Suenovo ztenčení → spojené komponenty → přiřazení do anatomických
   zón. Nedetekovaný znak se **nikdy nereportuje jako dohad** — buď je nad
   prahem jistoty, nebo do čtení vůbec nevstoupí.
4. **Čtení** — `lib/analysis/palmReader.ts` poskládá výklad z toho, co se
   skutečně našlo, podle pramenné znalostní báze (`lib/content/`).
5. **Oprava** — panel "Upřesnit čtení" pod výsledkem umožní cokoliv doplnit
   nebo přepsat; čtení se po každé změně přepočítá.

**Bez focení** funguje i interaktivní diagram (`/analyzer/interactive`) a
textový formulář (`/analyzer/text-input`) — obě cesty jsou z domovské
stránky viditelně nabídnuté, ne schované jako záložní řešení.

**Volitelný AI rozbor** (`/api/vision`) pošle fotku k vyhodnocení přes
Anthropic API, pokud o to uživatel výslovně požádá (viz Souhlas a AI níže).

## Spuštění

```bash
git clone https://github.com/ufi-daman/protocol.git
cd protocol
npm install
cp .env.example .env
npm run dev                  # http://localhost:3000
```

Bez jakýchkoliv proměnných prostředí aplikace plně funguje — chybí jen
statistiky a AI rozbor (viz níže).

### Volitelné proměnné

| Proměnná | K čemu | Bez ní |
|---|---|---|
| `DATABASE_URL` | PostgreSQL pro provozní statistiky (`/admin/stats`) | zápis statistik se tiše přeskočí |
| `ADMIN_PASSWORD` | HTTP basic auth pro `/admin/*` | `/admin` vrací 503 |
| `ANTHROPIC_API_KEY` | AI rozbor fotky (`/api/vision`) | tlačítko AI rozboru vrací 503 |
| `VISION_DAILY_CAP` | denní strop volání AI (výchozí 20) | platí výchozí hodnota |

`DATABASE_URL` a `ANTHROPIC_API_KEY` musí být nastavené obě zároveň, aby
AI rozbor fungoval — bez databáze nejde vynutit denní strop volání, takže
endpoint zůstává schválně vypnutý (bezpečnostní pojistka proti nekontrolo-
vanému utrácení API kreditu).

Pro `DATABASE_URL` funguje libovolný hostovaný Postgres s free tier, např.
[Neon](https://neon.tech) nebo Vercel Postgres.

## Technologie

- **Next.js 14** (App Router) + TypeScript
- **Prisma 7** + PostgreSQL přes driver adapter `@prisma/adapter-pg`
- **Tailwind CSS 3**
- **@mediapipe/tasks-vision** — rozpoznání bodů ruky (self-hosted)
- **@anthropic-ai/sdk** — volitelný AI rozbor fotky, structured outputs
- **Zod** pro validaci vstupů (v3 v aplikaci, v4 jen pro strukturovaný
  výstup Claude — SDK helper `zodOutputFormat` to vyžaduje, viz
  `lib/vision/visionSchema.ts`)

## API

| Endpoint | Metoda | Popis |
|---|---|---|
| `/api/analyze` | POST | Hlavní analýza — vrátí osobnost, přednosti, výzvy, doporučení |
| `/api/vision` | POST | Volitelný AI rozbor fotky (vyžaduje `consent: true`) |
| `/api/palm-lines` | GET | Čáry dlaně |
| `/api/mounts` | GET | Pahorky dlaně |
| `/api/hand-types` | GET | Typy rukou |
| `/api/interpretations` | GET | Kombinace, filtry `?handType=`, `?school=` |

Žádný endpoint neukládá fotografie — `/api/analyze` dostává jen vyplněné
znaky, `/api/vision` fotku přepošle k jednorázovému vyhodnocení a nikam ji
neukládá.

### Jak vzniká výklad

Vstup (ať už z detekce, AI, nebo ručního vyplnění) se porovná s kombinacemi
ve znalostní bázi. Kombinace je použitelná jen tehdy, když sedí **všechna**
její kritéria; skóre pak zvýhodňuje ty konkrétnější (váhy: čáry 40, typ ruky
25, pahorky 25, doplňky 10).

Když žádná kombinace nesedí, výsledek se **poskládá z významů jednotlivých
znaků**. Díky tomu dá aplikace souvislé čtení na jakýkoli vstup, aniž by
báze musela obsahovat všechny myslitelné kombinace.

Detekce (z fotky nebo z AI) dodává jen **znaky** — výklad vždy skládá jen
`palmReader.ts` ze znalostní báze, nikdy model ani filtr.

## Znalostní báze — stav pramenů

`lib/content/` je typovaný kód v gitu (ne databáze) — dnes 8 čar, 8 pahorků
a 5 typů rukou. Rozšíření na 15 čar a doplnění povinného zdroje (`source`)
u každé položky podle volných pramenů (Benham, Cheiro, Dale, Markun) čeká na
odblokování `gutenberg.org` a `archive.org` v síťové politice prostředí —
zatím nedostupné.

## Struktura

```
app/
  page.tsx                       homepage — fotka jako primární tok
  analyzer/{interactive,image-upload,text-input}/
  library/{lines,mounts,hand-types,guide}/
  admin/stats/                    chráněné statistiky
  api/                            REST endpointy
components/
  GuidedCapture.tsx               naváděné focení (kamera + fallback na soubor)
  PhotoFirstFlow.tsx              orchestrace: focení → detekce → čtení → oprava
  AiVisionOptIn.tsx               volitelný AI rozbor s explicitním souhlasem
  AnalyzerWizard.tsx              krokový průvodce i korekční panel (variant="panel")
  HandDiagram.tsx, FeatureModal.tsx, ResultCard.tsx
lib/
  content/                        znalostní báze (statický kód, ne DB)
  analysis/palmReader.ts          vyhodnocovací jádro
  vision/
    mediapipe.ts, handType.ts     rozpoznání bodů ruky a typu
    imageQuality.ts                ostrost/expozice pro naváděné focení
    lines/                         detekce čar (homografie → filtry → zóny)
    visionSchema.ts, visionConvert.ts   structured output pro AI rozbor
  db/
    client.ts                      Prisma client, nullable bez DATABASE_URL
    stats.ts, aiCap.ts             zápis statistik, denní strop AI volání
  validators/                      Zod schémata (v3)
prisma/schema.prisma               AnalysisStat, AiCallLog — bez osobních údajů
public/mediapipe/, public/models/  self-hosted WASM a model (~18,5 MB)
```

## Nasazení na Vercel

Celé přes web, bez terminálu a bez CLI:

1. [vercel.com](https://vercel.com) → přihlásit přes GitHub → **Add New → Project**
2. **Import** repozitáře `ufi-daman/palm-reading` — Next.js se rozpozná sám,
   ostatní nastavení nechte výchozí
3. **Deploy**

Build projde i **bez jediné proměnné prostředí** — ověřeno na čistém buildu
včetně `postinstall: prisma generate`. Proměnné se doplňují až podle toho,
co chcete zapnout navíc:

| Proměnná | Co zapne | Bez ní |
|---|---|---|
| `ADMIN_PASSWORD` | `/admin/stats` | stránka vrací 503 |
| `DATABASE_URL` | ukládání statistik | zápis se tiše přeskočí |
| `ANTHROPIC_API_KEY` **+** `DATABASE_URL` | AI rozbor fotky | endpoint vrací 503 |

`ANTHROPIC_API_KEY` bez `DATABASE_URL` AI rozbor **nezapne** — je to
záměrná pojistka, bez databáze nejde vynutit denní strop volání.

Po nasazení běží aplikace na HTTPS, což je nutná podmínka pro přístup ke
kameře v prohlížeči. Na `http://` (mimo `localhost`) focení dlaně nefunguje.

### Instalace na telefon

Aplikace je PWA. Na mobilu v prohlížeči přes nabídku **„Přidat na plochu"**
(Android: Chrome → ⋮; iOS: Safari → Sdílet) se nainstaluje jako běžná
aplikace s vlastní ikonou a spouští se na celou obrazovku bez adresního
řádku. Manifest je `app/manifest.ts`, ikony `public/icon-*.png`.

**Limit Hobby tarifu:** serverless funkce má strop 10 s. `/api/vision` má
nastavené `maxDuration = 60`, ale na Hobby tarifu ho Vercel stejně ořízne na
10 s — `effort: 'low'` u AI rozboru je zvolený mimo jiné proto, aby se do
toho vešel. Na Pro tarifu lze `maxDuration` využít celý.

**Velikost self-hosted assetů:** WASM (MediaPipe) + model dohromady ~18,5 MB,
stahují se až při prvním focení, ne při načtení stránky. Reálná velikost
změřená z produkčního buildu.

## Cena AI rozboru

Při `effort: 'low'` jde o levné volání (řádově jednotky haléřů až korun za
rozbor, přesná cena závisí na aktuálním ceníku Anthropic API — ověřte si ji
prosím na [anthropic.com](https://www.anthropic.com) před nasazením do
provozu s reálným provozem).

## Upozornění

Aplikace slouží k zábavě a vzdělávání. Nejde o lékařskou ani psychologickou
diagnostiku, o proroctví ani o odborné poradenství.
