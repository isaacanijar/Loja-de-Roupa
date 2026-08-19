import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { GarmentMorph } from '@/components/art/GarmentMorph'
import { SilkRibbon } from '@/components/art/SilkRibbon'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { LOOKS } from '@/data/looks'
import { getProduct } from '@/data/products'
import { money } from '@/lib/format'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import styles from './Lookbook.module.css'

const FRAMES = LOOKS.map((l) => ({ shape: l.shape, colorway: l.colorway }))

export default function Lookbook() {
  const trilho = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  /* A rolagem do trilho é o único controle do morph: cada fatia do
     percurso corresponde a um look, e a peça se transforma no caminho
     entre uma fatia e a seguinte. */
  const { scrollYProgress } = useScroll({
    target: trilho,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(LOOKS.length - 1, Math.max(0, Math.round(v * (LOOKS.length - 1))))
    setIndex((prev) => (prev === next ? prev : next))
  })

  const barra = useTransform(scrollYProgress, (v) => v * 100 + '%')

  const look = LOOKS[index]
  const produto = getProduct(look.productSlug)

  return (
    <Page title="Lookbook Véspera">
      {/* ---------------------------------------------------------
          Abertura
          --------------------------------------------------------- */}
      <header className={['shell', styles.head].join(' ')}>
        <p className="eyebrow">Editorial · Outono 26</p>
        <TextReveal as="h1" immediate className={styles.title}>
          Véspera
        </TextReveal>
        <p className={['lede', styles.intro].join(' ')}>
          Cinco looks em um único dia, das seis e quarenta e sete da manhã até a hora de sair. Role
          a página: a peça não é trocada por outra imagem — é a mesma modelagem mudando de medida,
          o ombro subindo, a manga crescendo, a barra abrindo.
        </p>
        <div className={styles.headRibbon} aria-hidden="true">
          <SilkRibbon opacity={0.6} amplitude={22} thickness={26} />
        </div>
      </header>

      {/* ---------------------------------------------------------
          Trilho editorial
          --------------------------------------------------------- */}
      <div ref={trilho} className={styles.rail}>
        <div className={styles.sticky}>
          <div className={['shell', styles.stage].join(' ')}>
            {/* ---- peça em transformação ---- */}
            <div className={styles.art}>
              <div
                className={styles.wash}
                style={{
                  background:
                    'radial-gradient(96% 76% at 50% 18%, ' +
                    look.colorway.hex +
                    '3d, transparent 72%)',
                }}
                aria-hidden="true"
              />
              <GarmentMorph
                frames={FRAMES}
                index={index}
                duration={1.5}
                className={styles.morph}
              />
            </div>

            {/* ---- legenda do look ---- */}
            <div className={styles.copy}>
              <div className={styles.counter} aria-hidden="true">
                <span className={styles.counterNow}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.counterAll}>/ {String(LOOKS.length).padStart(2, '0')}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={look.id}
                  className={styles.copyInner}
                  initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(5px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow">{look.subtitle}</p>
                  <h2 className={styles.lookTitle}>{look.title}</h2>
                  <p className={styles.caption}>{look.caption}</p>

                  {produto && (
                    <div className={styles.piece}>
                      <span className="eyebrow">Peça em cena</span>
                      <Link to={'/produto/' + produto.slug} className={styles.pieceName}>
                        {produto.name}
                      </Link>
                      <p className={styles.pieceMeta}>
                        {produto.fabric} · {look.colorway.name} · {money(produto.price)}
                      </p>
                      <Button to={'/produto/' + produto.slug} variant="outline">
                        Ver a ficha
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* régua de progresso — coluna vertical no desktop */}
              <div className={styles.progress} aria-hidden="true">
                <motion.span className={styles.progressFill} style={{ height: barra }} />
                <ol className={styles.marks}>
                  {LOOKS.map((l, i) => (
                    <li
                      key={l.id}
                      className={[styles.mark, i <= index ? styles.markOn : ''].join(' ')}
                    >
                      {l.title}
                    </li>
                  ))}
                </ol>
              </div>

              {/* a mesma régua, deitada, para telas estreitas */}
              <div className={styles.progressBar} aria-hidden="true">
                <motion.span style={{ width: barra }} />
              </div>
            </div>
          </div>

          {!reduced && (
            <p className={styles.hint} aria-hidden="true">
              role para trocar o look
            </p>
          )}
        </div>

        {/* fatias invisíveis: dão altura ao trilho e ancoram cada look */}
        {LOOKS.map((l) => (
          <section key={l.id} className={styles.slice} aria-label={l.subtitle + ' — ' + l.title}>
            <h2 className="sr-only">{l.title}</h2>
            <p className="sr-only">{l.caption}</p>
          </section>
        ))}
      </div>

      {/* ---------------------------------------------------------
          Contatos do editorial
          --------------------------------------------------------- */}
      <section className={['shell', styles.credits].join(' ')}>
        <div className={styles.creditsGrid}>
          <div>
            <p className="eyebrow">Direção</p>
            <p>Camila Reis</p>
          </div>
          <div>
            <p className="eyebrow">Modelagem</p>
            <p>Rita Okamoto</p>
          </div>
          <div>
            <p className="eyebrow">Locação</p>
            <p>Ateliê da Rua Aurora, São Paulo</p>
          </div>
          <div>
            <p className="eyebrow">Data</p>
            <p>Um dia inteiro de março</p>
          </div>
        </div>

        <div className={styles.creditsCta}>
          <TextReveal as="h2" className={styles.creditsTitle}>
            As cinco peças estão no acervo
          </TextReveal>
          <div className={styles.creditsActions}>
            <Button to="/colecao" size="lg">
              Ver o acervo
            </Button>
            <Button to="/provador" variant="ghost" size="lg">
              Provar no ateliê
            </Button>
          </div>
        </div>
      </section>
    </Page>
  )
}
