'use client'

import type { LineKey, MountKey } from '@/lib/content/types'

export const LINE_LABELS: Record<LineKey, string> = {
  lifeLine: 'Čára života',
  heartLine: 'Čára srdce',
  headLine: 'Čára hlavy',
  fateLine: 'Čára osudu',
  apolloLine: 'Čára Apollónova',
  mercuryLine: 'Čára Merkurova',
  intuitionLine: 'Čára intuice',
  venusLine: 'Venušin pás',
  marsLine: 'Čára Marsu',
  saturnRing: 'Saturnův prsten',
  solomonRing: 'Šalomounův prsten',
  viaLascivia: 'Via Lascivia',
  travelLine: 'Cestovní čáry',
  relationshipLine: 'Čáry vztahů',
}

export const MOUNT_LABELS: Record<MountKey, string> = {
  venus: 'Pahorek Venuše',
  jupiter: 'Pahorek Jupitera',
  saturn: 'Pahorek Saturna',
  apollo: 'Pahorek Apollóna',
  mercury: 'Pahorek Merkura',
  luna: 'Pahorek Luny',
  marsLower: 'Dolní pahorek Marsu',
  marsUpper: 'Horní pahorek Marsu',
}

const LINE_PATHS: Record<LineKey, string> = {
  heartLine: 'M 248 186 C 210 158, 150 152, 104 168',
  headLine: 'M 78 206 C 120 226, 170 238, 214 236',
  lifeLine: 'M 80 190 C 92 250, 104 306, 132 352',
  fateLine: 'M 150 350 C 154 296, 152 244, 152 200',
  apolloLine: 'M 202 332 C 200 288, 198 242, 196 208',
  mercuryLine: 'M 226 332 C 230 292, 232 250, 234 216',
  intuitionLine: 'M 244 306 C 258 272, 250 238, 220 214',
  venusLine: 'M 118 152 C 150 128, 200 128, 228 152',
  // Vedlejší znaky doplněné z Cheira. Schéma, ne měřená poloha — detekce
  // je nehledá (viz LINE_ZONES), slouží k orientaci v knihovně.
  marsLine: 'M 96 198 C 106 250, 116 300, 138 340',
  saturnRing: 'M 134 132 C 142 116, 162 116, 170 134',
  solomonRing: 'M 87 144 C 94 126, 116 126, 123 146',
  viaLascivia: 'M 240 304 C 224 330, 194 344, 164 348',
  travelLine: 'M 116 304 L 144 316 M 124 330 L 154 344',
  relationshipLine: 'M 250 190 L 234 190 M 250 202 L 238 202',
}

const MOUNT_POSITIONS: Record<MountKey, { cx: number; cy: number; r: number }> = {
  jupiter: { cx: 105, cy: 152, r: 20 },
  saturn: { cx: 152, cy: 142, r: 20 },
  apollo: { cx: 198, cy: 150, r: 20 },
  mercury: { cx: 236, cy: 172, r: 17 },
  venus: { cx: 100, cy: 286, r: 33 },
  luna: { cx: 214, cy: 292, r: 30 },
  marsLower: { cx: 112, cy: 214, r: 16 },
  marsUpper: { cx: 224, cy: 240, r: 16 },
}

const FINGERS = [
  { key: 'index', x: 88, y: 44, w: 34, h: 92 },
  { key: 'middle', x: 134, y: 30, w: 36, h: 106 },
  { key: 'ring', x: 182, y: 44, w: 34, h: 96 },
  { key: 'pinky', x: 226, y: 78, w: 28, h: 70 },
]

export interface HandDiagramProps {
  /** Které čáry už uživatel vyplnil. */
  completedLines?: Partial<Record<LineKey, boolean>>
  /** Které pahorky už uživatel vyplnil. */
  completedMounts?: Partial<Record<MountKey, boolean>>
  onSelectLine?: (key: LineKey) => void
  onSelectMount?: (key: MountKey) => void
  /** Co je právě aktivní k výběru. */
  mode?: 'lines' | 'mounts' | 'both'
  /** Nahraná fotografie jako podklad pro anotaci. */
  backgroundImage?: string
}

export function HandDiagram({
  completedLines = {},
  completedMounts = {},
  onSelectLine,
  onSelectMount,
  mode = 'both',
  backgroundImage,
}: HandDiagramProps) {
  const linesActive = mode === 'lines' || mode === 'both'
  const mountsActive = mode === 'mounts' || mode === 'both'

  return (
    <svg
      viewBox="0 0 320 420"
      className="interactive-hand w-full max-w-md mx-auto select-none"
      role="group"
      aria-label="Interaktivní diagram dlaně"
    >
      {backgroundImage && (
        <image
          href={backgroundImage}
          x="0"
          y="0"
          width="320"
          height="420"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.55"
        />
      )}

      {/* Obrys dlaně */}
      <path
        d="M 70 200 C 62 160, 74 140, 86 138 L 86 150 L 258 150 C 274 158, 276 190, 268 220
           C 262 262, 252 306, 232 340 C 214 372, 176 384, 146 376 C 112 366, 88 330, 78 290 Z"
        fill={backgroundImage ? 'rgba(245,230,211,0.35)' : '#f5e6d3'}
        stroke="#a0722d"
        strokeWidth="2"
      />

      {/* Prsty */}
      {FINGERS.map((finger) => (
        <rect
          key={finger.key}
          x={finger.x}
          y={finger.y}
          width={finger.w}
          height={finger.h}
          rx={finger.w / 2}
          fill={backgroundImage ? 'rgba(245,230,211,0.35)' : '#f5e6d3'}
          stroke="#a0722d"
          strokeWidth="2"
        />
      ))}

      {/* Palec */}
      <path
        d="M 72 236 C 46 250, 34 288, 44 316 C 52 340, 76 344, 90 326 C 100 312, 96 280, 92 260 Z"
        fill={backgroundImage ? 'rgba(245,230,211,0.35)' : '#f5e6d3'}
        stroke="#a0722d"
        strokeWidth="2"
      />

      {/* Pahorky */}
      {mountsActive &&
        (Object.keys(MOUNT_POSITIONS) as MountKey[]).map((key) => {
          const pos = MOUNT_POSITIONS[key]
          const done = completedMounts[key]
          return (
            <circle
              key={key}
              cx={pos.cx}
              cy={pos.cy}
              r={pos.r}
              fill={done ? 'rgba(184,135,63,0.45)' : 'rgba(184,135,63,0.12)'}
              stroke={done ? '#7f5620' : '#c89960'}
              strokeWidth={done ? 2.5 : 1.5}
              className="cursor-pointer"
              onClick={() => onSelectMount?.(key)}
              role="button"
              tabIndex={0}
              aria-label={`${MOUNT_LABELS[key]}${done ? ' — vyplněno' : ''}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectMount?.(key)
                }
              }}
            >
              <title>{MOUNT_LABELS[key]}</title>
            </circle>
          )
        })}

      {/* Čáry */}
      {(Object.keys(LINE_PATHS) as LineKey[]).map((key) => {
        const done = completedLines[key]
        return (
          <g key={key}>
            {/* Širší neviditelná stopa kvůli zásahu prstem. Čáry se na dlani
                kříží, takže u průsečíků je stopa nutně nejednoznačná — proto
                průvodce nabízí vedle diagramu i seznam s názvy čar. */}
            {linesActive && (
              <path
                d={LINE_PATHS[key]}
                stroke="transparent"
                strokeWidth="14"
                fill="none"
                className="cursor-pointer"
                onClick={() => onSelectLine?.(key)}
                role="button"
                tabIndex={0}
                aria-label={`${LINE_LABELS[key]}${done ? ' — vyplněno' : ''}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectLine?.(key)
                  }
                }}
              >
                <title>{LINE_LABELS[key]}</title>
              </path>
            )}
            <path
              d={LINE_PATHS[key]}
              stroke={done ? '#7f5620' : '#8b7355'}
              strokeWidth={done ? 4 : 2}
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />
          </g>
        )
      })}
    </svg>
  )
}
