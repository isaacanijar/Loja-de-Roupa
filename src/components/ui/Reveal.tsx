import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'

interface RevealProps {
  children: ReactNode
  /** atraso em segundos */
  delay?: number
  /** deslocamento vertical inicial, em px */
  y?: number
  /** desfoque inicial — dá a sensação de tecido assentando */
  blur?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

/** Entrada padrão do site: sobe, desembaça e assenta. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = 5,
  duration = 0.95,
  className,
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(' + blur + 'px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
