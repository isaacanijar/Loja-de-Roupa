import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { photoOf } from '@/lib/photo'
import type { Colorway, Product } from '@/types/catalog'
import styles from './PhotoMorph.module.css'

export interface PhotoFrame {
  src: string
  alt: string
}

/** Monta o quadro a partir de uma peça do acervo e de um banho de cor. */
export const frameOf = (product: Product, colorway?: Colorway): PhotoFrame => {
  const tom = colorway ?? product.colorways[0]
  return { src: photoOf(product, tom), alt: product.name + ' em ' + tom.name }
}

interface PhotoMorphProps {
  frames: PhotoFrame[]
  /** quadro atual — se omitido, o componente roda sozinho */
  index?: number
  /** troca automática (ms). Ignorado quando `index` é controlado */
  interval?: number
  /** duração da passagem, em segundos */
  duration?: number
  /** a primeira foto entra sem espera — use no herói */
  eager?: boolean
  className?: string
  onIndexChange?: (index: number) => void
}

/**
 * A passagem entre peças, em fotografia.
 *
 * Duas fotografias não podem ser interpoladas como as modelagens do
 * ateliê são (ver lib/garment.ts): entre elas só existe dissolução. O
 * que dá caráter à troca aqui é o gesto — a peça que sai desfoca e
 * recua meio grau, a que entra assenta —, o mesmo vocabulário de
 * tecido caindo que o resto do site usa.
 */
export function PhotoMorph({
  frames,
  index,
  interval = 4200,
  duration = 1.1,
  eager = false,
  className,
  onIndexChange,
}: PhotoMorphProps) {
  const reduced = useReducedMotion()
  const controlled = index !== undefined
  const [selfIndex, setSelfIndex] = useState(0)

  const current = (controlled ? index! : selfIndex) % frames.length
  const frame = frames[current]

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

  return (
    <div className={[styles.stack, className ?? ''].join(' ')}>
      <AnimatePresence initial={false}>
        <motion.img
          key={frame.src}
          src={frame.src}
          alt={frame.alt}
          className={styles.photo}
          width={900}
          height={1200}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          initial={reduced ? false : { opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
          transition={{ duration: reduced ? 0.001 : duration, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  )
}
