import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Wordmark } from '@/components/ui/Wordmark'
import { SilkRibbon } from '@/components/art/SilkRibbon'
import { ATELIER_INFO } from '@/data/atelier'
import { NAV } from './Header'
import styles from './Footer.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

/** Carta do ateliê — o formulário curto do rodapé. */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setState('error')
      return
    }
    setState('done')
  }

  return (
    <form className={styles.news} onSubmit={submit} noValidate>
      <label htmlFor="news-email" className={styles.newsLabel}>
        A carta do ateliê
      </label>
      <p className={styles.newsCopy}>
        Uma carta por mês: o que está na mesa de corte, que tecido chegou e quando abre a próxima
        série. Nada além disso.
      </p>

      <div className={[styles.newsRow, state === 'error' ? styles.newsBad : ''].join(' ')}>
        <input
          id="news-email"
          type="email"
          value={email}
          placeholder="seu@email.com"
          onChange={(e) => {
            setEmail(e.target.value)
            if (state !== 'idle') setState('idle')
          }}
          disabled={state === 'done'}
          aria-invalid={state === 'error'}
        />
        <button type="submit" disabled={state === 'done'} aria-label="Assinar a carta">
          <svg viewBox="0 0 30 12" aria-hidden="true">
            <path
              d="M0 6h27M22 1l5 5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state === 'error' && (
          <motion.p
            key="err"
            className={styles.newsMsg}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Confere o e-mail? Está faltando alguma coisa.
          </motion.p>
        )}
        {state === 'done' && (
          <motion.p
            key="ok"
            className={styles.newsMsg}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Pronto. A próxima carta sai na primeira terça do mês.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={['theme-ink', styles.footer].join(' ')}>
      <SilkRibbon
        className={styles.ribbon}
        colors={['#9D5B81', '#C8A06A', '#E3B7CE']}
        opacity={0.5}
        amplitude={18}
        thickness={22}
        speed={22}
      />

      <div className={['shell', styles.grid].join(' ')}>
        <div className={styles.brandCol}>
          <Wordmark signature className={styles.brand} />
          <p className={styles.pitch}>
            Ateliê de moda feminina autoral. Série curta, tecido rastreável e conserto vitalício —
            desde 2016, na Vila Buarque.
          </p>
        </div>

        <nav className={styles.col} aria-label="Navegação do rodapé">
          <h3 className={styles.colTitle}>Navegar</h3>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Ateliê</h3>
          <ul>
            <li>{ATELIER_INFO.address}</li>
            <li>{ATELIER_INFO.hours}</li>
            <li>
              <a href={'tel:' + ATELIER_INFO.phone.replace(/\D/g, '')}>{ATELIER_INFO.phone}</a>
            </li>
            <li>
              <a href={'mailto:' + ATELIER_INFO.email}>{ATELIER_INFO.email}</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                {ATELIER_INFO.instagram}
              </a>
            </li>
          </ul>
        </div>

        <Newsletter />
      </div>

      <div className={['shell', styles.base].join(' ')}>
        <p>© {year} MALVA Ateliê Ltda · CNPJ 00.000.000/0001-00</p>
        <p className={styles.made}>
          Todas as peças desenhadas e costuradas em São Paulo. Cada peça é fotografada uma vez
          por banho de cor, em manequim invisível, sem retoque de silhueta.
        </p>
      </div>
    </footer>
  )
}
