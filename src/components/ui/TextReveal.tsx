import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import styles from './TextReveal.module.css'

/** Tags suportadas — pré-instanciadas para não recriar componentes a cada render. */
const TAGS = {
  span: motion.span,
  p: motion.p,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const

type TagName = keyof typeof TAGS

interface TextRevealProps {
  children: string
  as?: TagName
  className?: string
  /** atraso inicial, em segundos */
  delay?: number
  /** intervalo entre palavras */
  stagger?: number
  /** dispara ao montar em vez de ao entrar na tela */
  immediate?: boolean
}

/**
 * Revela o texto palavra por palavra, cada uma subindo de trás de uma
 * linha invisível — o mesmo gesto de uma cortina de provador abrindo.
 * Usado em todos os títulos do site.
 */
export function TextReveal({
  children,
  as = 'span',
  className,
  delay = 0,
  stagger = 0.045,
  immediate = false,
}: TextRevealProps) {
  const reduced = useReducedMotion()
  const words = children.split(' ')
  const MotionTag = TAGS[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: 'shown' as const }
        : { whileInView: 'shown' as const, viewport: { once: true, amount: 0.35 } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={children}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.mask} aria-hidden="true">
            <motion.span
              className={styles.word}
              variants={{
                hidden: { y: '110%', rotate: 2.4, opacity: 0 },
                shown: { y: '0%', rotate: 0, opacity: 1 },
              }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </MotionTag>
  )
}
