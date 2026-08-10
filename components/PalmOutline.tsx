import { OUTLINE_VIEWBOX } from '@/lib/vision/handPose'

/**
 * Obrys dlaně přes živý náhled. Vědomě je **symetrický a bez palce** —
 * detekce kotví na zápěstí a kotnících ukazováku a malíku, palec do ní
 * nevstupuje, takže jeden obrys platí pro levou i pravou ruku.
 *
 * `preserveAspectRatio="xMidYMid meet"` musí odpovídat `guideBox()` — obrys
 * se vepisuje doprostřed náhledu se zachovaným poměrem 3:4 a kontroly
 * počítají tolerance ve stejném prostoru. Kdyby se obrys škáloval jinak než
 * kontroly, ukazoval by uživateli jiné místo, než které se ověřuje.
 */
export function PalmOutline({ state }: { state: 'idle' | 'adjust' | 'ready' }) {
  const stroke =
    state === 'ready'
      ? 'rgb(74, 222, 128)'
      : state === 'adjust'
        ? 'rgb(251, 191, 36)'
        : 'rgba(255, 255, 255, 0.65)'

  const fingers = [
    { x: 78, y: 60, width: 34 },
    { x: 118, y: 45, width: 34 },
    { x: 158, y: 58, width: 34 },
    { x: 196, y: 88, width: 30 },
  ]

  return (
    <svg
      viewBox={`0 0 ${OUTLINE_VIEWBOX.width} ${OUTLINE_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={3}
        strokeDasharray={state === 'ready' ? undefined : '10 8'}
      >
        <rect x={70} y={150} width={160} height={180} rx={44} />
        {fingers.map((finger) => (
          <rect
            key={finger.x}
            x={finger.x}
            y={finger.y}
            width={finger.width}
            height={190 - finger.y}
            rx={finger.width / 2}
          />
        ))}
        <line x1={92} y1={352} x2={208} y2={352} strokeDasharray="6 8" />
      </g>
      <text
        x={150}
        y={378}
        textAnchor="middle"
        fontSize={16}
        fill={stroke}
        aria-hidden="true"
      >
        zápěstí
      </text>
    </svg>
  )
}
