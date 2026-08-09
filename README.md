# Čtení z dlaně — interaktivní knihovna

Webová aplikace v češtině pro čtení z dlaně. Uživatel popíše čáry, pahorky a tvar
své ruky a dostane souvislý osobnostní výklad složený z tradičních palmistických
významů.

## Co aplikace umí

**Tři způsoby zadání**, všechny vedou ke stejnému výsledku:

| Způsob | Cesta | Popis |
|---|---|---|
| Interaktivní diagram | `/analyzer/interactive` | Klikání přímo do SVG dlaně |
| Z fotografie | `/analyzer/image-upload` | Nahraná fotka jako podklad pod diagramem |
| Textový formulář | `/analyzer/text-input` | Výběr znaků ze seznamu |

**Referenční knihovna** (`/library`) — 8 čar, 8 pahorků a 5 typů rukou, každý s
vlastní stránkou a výkladem jednotlivých variant. Plus průvodce v šesti krocích.

## Spuštění

```bash
git clone https://github.com/ufi-daman/protocol.git
cd protocol
npm install

cp .env.example .env         # DATABASE_URL="file:./prisma/dev.db"
npx prisma migrate deploy    # vytvoří a připraví databázi
npx prisma generate

npm run dev                  # http://localhost:3000
curl -X POST http://localhost:3000/api/seed   # naplní znalostní bázi
```

Bez posledního kroku bude knihovna prázdná a analýza vrátí jen obecný výklad.

## Technologie

- **Next.js 14** (App Router) + TypeScript
- **Prisma 7** + SQLite přes driver adapter `@prisma/adapter-better-sqlite3`
- **Tailwind CSS 3**
- **sharp** pro zpracování nahraných fotografií
- **Zod** pro validaci vstupů

## API

| Endpoint | Metoda | Popis |
|---|---|---|
| `/api/analyze` | POST | Hlavní analýza — vrátí osobnost, přednosti, výzvy, doporučení |
| `/api/upload` | POST | Nahrání fotografie (max 5 MB, JPG/PNG/WebP) |
| `/api/palm-lines` | GET | Čáry dlaně |
| `/api/mounts` | GET | Pahorky dlaně |
| `/api/hand-types` | GET | Typy rukou |
| `/api/interpretations` | GET | Kombinace, filtry `?handType=`, `?school=` |
| `/api/seed` | POST | Naplnění znalostní báze |

### Jak vzniká výklad

Vstup se porovná s kombinacemi v databázi. Kombinace je použitelná jen tehdy,
když sedí **všechna** její kritéria; skóre pak zvýhodňuje ty konkrétnější
(váhy: čáry 40, typ ruky 25, pahorky 25, doplňky 10).

Když žádná kombinace nesedí, výsledek se **poskládá z významů jednotlivých
znaků**. Díky tomu dá aplikace souvislé čtení na jakýkoli vstup, aniž by
databáze musela obsahovat všechny myslitelné kombinace.

Jistota výkladu (`confidence`) roste s tím, kolik znaků uživatel vyplnil a jak
konkrétní kombinace se podařilo najít.

## Struktura

```
app/
  analyzer/{interactive,image-upload,text-input}/   tři vstupní metody
  library/{lines,mounts,hand-types,guide}/          referenční knihovna
  api/                                              REST endpointy
components/
  HandDiagram.tsx        interaktivní SVG dlaně
  AnalyzerWizard.tsx     společný pětikrokový průvodce
  FeatureModal.tsx       dialog pro popis znaku
  ResultCard.tsx         zobrazení výsledku
lib/
  content/               znalostní báze (čáry, pahorky, typy, kombinace)
  analysis/palmReader.ts vyhodnocovací jádro
  db/queries.ts          rozbalování JSON sloupců ze SQLite
  validators/            Zod schémata
prisma/schema.prisma     databázové schéma
```

## Nasazení

SQLite a ukládání fotografií na lokální disk fungují **lokálně a na vlastním
serveru** (VPS, Docker). **Na Vercelu ne** — serverless má read-only filesystem
a neudrží stav mezi requesty. Pro Vercel by bylo potřeba přejít na hostovaný
Postgres a objektové úložiště pro obrázky.

## Upozornění

Aplikace slouží k zábavě a vzdělávání. Nejde o lékařskou ani psychologickou
diagnostiku, o proroctví ani o odborné poradenství.
