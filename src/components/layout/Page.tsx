import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useMediaQuery'

interface PageProps {
  children: React.ReactNode
  /** título da aba */
  title: string
  className?: string
}

/** Casca de página: título do documento, entrada suave e foco no topo. */
export function Page({ children, title, className }: PageProps) {
  useEffect(() => {
    document.title = title + ' · MALVA'
  }, [title])

  return (
    <motion.main
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      {children}
    </motion.main>
  )
}

/**
 * Sobe a página no momento em que o véu de transição cobre a tela,
 * para a cliente nunca ver o salto.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      window.scrollTo(0, 0)
      return
    }
    const id = window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 430)
    return () => window.clearTimeout(id)
  }, [pathname, reduced])

  return null
}
