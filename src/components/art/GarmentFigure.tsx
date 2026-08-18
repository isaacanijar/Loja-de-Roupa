import { useId } from 'react'
import { motion } from 'framer-motion'
import {
  GARMENT_VIEWBOX,
  SHAPES,
  drapeLines,
  garmentPath,
  waistSeamPath,
  type GarmentShape,
  type ShapeKey,
} from '@/lib/garment'
import type { Colorway } from '@/types/catalog'
import { SilkDefs } from './SilkDefs'
import { useReducedMotion } from '@/hooks/useMediaQuery'

interface GarmentFigureProps {
  shape: ShapeKey | GarmentShape
  colorway: Colorway
  /** ondulação contínua do tecido */
  alive?: boolean
  /** desenha o contorno como se estivesse sendo costurado, ao entrar na tela */
  stitchOnView?: boolean
  /** pendura a peça em um cabide */
  hanger?: boolean
  ripple?: number
  className?: string
  title?: string
}

/**
 * Uma peça do acervo, desenhada a partir da modelagem paramétrica.
 * Nada aqui é imagem: contorno, caimento, brilho e sombra são gerados
 * a partir das mesmas medidas que definem a silhueta.
 */
export function GarmentFigure({
  shape,
  colorway,
  alive = false,
  stitchOnView = true,
  hanger = false,
  ripple = 5,
  className,
  title,
}: GarmentFigureProps) {
  const uid = useId().replace(/[:]/g, '')
  const reduced = useReducedMotion()
  const g: GarmentShape = typeof shape === 'string' ? SHAPES[shape] : shape

  const outline = garmentPath(g)
  const drapes = drapeLines(g)
  const seam = waistSeamPath(g)
  const animate = alive && !reduced

  const stitch = stitchOnView && !reduced

  return (
    <svg
      viewBox={GARMENT_VIEWBOX}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <SilkDefs uid={uid} colorway={colorway} alive={animate} ripple={ripple} />

      {/* chão */}
      <ellipse
        cx="0"
        cy={g.hemY + g.hemCurve + 16}
        rx={g.hem * 1.25 + 26}
        ry="16"
        fill={'url(#' + uid + '-shadow)'}
      />

      {hanger && (
        <g
          fill="none"
          stroke="var(--ink-mute, #7b6672)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        >
          <path d="M0 -36 C -6 -30, -6 -22, 0 -20" />
          <path d={'M0 -20 L ' + -(g.shoulder * 0.78) + ' -4 L ' + g.shoulder * 0.78 + ' -4 Z'} />
        </g>
      )}

      <g filter={'url(#' + uid + '-weave)'}>
        {/* corpo do tecido */}
        <motion.path
          d={outline}
          fill={'url(#' + uid + '-silk)'}
          initial={stitch ? { opacity: 0 } : false}
          whileInView={stitch ? { opacity: 1 } : undefined}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        />

        {/* luz correndo pela peça */}
        <path
          d={outline}
          fill={'url(#' + uid + '-sheen)'}
          style={{ mixBlendMode: 'soft-light' }}
          opacity="0.9"
        />

        {/* caimento: pregas que abrem da cintura para a barra */}
        <g
          fill="none"
          stroke={colorway.shade}
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.34"
        >
          {drapes.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              initial={stitch ? { pathLength: 0, opacity: 0 } : false}
              whileInView={stitch ? { pathLength: 1, opacity: 0.34 } : undefined}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5 + i * 0.09,
              }}
            />
          ))}
          <path d={seam} opacity="0.7" />
        </g>
      </g>

      {/* contorno costurado por último, por cima de tudo */}
      <motion.path
        d={outline}
        fill="none"
        stroke={colorway.shade}
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.75"
        initial={stitch ? { pathLength: 0 } : false}
        whileInView={stitch ? { pathLength: 1 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  )
}
