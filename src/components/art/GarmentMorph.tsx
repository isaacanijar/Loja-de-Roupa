import { useEffect, useId, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import {
  GARMENT_VIEWBOX,
  SHAPES,
  drapeLines,
  easeSilk,
  garmentPath,
  lerpShape,
  waistSeamPath,
  type GarmentShape,
  type ShapeKey,
} from '@/lib/garment'
import type { Colorway } from '@/types/catalog'
import { SilkDefs } from './SilkDefs'
import { useReducedMotion } from '@/hooks/useMediaQuery'

export interface MorphFrame {
  shape: ShapeKey | GarmentShape
  colorway: Colorway
}

interface GarmentMorphProps {
  frames: MorphFrame[]
  /** quadro atual — se omitido, o componente roda sozinho */
  index?: number
  /** troca automática (ms). Ignorado quando `index` é controlado */
  interval?: number
  /** duração da transformação, em segundos */
  duration?: number
  alive?: boolean
  className?: string
  onIndexChange?: (index: number) => void
}

const resolve = (s: ShapeKey | GarmentShape): GarmentShape =>
  typeof s === 'string' ? SHAPES[s] : s

/**
 * A arte de transição do ateliê.
 *
 * Duas peças diferentes têm exatamente a mesma topologia de path
 * (ver lib/garment.ts), então a passagem de uma para a outra é uma
 * interpolação de MEDIDAS — o ombro sobe, a manga cresce, a barra
 * abre — e não um cross-fade entre dois desenhos.
 *
 * Um único subscriber recalcula todos os paths por quadro: uma
 * interpolação de modelagem por frame, não oito.
 */
export function GarmentMorph({
  frames,
  index,
  interval = 4200,
  duration = 1.5,
  alive = true,
  className,
  onIndexChange,
}: GarmentMorphProps) {
  const uid = useId().replace(/[:]/g, '')
  const reduced = useReducedMotion()
  const controlled = index !== undefined

  const [selfIndex, setSelfIndex] = useState(0)
  const current = (controlled ? index! : selfIndex) % frames.length
  const frame = frames[current]

  const [pair, setPair] = useState(() => ({ from: frames[0], to: frames[0] }))
  const progress = useMotionValue(1)
  const first = useRef(true)

  // --- valores animados (paths e geometria da sombra)
  const initial = resolve(frames[0].shape)
  const d = useMotionValue(garmentPath(initial))
  const seam = useMotionValue(waistSeamPath(initial))
  const drapes = [
    useMotionValue(drapeLines(initial)[0]),
    useMotionValue(drapeLines(initial)[1]),
    useMotionValue(drapeLines(initial)[2]),
    useMotionValue(drapeLines(initial)[3]),
  ]
  const shadowY = useMotionValue(initial.hemY + initial.hemCurve + 16)
  const shadowR = useMotionValue(initial.hem * 1.25 + 26)
  const blur = useMotionValue('blur(0px)')

  // roda sozinho quando não é controlado de fora
  useEffect(() => {
    if (controlled || reduced || frames.length < 2) return
    const id = window.setInterval(() => {
      setSelfIndex((i) => {
        const next = (i + 1) % frames.length
        onIndexChange?.(next)
        return next
      })
    }, interval)
    return () => window.clearInterval(id)
  }, [controlled, reduced, interval, frames.length, onIndexChange])

  // troca de quadro → reinicia o percurso
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPair((p) => ({ from: p.to, to: frame }))
    progress.set(0)
    const controls = animate(progress, 1, {
      duration: reduced ? 0.001 : duration,
      ease: 'linear',
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  // recalcula a modelagem a cada frame do percurso corrente
  useEffect(() => {
    const from = resolve(pair.from.shape)
    const to = resolve(pair.to.shape)

    const paint = (v: number) => {
      const s = lerpShape(from, to, easeSilk(v))
      d.set(garmentPath(s))
      seam.set(waistSeamPath(s))
      const dl = drapeLines(s)
      for (let i = 0; i < drapes.length; i++) drapes[i].set(dl[i])
      shadowY.set(s.hemY + s.hemCurve + 16)
      shadowR.set(s.hem * 1.25 + 26)
      // tecido em movimento desfoca de leve no meio do caminho
      const wobble = Math.sin(Math.PI * v) * 2.6
      blur.set('blur(' + wobble.toFixed(2) + 'px)')
    }

    paint(progress.get())
    return progress.on('change', paint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair])

  return (
    <svg
      viewBox={GARMENT_VIEWBOX}
      className={className}
      role="img"
      aria-label={'Peça do acervo em transformação, cor ' + frame.colorway.name}
    >
      <SilkDefs uid={uid} colorway={frame.colorway} alive={alive && !reduced} ripple={6} />

      <motion.ellipse cx="0" cy={shadowY} rx={shadowR} ry="16" fill={'url(#' + uid + '-shadow)'} />

      {/* desfoque de movimento por fora, trama do tecido por dentro:
          empilhar os dois filtros em elementos distintos evita que um
          sobrescreva o outro */}
      <motion.g style={{ filter: blur }}>
        <g filter={'url(#' + uid + '-weave)'}>
          <motion.path d={d} fill={'url(#' + uid + '-silk)'} />
          <motion.path
            d={d}
            fill={'url(#' + uid + '-sheen)'}
            style={{ mixBlendMode: 'soft-light' }}
            opacity="0.9"
          />
          <motion.g
            fill="none"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.32"
            animate={{ stroke: frame.colorway.shade }}
            transition={{ duration }}
          >
            {drapes.map((value, i) => (
              <motion.path key={i} d={value} />
            ))}
            <motion.path d={seam} opacity="0.7" />
          </motion.g>
        </g>
      </motion.g>

      <motion.path
        d={d}
        fill="none"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.7"
        animate={{ stroke: frame.colorway.shade }}
        transition={{ duration }}
      />
    </svg>
  )
}
