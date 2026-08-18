import { motion } from 'framer-motion'
import type { Colorway } from '@/types/catalog'

interface SilkDefsProps {
  /** prefixo único de ids — venha de useId() para não colidir entre instâncias */
  uid: string
  colorway: Colorway
  /** ondula o tecido continuamente (usar só em destaque: herói, lookbook, produto) */
  alive?: boolean
  /** intensidade do deslocamento do tecido */
  ripple?: number
}

/**
 * Todo o "tecido" do site nasce destas definições:
 *  · silk   — degradê de seda, do brilho do fio à sombra da prega
 *  · sheen  — faixa de luz que atravessa a peça
 *  · weave  — turbulência que quebra a borda vetorial e dá trama
 *  · shadow — a sombra que a peça projeta no chão
 */
export function SilkDefs({ uid, colorway, alive = false, ripple = 5 }: SilkDefsProps) {
  const t = 12 // duração base da ondulação, em segundos

  return (
    <defs>
      <linearGradient id={uid + '-silk'} x1="0.12" y1="0" x2="0.88" y2="1">
        <motion.stop
          offset="0%"
          animate={{ stopColor: colorway.sheen }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.stop
          offset="42%"
          animate={{ stopColor: colorway.hex }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.stop
          offset="100%"
          animate={{ stopColor: colorway.shade }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </linearGradient>

      {/* faixa de luz — corre devagar pela peça, como cetim girando */}
      <linearGradient id={uid + '-sheen'} x1="0" y1="0" x2="1" y2="0.25">
        <stop offset="0%" stopColor={colorway.sheen} stopOpacity="0" />
        <stop offset="42%" stopColor={colorway.sheen} stopOpacity="0.55" />
        <stop offset="58%" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="100%" stopColor={colorway.sheen} stopOpacity="0" />
        {alive && (
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-0.75 0; 0.75 0; -0.75 0"
            dur={t + 's'}
            repeatCount="indefinite"
          />
        )}
      </linearGradient>

      {/* sombra projetada sob a barra */}
      <radialGradient id={uid + '-shadow'}>
        <stop offset="0%" stopColor="#2B1620" stopOpacity="0.28" />
        <stop offset="65%" stopColor="#2B1620" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#2B1620" stopOpacity="0" />
      </radialGradient>

      {/* trama: tira o aspecto "vetor perfeito" da borda */}
      <filter id={uid + '-weave'} x="-18%" y="-12%" width="136%" height="128%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.011 0.026"
          numOctaves="2"
          seed="7"
          result="noise"
        >
          {alive && (
            <animate
              attributeName="baseFrequency"
              values="0.011 0.026; 0.016 0.019; 0.011 0.026"
              dur={t * 1.6 + 's'}
              repeatCount="indefinite"
            />
          )}
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={ripple}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      {/* grão de tecido aplicado por cima, em multiply */}
      <filter id={uid + '-grain'}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.14" />
        </feComponentTransfer>
      </filter>
    </defs>
  )
}
