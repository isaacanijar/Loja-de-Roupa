/* =========================================================
   MALVA — Geometria paramétrica de vestuário
   ---------------------------------------------------------
   Toda silhueta do site nasce daqui. Um mesmo conjunto de
   medidas (decote, ombro, manga, cintura, barra) gera um
   path SVG com ESTRUTURA IDÊNTICA de comandos — 1 "M",
   18 "C" e 1 "Z" — independente da peça.

   É essa invariância que torna possível a arte de transição:
   como todas as peças compartilham a mesma topologia, dá para
   interpolar as MEDIDAS e ver um vestido virar casaco sem
   nenhum salto, colapso ou cruzamento de linhas.
   ========================================================= */

export interface GarmentShape {
  /** meia-largura do decote */
  neckWidth: number
  /** profundidade do decote a partir da linha do ombro */
  neckDepth: number
  /** meia-largura da linha do ombro */
  shoulder: number
  /** queda do ombro (0 = reto, maior = ombro caído) */
  shoulderDrop: number
  /** comprimento da manga */
  sleeveLength: number
  /** x externo do punho — abre a manga (bufante, sino) */
  sleeveOuter: number
  /** x interno do punho */
  sleeveInner: number
  /** altura da cava */
  armhole: number
  /** meia-largura do busto */
  bust: number
  waistY: number
  waist: number
  hipY: number
  hip: number
  hemY: number
  hem: number
  /** quanto a barra desce no centro (peso do tecido) */
  hemCurve: number
}

type Pt = readonly [number, number]

interface Seg {
  c1: Pt
  c2: Pt
  p: Pt
}

const mirror = ([x, y]: Pt): Pt => [-x, y]

const fmt = (n: number) => (Math.round(n * 100) / 100).toString()

/**
 * Espelha a metade direita e a percorre no sentido inverso,
 * trocando os pontos de controle de cada cúbica — assim a peça
 * fecha simétrica sem duplicar a autoria da curva.
 */
function reflect(start: Pt, segs: Seg[]): Seg[] {
  const chain: Pt[] = [start, ...segs.map((s) => s.p)]
  const out: Seg[] = []
  for (let i = segs.length - 1; i >= 0; i--) {
    out.push({
      c1: mirror(segs[i].c2),
      c2: mirror(segs[i].c1),
      p: mirror(chain[i]),
    })
  }
  return out
}

function serialize(start: Pt, segs: Seg[]): string {
  const head = 'M ' + fmt(start[0]) + ' ' + fmt(start[1])
  const body = segs
    .map(
      (s) =>
        ' C ' +
        fmt(s.c1[0]) + ' ' + fmt(s.c1[1]) + ', ' +
        fmt(s.c2[0]) + ' ' + fmt(s.c2[1]) + ', ' +
        fmt(s.p[0]) + ' ' + fmt(s.p[1]),
    )
    .join('')
  return head + body + ' Z'
}

/** Contorno externo: decote → ombro → manga → lateral → barra. */
export function garmentPath(g: GarmentShape): string {
  const start: Pt = [0, g.neckDepth]
  const cuffY = g.sleeveLength
  const cuffInnerY = g.sleeveLength * 0.94 + 2

  const right: Seg[] = [
    // decote, metade direita
    {
      c1: [g.neckWidth * 0.62, g.neckDepth],
      c2: [g.neckWidth, g.neckDepth * 0.44],
      p: [g.neckWidth, 0],
    },
    // linha do ombro
    {
      c1: [g.neckWidth + (g.shoulder - g.neckWidth) * 0.4, -1.5],
      c2: [g.shoulder * 0.86, g.shoulderDrop * 0.35],
      p: [g.shoulder, g.shoulderDrop],
    },
    // manga, lado externo
    {
      c1: [g.shoulder + (g.sleeveOuter - g.shoulder) * 0.55, g.shoulderDrop + cuffY * 0.14],
      c2: [g.sleeveOuter + 3, cuffY * 0.66],
      p: [g.sleeveOuter, cuffY],
    },
    // boca do punho
    {
      c1: [g.sleeveOuter - (g.sleeveOuter - g.sleeveInner) * 0.3, cuffY + 5],
      c2: [g.sleeveInner + (g.sleeveOuter - g.sleeveInner) * 0.3, cuffInnerY + 5],
      p: [g.sleeveInner, cuffInnerY],
    },
    // manga, lado interno, subindo até a cava
    {
      c1: [g.sleeveInner - 4, cuffInnerY - (cuffInnerY - g.armhole) * 0.45],
      c2: [g.bust + (g.sleeveInner - g.bust) * 0.42, g.armhole + 10],
      p: [g.bust, g.armhole],
    },
    // lateral: busto → cintura
    {
      c1: [g.bust + 2, g.armhole + (g.waistY - g.armhole) * 0.42],
      c2: [g.waist + 3, g.waistY - (g.waistY - g.armhole) * 0.22],
      p: [g.waist, g.waistY],
    },
    // cintura → quadril
    {
      c1: [g.waist - 1, g.waistY + (g.hipY - g.waistY) * 0.4],
      c2: [g.hip - 2, g.hipY - (g.hipY - g.waistY) * 0.3],
      p: [g.hip, g.hipY],
    },
    // quadril → barra (o godê nasce aqui)
    {
      c1: [g.hip + (g.hem - g.hip) * 0.15, g.hipY + (g.hemY - g.hipY) * 0.45],
      c2: [g.hem - (g.hem - g.hip) * 0.18, g.hemY - (g.hemY - g.hipY) * 0.22],
      p: [g.hem, g.hemY],
    },
    // barra até o centro, com o peso do tecido puxando para baixo
    {
      c1: [g.hem * 0.72, g.hemY + g.hemCurve * 0.9],
      c2: [g.hem * 0.34, g.hemY + g.hemCurve],
      p: [0, g.hemY + g.hemCurve],
    },
  ]

  return serialize(start, right.concat(reflect(start, right)))
}

/** Linha de cintura / marcação de modelagem — acompanha a peça no morph. */
export function waistSeamPath(g: GarmentShape): string {
  const w = g.waist * 0.98
  return (
    'M ' + fmt(-w) + ' ' + fmt(g.waistY) +
    ' C ' + fmt(-w * 0.4) + ' ' + fmt(g.waistY + 7) + ', ' +
    fmt(w * 0.4) + ' ' + fmt(g.waistY + 7) + ', ' +
    fmt(w) + ' ' + fmt(g.waistY)
  )
}

/** Caimento do tecido: quatro pregas que abrem da cintura até a barra. */
export function drapeLines(g: GarmentShape): string[] {
  const spread = [-0.52, -0.16, 0.2, 0.56]
  return spread.map((k, i) => {
    const topX = g.waist * k * 0.8
    const botX = g.hem * k
    const sway = i % 2 === 0 ? 6 : -5
    const drop = g.hemCurve * (1 - Math.abs(k) * 0.7)
    return (
      'M ' + fmt(topX) + ' ' + fmt(g.waistY + 4) +
      ' C ' + fmt(topX + sway) + ' ' + fmt(g.waistY + (g.hemY - g.waistY) * 0.45) + ', ' +
      fmt(botX - sway * 0.6) + ' ' + fmt(g.hemY - (g.hemY - g.waistY) * 0.22) + ', ' +
      fmt(botX) + ' ' + fmt(g.hemY + drop)
    )
  })
}

/** Interpolação linear entre duas modelagens. Base de toda transição. */
export function lerpShape(a: GarmentShape, b: GarmentShape, t: number): GarmentShape {
  const out = {} as GarmentShape
  for (const key of Object.keys(a) as (keyof GarmentShape)[]) {
    out[key] = a[key] + (b[key] - a[key]) * t
  }
  return out
}

/** Easing de seda: parte devagar, assenta devagar. */
export const easeSilk = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/* ---------------------------------------------------------
   Acervo de modelagens do ateliê
   --------------------------------------------------------- */

export const SHAPES = {
  /** Slip dress de seda, alça fina, corte enviesado */
  slip: {
    neckWidth: 26, neckDepth: 18, shoulder: 33, shoulderDrop: 5,
    sleeveLength: 12, sleeveOuter: 35, sleeveInner: 29, armhole: 48,
    bust: 52, waistY: 132, waist: 45, hipY: 192, hip: 58,
    hemY: 332, hem: 76, hemCurve: 14,
  },
  /** Trench oversized, ombro estruturado, manga longa */
  trench: {
    neckWidth: 22, neckDepth: 10, shoulder: 54, shoulderDrop: 12,
    sleeveLength: 198, sleeveOuter: 80, sleeveInner: 58, armhole: 98,
    bust: 70, waistY: 152, waist: 63, hipY: 212, hip: 73,
    hemY: 300, hem: 86, hemCurve: 4,
  },
  /** Blusa de manga bufante, decote quadrado, corpo curto */
  bufante: {
    neckWidth: 35, neckDepth: 27, shoulder: 41, shoulderDrop: 7,
    sleeveLength: 132, sleeveOuter: 95, sleeveInner: 51, armhole: 90,
    bust: 57, waistY: 150, waist: 50, hipY: 168, hip: 53,
    hemY: 186, hem: 57, hemCurve: 6,
  },
  /** Vestido godê tomara-que-caia, saia ampla */
  gode: {
    neckWidth: 42, neckDepth: -2, shoulder: 45, shoulderDrop: 2,
    sleeveLength: 8, sleeveOuter: 47, sleeveInner: 43, armhole: 30,
    bust: 51, waistY: 122, waist: 40, hipY: 172, hip: 64,
    hemY: 322, hem: 120, hemCurve: 24,
  },
  /** Alfaiataria fluida: blazer alongado */
  alfaiataria: {
    neckWidth: 18, neckDepth: 34, shoulder: 50, shoulderDrop: 8,
    sleeveLength: 186, sleeveOuter: 72, sleeveInner: 54, armhole: 94,
    bust: 64, waistY: 148, waist: 54, hipY: 208, hip: 66,
    hemY: 268, hem: 70, hemCurve: 3,
  },
  /** Kimono de cetim, manga morcego */
  kimono: {
    neckWidth: 16, neckDepth: 40, shoulder: 48, shoulderDrop: 4,
    sleeveLength: 150, sleeveOuter: 118, sleeveInner: 62, armhole: 120,
    bust: 68, waistY: 156, waist: 64, hipY: 214, hip: 70,
    hemY: 312, hem: 82, hemCurve: 10,
  },
  /** Macacão de linho, perna ampla */
  macacao: {
    neckWidth: 30, neckDepth: 22, shoulder: 42, shoulderDrop: 6,
    sleeveLength: 20, sleeveOuter: 44, sleeveInner: 38, armhole: 52,
    bust: 54, waistY: 138, waist: 43, hipY: 196, hip: 62,
    hemY: 340, hem: 92, hemCurve: 2,
  },
} satisfies Record<string, GarmentShape>

export type ShapeKey = keyof typeof SHAPES

/** Caixa de desenho padrão para qualquer peça do acervo. */
export const GARMENT_VIEWBOX = '-150 -40 300 430'
