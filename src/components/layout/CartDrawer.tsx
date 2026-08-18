import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GarmentFigure } from '@/components/art/GarmentFigure'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { useLockScroll } from '@/hooks/useLockScroll'
import { money } from '@/lib/format'
import styles from './CartDrawer.module.css'

/** A sacola do ateliê — abre por cima da página, sem tirar a cliente do lugar. */
export function CartDrawer() {
  const { isOpen, close, lines, subtotal, count, setQty, remove, lastAdded } = useCart()
  useLockScroll(isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.root}
          initial="hidden"
          animate="shown"
          exit="hidden"
          key="cart"
        >
          <motion.button
            type="button"
            className={styles.scrim}
            aria-label="Fechar sacola"
            onClick={close}
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
            transition={{ duration: 0.5 }}
          />

          <motion.aside
            className={styles.panel}
            role="dialog"
            aria-label="Sacola"
            variants={{ hidden: { x: '100%' }, shown: { x: 0 } }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className={styles.head}>
              <div>
                <p className="eyebrow">Sacola</p>
                <h2 className={styles.title}>
                  {count === 0 ? 'Ainda vazia' : count + (count === 1 ? ' peça' : ' peças')}
                </h2>
              </div>
              <button type="button" className={styles.close} onClick={close} aria-label="Fechar">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </header>

            {lines.length === 0 ? (
              <div className={styles.empty}>
                <p className="lede">
                  Nada por aqui ainda. O acervo é curto de propósito — cada série sai do ateliê uma
                  vez só.
                </p>
                <Button to="/colecao" variant="outline" onClick={close}>
                  Ver o acervo
                </Button>
              </div>
            ) : (
              <>
                <ul className={styles.lines}>
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.key}
                        className={[
                          styles.line,
                          lastAdded === line.key ? styles.lineFresh : '',
                        ].join(' ')}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div
                          className={styles.thumb}
                          style={{ background: line.colorway.hex + '22' }}
                        >
                          <GarmentFigure
                            shape={line.product.shape}
                            colorway={line.colorway}
                            stitchOnView={false}
                            ripple={3}
                          />
                        </div>

                        <div className={styles.info}>
                          <Link to={'/produto/' + line.product.slug} onClick={close}>
                            <h3 className={styles.name}>{line.product.name}</h3>
                          </Link>
                          <p className={styles.meta}>
                            {line.colorway.name} · Tam. {line.size}
                          </p>

                          <div className={styles.qty}>
                            <button
                              type="button"
                              onClick={() => setQty(line.key, line.qty - 1)}
                              aria-label="Diminuir"
                            >
                              –
                            </button>
                            <span>{line.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(line.key, line.qty + 1)}
                              aria-label="Aumentar"
                              disabled={line.qty >= 5}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className={styles.side}>
                          <span className={styles.price}>{money(line.product.price * line.qty)}</span>
                          <button
                            type="button"
                            className={styles.remove}
                            onClick={() => remove(line.key)}
                          >
                            remover
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className={styles.foot}>
                  <div className={styles.totalRow}>
                    <span className="eyebrow">Subtotal</span>
                    <motion.span
                      key={subtotal}
                      className={styles.total}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {money(subtotal)}
                    </motion.span>
                  </div>
                  <p className={styles.note}>
                    Frete e impostos calculados na finalização. Peças sob medida seguem para
                    orçamento após a prova.
                  </p>
                  <Button block>Finalizar pedido</Button>
                  <Button to="/provador" variant="ghost" block onClick={close}>
                    Prefiro provar antes
                  </Button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
