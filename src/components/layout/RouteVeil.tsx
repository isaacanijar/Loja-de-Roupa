import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MalvaMark } from '@/components/ui/Wordmark'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import styles from './RouteVeil.module.css'

const PANELS = ['#2B1620', '#9D5B81', '#E3B7CE', '#F2DDE8', '#FBF7F4']

/**
 * Arte de transição entre telas: cinco painéis de tecido sobem pela
 * tela, se encontram no centro e seguem para cima, revelando a página
 * nova por trás. Cada painel sai com um atraso mínimo — é o que dá a
 * sensação de pano, e não de cortina rígida.
 */
export function RouteVeil() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const [first, setFirst] = useState(true)

  useEffect(() => {
    if (first) {
      setFirst(false)
      return
    }
    setRun((n) => n + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (reduced) return null

  return (
    <AnimatePresence>
      {run > 0 && (
        <motion.div
          key={run}
          className={styles.veil}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.01, delay: 1.15 } }}
        >
          {PANELS.map((color, i) => (
            <motion.span
              key={color}
              className={styles.panel}
              style={{ background: color }}
              initial={{ y: '101%' }}
              animate={{ y: ['101%', '0%', '0%', '-101%'] }}
              transition={{
                duration: 1.15,
                times: [0, 0.42, 0.5, 1],
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.035,
              }}
            />
          ))}

          <motion.span
            className={styles.mark}
            initial={{ opacity: 0, scale: 0.7, rotate: -40 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 1.1], rotate: [-40, 0, 0, 40] }}
            transition={{ duration: 1.15, times: [0, 0.42, 0.56, 0.86], ease: 'easeInOut' }}
          >
            <MalvaMark />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
