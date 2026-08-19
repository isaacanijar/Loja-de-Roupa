import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PhotoMorph, frameOf } from '@/components/art/PhotoMorph'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { Marquee } from '@/components/ui/Marquee'
import { PRODUCTS } from '@/data/products'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import styles from './Hero.module.css'

/* Quatro peças abrem a temporada. O texto ao lado da arte troca junto
   com a silhueta — mesma cadência, mesmo tempo. */
const HERO = ['vestido-alba', 'trench-verao-tardio', 'blusa-serena', 'vestido-noturno']
  .map((slug) => PRODUCTS.find((p) => p.slug === slug)!)
  .map((p) => ({ product: p, colorway: p.colorways[0], frame: frameOf(p) }))

const CYCLE = 4600

export function Hero() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  // o herói afunda de leve enquanto a página sobe
  const artY = useTransform(scrollY, [0, 900], [0, 130])
  const copyY = useTransform(scrollY, [0, 900], [0, 60])
  const fade = useTransform(scrollY, [0, 620], [1, 0])

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % HERO.length), CYCLE)
    return () => window.clearInterval(id)
  }, [reduced])

  const current = HERO[index]

  return (
    <section className={styles.hero}>
      {/* Aqui havia um tecido de seda em WebGL. Ele custava a biblioteca
          3D inteira no primeiro carregamento e um laço de render sem
          pausa — sozinho, mais da metade dos quadros da página inicial.
          Como desde a entrada da fotografia ele é só atmosfera atrás da
          peça, o mesmo efeito passa a ser feito em CSS, de graça. O 3D
          continua no site, na seção de volume, carregado só quando
          entra na tela. */}
      <div className={styles.scene} aria-hidden="true" />

      <div className={['shell', styles.grid].join(' ')}>
        <motion.div className={styles.copy} style={reduced ? undefined : { y: copyY }}>
          <motion.p
            className={['eyebrow', styles.season].join(' ')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Coleção Véspera · Outono 26 · São Paulo
          </motion.p>

          <h1 className={styles.title}>
            <TextReveal as="span" immediate delay={0.45} className={styles.titleLine}>
              Roupa que se move
            </TextReveal>
            <span className={styles.titleItalic}>
              <TextReveal as="span" immediate delay={0.75}>
                antes de você
              </TextReveal>
            </span>
          </h1>

          <motion.p
            className={['lede', styles.lede].join(' ')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Séries de no máximo sessenta peças, cortadas em seda, linho e lã fria. Cada modelagem é
            desenhada no ateliê da Rua Aurora e costurada por quem assina a etiqueta.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button to="/colecao" size="lg">
              Ver o acervo
            </Button>
            <Button to="/provador" variant="ghost" size="lg">
              Agendar provador privado
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className={styles.art} style={reduced ? undefined : { y: artY, opacity: fade }}>
          <PhotoMorph
            frames={HERO.map((f) => f.frame)}
            index={index}
            duration={1.2}
            eager
            className={styles.morph}
          />

          <div className={styles.caption}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={'/produto/' + current.product.slug} className={styles.capName}>
                  {current.product.name}
                </Link>
                <p className={styles.capMeta}>
                  {current.product.fabric} · {current.colorway.name}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className={styles.dots}>
              {HERO.map((frame, i) => (
                <button
                  key={frame.product.id}
                  type="button"
                  className={[styles.dot, i === index ? styles.dotOn : ''].join(' ')}
                  onClick={() => setIndex(i)}
                  aria-label={'Ver ' + frame.product.name}
                >
                  {i === index && !reduced && (
                    <motion.span
                      className={styles.dotFill}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className={styles.bottom}>
        <Marquee
          items={[
            'série curta',
            'tecido rastreável',
            'conserto vitalício',
            'feito à mão em são paulo',
            'provador privado',
          ]}
          speed={46}
        />
      </div>

      <motion.div
        className={styles.cue}
        aria-hidden="true"
        {...(reduced
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6 } }
          : { style: { opacity: fade } })}
      >
        <span>role</span>
        <i />
      </motion.div>
    </section>
  )
}
