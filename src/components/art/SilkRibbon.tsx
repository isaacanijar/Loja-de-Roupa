import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useMediaQuery'

interface SilkRibbonProps {
  /** cores da fita, do começo ao fim */
  colors?: [string, string, string]
  /** altura da onda */
  amplitude?: number
  /** espessura da fita */
  thickness?: number
  /** segundos por ciclo completo */
  speed?: number
  opacity?: number
  className?: string
}

const W = 1200
const H = 220
const STEPS = 12

/**
 * Uma faixa de seda que atravessa a página entre as seções.
 * O path é gerado por uma soma de senos — três estados são
 * pré-calculados e a fita percorre os três em loop, então a
 * ondulação é contínua sem custo de recálculo por frame.
 */
function ribbon(phase: number, amplitude: number, thickness: number): string {
  const top: string[] = []
  const bottom: string[] = []

  for (let i = 0; i <= STEPS; i++) {
    const x = (W / STEPS) * i
    const k = i / STEPS
    const wave =
      Math.sin(k * Math.PI * 2.2 + phase) * amplitude +
      Math.sin(k * Math.PI * 4.6 + phase * 1.7) * amplitude * 0.32
    const taper = 0.55 + Math.sin(k * Math.PI) * 0.45
    top.push(x + ' ' + (H / 2 + wave - thickness * taper))
    bottom.push(x + ' ' + (H / 2 + wave + thickness * taper * 0.7))
  }

  /** Encadeia os pontos com cúbicas suaves (S), sem repetir o ponto inicial. */
  const smooth = (pts: string[]) =>
    pts
      .slice(1)
      .map((p, i) => {
        const [px] = pts[i].split(' ').map(Number)
        const [cx, cy] = p.split(' ').map(Number)
        const mid = (px + cx) / 2
        return 'S ' + mid + ' ' + cy + ', ' + cx + ' ' + cy
      })
      .join(' ')

  const back = [...bottom].reverse()

  return (
    'M ' + top[0] + ' ' + smooth(top) +
    ' L ' + back[0] + ' ' + smooth(back) +
    ' Z'
  )
}

export function SilkRibbon({
  colors = ['#E3B7CE', '#E6D0B3', '#CF92B3'],
  amplitude = 26,
  thickness = 34,
  speed = 16,
  opacity = 0.75,
  className,
}: SilkRibbonProps) {
  const uid = useId().replace(/[:]/g, '')
  const reduced = useReducedMotion()

  const states = useMemo(
    () => [0, 2.1, 4.2].map((p) => ribbon(p, amplitude, thickness)),
    [amplitude, thickness],
  )

  return (
    <svg
      viewBox={'0 0 ' + W + ' ' + H}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid + '-r'} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
        <filter id={uid + '-soft'} x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <motion.path
        d={states[0]}
        fill={'url(#' + uid + '-r)'}
        opacity={opacity}
        filter={'url(#' + uid + '-soft)'}
        animate={reduced ? undefined : { d: [states[0], states[1], states[2], states[0]] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}
