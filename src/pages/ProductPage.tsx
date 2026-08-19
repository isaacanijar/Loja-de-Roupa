import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { GarmentFigure } from '@/components/art/GarmentFigure'
import { LazyDressViewer } from '@/components/three/Stage3D'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { useCart } from '@/context/CartContext'
import { getProduct, relatedProducts } from '@/data/products'
import { installments, money } from '@/lib/format'
import styles from './ProductPage.module.css'

type View = 'desenho' | 'volume'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProduct(slug) : undefined

  const [tone, setTone] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [view, setView] = useState<View>('desenho')
  const [openNote, setOpenNote] = useState<number | null>(0)
  const [sizeAlert, setSizeAlert] = useState(false)

  const { add } = useCart()

  // troca de peça pela navegação de "peças irmãs": zera as escolhas
  useEffect(() => {
    setTone(0)
    setSize(null)
    setView('desenho')
    setOpenNote(0)
    setSizeAlert(false)
  }, [slug])

  if (!product) return <Navigate to="/colecao" replace />

  const colorway = product.colorways[tone]
  const irmas = relatedProducts(product, 3)
  const tamanhoUnico = product.sizes.length === 1
  const escolhido = tamanhoUnico ? product.sizes[0] : size

  const handleAdd = () => {
    if (!escolhido) {
      setSizeAlert(true)
      return
    }
    setSizeAlert(false)
    add(product, escolhido, colorway)
  }

  return (
    <Page title={product.name} className={styles.page}>
      <nav className={['shell', styles.crumbs].join(' ')} aria-label="Você está em">
        <Link to="/colecao">Acervo</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      {/* ---------------------------------------------------------
          Peça + escolhas
          --------------------------------------------------------- */}
      <section className={['shell', styles.main].join(' ')}>
        {/* ---- palco ---- */}
        <div className={styles.stage}>
          <div
            className={styles.stageWash}
            style={{
              background:
                'radial-gradient(112% 82% at 50% 12%, ' + colorway.hex + '38, transparent 74%)',
            }}
            aria-hidden="true"
          />

          <div className={styles.stageInner}>
            <AnimatePresence mode="wait">
              {view === 'desenho' ? (
                <motion.div
                  key="desenho"
                  className={styles.stageSlot}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GarmentFigure
                    shape={product.shape}
                    colorway={colorway}
                    alive
                    stitchOnView={false}
                    className={styles.figure}
                    title={product.name + ' em ' + colorway.name}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="volume"
                  className={styles.stageSlot}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LazyDressViewer
                    shape={product.shape}
                    colorway={colorway}
                    className={styles.canvas}
                    placeholder={
                      <GarmentFigure
                        shape={product.shape}
                        colorway={colorway}
                        stitchOnView={false}
                        className={styles.figure}
                      />
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.viewToggle} role="tablist" aria-label="Modo de visualização">
            {(['desenho', 'volume'] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                className={[styles.viewBtn, view === v ? styles.viewOn : ''].join(' ')}
                onClick={() => setView(v)}
              >
                {view === v && (
                  <motion.span
                    layoutId="produto-view"
                    className={styles.viewFill}
                    transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  />
                )}
                <span>{v === 'desenho' ? 'Desenho' : 'Volume 3D'}</span>
              </button>
            ))}
          </div>

          {product.badge && <span className={styles.badge}>{product.badge}</span>}
        </div>

        {/* ---- painel de escolhas ---- */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <p className="eyebrow">
              {product.category.replace('-', ' ')} · série de {product.edition}
            </p>
            <TextReveal as="h1" immediate className={styles.name}>
              {product.name}
            </TextReveal>
            <p className={styles.subtitle}>{product.subtitle}</p>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{money(product.price)}</span>
            <span className={styles.installments}>ou {installments(product.price)}</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          {/* cores */}
          <div className={styles.choice}>
            <div className={styles.choiceHead}>
              <span className="eyebrow">Cor</span>
              <span className={styles.choiceValue}>{colorway.name}</span>
            </div>
            <div className={styles.swatches}>
              {product.colorways.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  className={[styles.swatch, i === tone ? styles.swatchOn : ''].join(' ')}
                  style={{ background: c.hex }}
                  onClick={() => setTone(i)}
                  aria-label={'Ver em ' + c.name}
                  aria-pressed={i === tone}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* tamanhos */}
          <div className={styles.choice}>
            <div className={styles.choiceHead}>
              <span className="eyebrow">Tamanho</span>
              <Link to="/provador" className={styles.choiceLink}>
                não sei o meu
              </Link>
            </div>
            <div className={styles.sizes}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={[styles.size, escolhido === s ? styles.sizeOn : ''].join(' ')}
                  onClick={() => {
                    setSize(s)
                    setSizeAlert(false)
                  }}
                  aria-pressed={escolhido === s}
                >
                  {s}
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {sizeAlert && (
                <motion.p
                  className={styles.sizeAlert}
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  Escolha um tamanho para continuar.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.actions}>
            <Button size="lg" block onClick={handleAdd}>
              Adicionar à sacola
            </Button>
            <Button to="/provador" variant="outline" size="lg" block>
              Provar antes no ateliê
            </Button>
          </div>

          {/* ficha do ateliê */}
          <div className={styles.notes}>
            <p className="eyebrow">Notas do ateliê</p>
            {product.atelier.map((note, i) => {
              const open = openNote === i
              return (
                <div key={note.label} className={[styles.note, open ? styles.noteOn : ''].join(' ')}>
                  <button
                    type="button"
                    className={styles.noteBtn}
                    onClick={() => setOpenNote(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span>{note.label}</span>
                    <i aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        className={styles.noteBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p>{note.value}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <dl className={styles.spec}>
            <div>
              <dt>Tecido</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Origem</dt>
              <dd>{product.origin}</dd>
            </div>
            <div>
              <dt>Série</dt>
              <dd>{product.edition} peças numeradas</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------
          Garantias
          --------------------------------------------------------- */}
      <section className={styles.promises}>
        <div className={['shell', styles.promisesGrid].join(' ')}>
          {[
            { t: 'Conserto vitalício', d: 'Barra, botão, zíper, costura aberta. Sem prazo e sem custo.' },
            { t: 'Troca em 30 dias', d: 'Peça sem uso, com etiqueta. A logística é por nossa conta.' },
            { t: 'Envio em 3 dias úteis', d: 'A peça sai embrulhada em papel de seda e caixa reutilizável.' },
            { t: 'Ficha técnica aberta', d: 'Tecido, origem, horas de trabalho e quem costurou.' },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 0.07} className={styles.promise}>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------
          Peças irmãs
          --------------------------------------------------------- */}
      <section className={['shell', styles.related].join(' ')}>
        <div className={styles.relatedHead}>
          <p className="eyebrow">Da mesma arara</p>
          <TextReveal as="h2" className={styles.relatedTitle}>
            Peças irmãs
          </TextReveal>
        </div>

        <div className={styles.relatedGrid}>
          {irmas.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </Page>
  )
}
