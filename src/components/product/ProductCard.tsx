import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { money } from '@/lib/format'
import { photoOf } from '@/lib/photo'
import type { Product } from '@/types/catalog'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  /** posição na grade — escalona a entrada */
  index?: number
  /** cartão alto, para a grade editorial */
  tall?: boolean
}

/**
 * Peça na arara. Cada banho de cor é uma fotografia própria, feita no
 * mesmo fundo e na mesma luz — trocar o tom troca a foto por dissolução,
 * sem a peça sair do lugar.
 */
export function ProductCard({ product, index = 0, tall = false }: ProductCardProps) {
  const [tone, setTone] = useState(0)
  const colorway = product.colorways[tone % product.colorways.length]

  return (
    <motion.article
      className={[styles.card, tall ? styles.tall : ''].join(' ')}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={'/produto/' + product.slug} className={styles.frame}>
        <AnimatePresence initial={false}>
          <motion.img
            key={colorway.name}
            src={photoOf(product, colorway)}
            alt={product.name + ' em ' + colorway.name}
            className={styles.photo}
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            width={900}
            height={1200}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {product.badge && <span className={styles.badge}>{product.badge}</span>}

        <span className={styles.cta}>
          ver peça
          <svg viewBox="0 0 22 8" aria-hidden="true">
            <path
              d="M0 4h19M16 1l3 3-3 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </Link>

      <div className={styles.info}>
        <div className={styles.head}>
          <h3 className={styles.name}>
            <Link to={'/produto/' + product.slug}>{product.name}</Link>
          </h3>
          <span className={styles.price}>{money(product.price)}</span>
        </div>

        <p className={styles.subtitle}>{product.subtitle}</p>

        <div className={styles.foot}>
          <span className={styles.fabric}>{product.fabric}</span>
          <div className={styles.tones} aria-label="Cores disponíveis">
            {product.colorways.map((c, i) => (
              <button
                key={c.name}
                type="button"
                className={[styles.tone, i === tone % product.colorways.length ? styles.toneOn : ''].join(' ')}
                style={{ background: c.hex }}
                onMouseEnter={() => setTone(i)}
                onFocus={() => setTone(i)}
                onClick={() => setTone(i)}
                aria-label={'Ver em ' + c.name}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
