import type { Point } from './mediapipe'

/**
 * Kontrola polohy ruky v živém náhledu proti pevnému obrysu dlaně.
 *
 * Proč to vůbec existuje: většina neúspěšných detekcí nebyla chyba filtrů,
 * ale fotka, ze které se nedalo nic vyčíst — ruka moc daleko, natočená,
 * částečně mimo záběr. Uživatel to shrnul přesně: „je nutné definovat, jak
 * má uživatel dlaň vyfotit". Obrys plus tyhle kontroly odstraňují rozptyl
 * u zdroje, místo aby ho pak pipeline hádala zpětně.
 *
 * Obrys je záměrně **symetrický a bez palce**. Není to zjednodušení:
 * normalizace v `lines/normalize.ts` kotví na zápěstí, kotník ukazováku a
 * kotník malíku — palec do ní nevstupuje vůbec. Symetrický obrys tak
 * navádí přesně to, na čem detekce stojí, a platí pro levou i pravou ruku
 * bez zrcadlení.
 */

/** Souřadný systém obrysu; SVG používá stejný viewBox. */
export const OUTLINE_VIEWBOX = { width: 300, height: 400 }

const GUIDE_ASPECT = OUTLINE_VIEWBOX.width / OUTLINE_VIEWBOX.height

/** Dlaň (bez prstů) v souřadnicích obrysu — z ní se odvozují tolerance. */
const PALM_BOX = { left: 70, right: 230, top: 150, bottom: 330 }

const PALM_CENTER = {
  x: (PALM_BOX.left + PALM_BOX.right) / 2 / OUTLINE_VIEWBOX.width,
  y: (PALM_BOX.top + PALM_BOX.bottom) / 2 / OUTLINE_VIEWBOX.height,
}

/**
 * Referenční délka dlaně (zápěstí → kotník prostředníku) vůči výšce obrysu.
 * Meze jsou ověřené na dvou reálných snímcích uživatele, kde vyšla 0,50 a
 * 0,52 — obojí uvnitř rozsahu s rezervou na obě strany.
 */
const TARGET_PALM_SPAN =
  (PALM_BOX.bottom - PALM_BOX.top) / OUTLINE_VIEWBOX.height

const MIN_PALM_SPAN = TARGET_PALM_SPAN * 0.62
const MAX_PALM_SPAN = TARGET_PALM_SPAN * 1.45
const CENTER_TOLERANCE = { x: 0.15, y: 0.16 }
const MAX_TILT_DEGREES = 30
const FRAME_MARGIN = 0.01
const GUIDE_MARGIN = 0.04

const WRIST = 0
const INDEX_MCP = 5
const MIDDLE_MCP = 9
const PINKY_MCP = 17
/** Prst = [kotník (MCP), střední kloub (PIP), špička (TIP)]. */
const FINGERS: [number, number, number][] = [
  [5, 6, 8],
  [9, 10, 12],
  [13, 14, 16],
  [17, 18, 20],
]

export interface HandPoseCheck {
  /** Ruka není useknutá hranou skutečného záběru kamery. */
  inFrame: boolean
  /** Ruka je uvnitř nakresleného obrysu. */
  inGuide: boolean
  bigEnough: boolean
  notTooClose: boolean
  centered: boolean
  upright: boolean
  open: boolean
  ok: boolean
  /** Jedna konkrétní vada k nápravě, seřazená podle toho, co vadí nejvíc. */
  hint?: string
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export interface Size {
  width: number
  height: number
}

/**
 * Obrys má pevný poměr stran 3:4 a vepisuje se doprostřed náhledu. Kdyby se
 * roztahoval na celý kontejner, měnil by tvar podle toho, jaký poměr stran
 * zrovna vrátí kamera — a tolerance počítané vůči jeho výšce by na širokém
 * streamu znamenaly něco jiného než na úzkém.
 */
export function guideBox(container: Size): { x: number; y: number } & Size {
  const width = Math.min(container.width, container.height * GUIDE_ASPECT)
  const height = width / GUIDE_ASPECT
  return {
    x: (container.width - width) / 2,
    y: (container.height - height) / 2,
    width,
    height,
  }
}

/**
 * Body z modelu jsou normalizované vůči **snímku videa**, obrys se ale
 * kreslí přes **náhled**, který snímek ořezává (`object-cover`) a sám je
 * menší než kontejner. Bez tohoto přepočtu by obrys a kontroly mluvily
 * o jiných místech obrazu.
 */
export function frameToGuide(point: Point, video: Size, container: Size): Point {
  if (!video.width || !video.height || !container.width || !container.height) {
    return point
  }
  const scale = Math.max(
    container.width / video.width,
    container.height / video.height,
  )
  const drawnWidth = video.width * scale
  const drawnHeight = video.height * scale
  const containerX = (container.width - drawnWidth) / 2 + point.x * drawnWidth
  const containerY = (container.height - drawnHeight) / 2 + point.y * drawnHeight

  const box = guideBox(container)
  return {
    x: (containerX - box.x) / box.width,
    y: (containerY - box.y) / box.height,
  }
}

/**
 * `guidePoints` jsou souřadnice uvnitř obrysu (0–1, viz `frameToGuide`),
 * `framePoints` původní souřadnice ve snímku kamery. Obojí je potřeba:
 * z obrysu se počítá zarovnání, ze snímku to, jestli ruka není doopravdy
 * useknutá hranou záběru — což je jediná vada, kterou už nejde napravit
 * jinak než novou fotkou.
 */
export function checkHandPose(
  guidePoints: Point[],
  framePoints: Point[],
): HandPoseCheck {
  const wrist = guidePoints[WRIST]
  const middleMcp = guidePoints[MIDDLE_MCP]

  const inFrame = framePoints.every(
    (point) =>
      point.x > FRAME_MARGIN &&
      point.x < 1 - FRAME_MARGIN &&
      point.y > FRAME_MARGIN &&
      point.y < 1 - FRAME_MARGIN,
  )

  const inGuide = guidePoints.every(
    (point) =>
      point.x > -GUIDE_MARGIN &&
      point.x < 1 + GUIDE_MARGIN &&
      point.y > -GUIDE_MARGIN &&
      point.y < 1 + GUIDE_MARGIN,
  )

  const palmSpan = distance(wrist, middleMcp)
  const bigEnough = palmSpan >= MIN_PALM_SPAN
  const notTooClose = palmSpan <= MAX_PALM_SPAN

  // Střed dlaně bereme ze čtyř kotníků, ne ze všech bodů — jinak by ho
  // natažené prsty táhly nahoru a obrys by seděl posunutý.
  const anchors = [
    wrist,
    guidePoints[INDEX_MCP],
    middleMcp,
    guidePoints[PINKY_MCP],
  ]
  const center = {
    x: anchors.reduce((sum, p) => sum + p.x, 0) / anchors.length,
    y: anchors.reduce((sum, p) => sum + p.y, 0) / anchors.length,
  }
  const centered =
    Math.abs(center.x - PALM_CENTER.x) <= CENTER_TOLERANCE.x &&
    Math.abs(center.y - PALM_CENTER.y) <= CENTER_TOLERANCE.y

  // Osa dlaně proti svislici. V obrazových souřadnicích roste y dolů,
  // takže „prsty nahoru" je záporné dy.
  const tilt = Math.abs(
    Math.atan2(middleMcp.x - wrist.x, wrist.y - middleMcp.y) * (180 / Math.PI),
  )
  const upright = tilt <= MAX_TILT_DEGREES

  // Natažený prst má špičku dál od zápěstí než svůj střední kloub. Poměr je
  // odolnější než absolutní vzdálenost — nezávisí na velikosti ruky v záběru.
  const extended = FINGERS.filter(
    ([, pip, tip]) =>
      distance(guidePoints[tip], wrist) >
      distance(guidePoints[pip], wrist) * 1.12,
  ).length
  const open = extended >= 3

  const ok =
    inFrame && inGuide && bigEnough && notTooClose && centered && upright && open

  let hint: string | undefined
  if (!inFrame) hint = 'Kus ruky je mimo záběr — oddalte telefon.'
  else if (!notTooClose) hint = 'Oddalte ruku, nevejde se do obrysu.'
  else if (!bigEnough) hint = 'Přibližte ruku, ať vyplní obrys.'
  else if (!open) hint = 'Narovnejte prsty a dlaň úplně otevřete.'
  else if (!upright) hint = 'Otočte ruku tak, aby prsty mířily nahoru.'
  else if (!centered) hint = 'Posuňte dlaň do středu obrysu.'
  else if (!inGuide) hint = 'Celá ruka musí být uvnitř obrysu.'

  return {
    inFrame,
    inGuide,
    bigEnough,
    notTooClose,
    centered,
    upright,
    open,
    ok,
    hint,
  }
}
