import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Wordmark } from '@/components/ui/Wordmark'
import { PhotoMorph, frameOf } from '@/components/art/PhotoMorph'
import { PRODUCTS } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useLockScroll } from '@/hooks/useLockScroll'
import styles from './Header.module.css'

export const NAV = [
  { to: '/colecao', label: 'Acervo' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/atelie', label: 'O ateliê' },
  { to: '/provador', label: 'Provador privado' },
]

/* Tres pecas passam no fundo do menu aberto. */
const MENU_FRAMES = ['vestido-alba', 'trench-verao-tardio', 'vestido-noturno']
  .map((slug) => PRODUCTS.find((p) => p.slug === slug)!)
  .map((p) => frameOf(p))

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const { count, open } = useCart()
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48))
  useLockScroll(menuOpen)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className={[styles.header, scrolled ? styles.solid : ''].join(' ')}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand} aria-label="MALVA — página inicial">
            <Wordmark />
          </Link>

          <nav className={styles.nav} aria-label="Navegação principal">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => [styles.link, isActive ? styles.linkOn : ''].join(' ')}
              >
                <span>{item.label}</span>
                <i className={styles.linkRule} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.bag} onClick={open}>
              <span>Sacola</span>
              <span className={styles.count} key={count}>
                <motion.span
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {String(count).padStart(2, '0')}
                </motion.span>
              </span>
            </button>

            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span className={[styles.bar, menuOpen ? styles.barTop : ''].join(' ')} />
              <span className={[styles.bar, menuOpen ? styles.barBottom : ''].join(' ')} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.72, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className={styles.overlayInner}>
              <nav className={styles.bigNav} aria-label="Navegação">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ y: 46, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.24 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={item.to} className={styles.bigLink}>
                      <span className={styles.bigIndex}>{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                className={styles.overlayArt}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <PhotoMorph frames={MENU_FRAMES} interval={3000} duration={1.1} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
