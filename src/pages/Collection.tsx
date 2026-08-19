import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { ProductCard } from '@/components/product/ProductCard'
import { GarmentMorph } from '@/components/art/GarmentMorph'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { CATEGORIES, PRODUCTS, type CategoryFilter } from '@/data/products'
import { money } from '@/lib/format'
import styles from './Collection.module.css'

type Sort = 'curadoria' | 'menor' | 'maior' | 'serie'

const SORTS: { key: Sort; label: string }[] = [
  { key: 'curadoria', label: 'Curadoria do ateliê' },
  { key: 'menor', label: 'Menor preço' },
  { key: 'maior', label: 'Maior preço' },
  { key: 'serie', label: 'Série mais curta' },
]

/* A peça-índice do cabeçalho troca de forma conforme o filtro:
   escolher "alfaiataria" faz o vestido virar blazer na sua frente. */
const INDEX_FRAMES: Record<CategoryFilter, string> = {
  todos: 'vestido-alba',
  vestidos: 'vestido-noturno',
  alfaiataria: 'trench-verao-tardio',
  blusas: 'kimono-lumen',
  'sob-medida': 'macacao-praia-funda',
}

export default function Collection() {
  const [filter, setFilter] = useState<CategoryFilter>('todos')
  const [sort, setSort] = useState<Sort>('curadoria')

  const list = useMemo(() => {
    const base = filter === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)
    const copy = [...base]
    if (sort === 'menor') copy.sort((a, b) => a.price - b.price)
    if (sort === 'maior') copy.sort((a, b) => b.price - a.price)
    if (sort === 'serie') copy.sort((a, b) => a.edition - b.edition)
    return copy
  }, [filter, sort])

  const faixa = useMemo(() => {
    if (list.length === 0) return null
    const precos = list.map((p) => p.price)
    return { min: Math.min(...precos), max: Math.max(...precos) }
  }, [list])

  /* Um quadro por categoria — o morph do cabeçalho lê o índice atual. */
  const frames = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const product = PRODUCTS.find((p) => p.slug === INDEX_FRAMES[c.key])!
        return { shape: product.shape, colorway: product.colorways[0] }
      }),
    [],
  )

  const frameIndex = CATEGORIES.findIndex((c) => c.key === filter)

  return (
    <Page title="Acervo">
      {/* ---------------------------------------------------------
          Cabeçalho
          --------------------------------------------------------- */}
      <header className={['shell', styles.head].join(' ')}>
        <div className={styles.headCopy}>
          <p className="eyebrow">Coleção Véspera · Outono 26</p>
          <TextReveal as="h1" immediate className={styles.title}>
            O acervo
          </TextReveal>
          <p className={['lede', styles.intro].join(' ')}>
            Oito modelagens abertas nesta temporada. Cada uma existe em série curta e sai do ateliê
            com a ficha técnica completa: tecido, origem do fio, horas de trabalho e a assinatura de
            quem costurou.
          </p>
        </div>

        <Reveal delay={0.2} className={styles.headArt}>
          <GarmentMorph
            frames={frames}
            index={frameIndex < 0 ? 0 : frameIndex}
            duration={1.35}
            className={styles.headMorph}
          />
        </Reveal>
      </header>

      {/* ---------------------------------------------------------
          Barra de filtros
          --------------------------------------------------------- */}
      <div className={styles.barWrap}>
        <div className={['shell', styles.bar].join(' ')}>
          <LayoutGroup id="colecao-filtros">
            <div className={styles.filters} role="tablist" aria-label="Filtrar por categoria">
              {CATEGORIES.map((c) => {
                const active = c.key === filter
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={[styles.filter, active ? styles.filterOn : ''].join(' ')}
                    onClick={() => setFilter(c.key)}
                  >
                    {active && (
                      <motion.span
                        layoutId="filtro-ativo"
                        className={styles.filterFill}
                        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      />
                    )}
                    <span className={styles.filterText}>{c.label}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <label className={styles.sort}>
            <span className="sr-only">Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1L8 8L15 1" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </label>
        </div>
      </div>

      {/* ---------------------------------------------------------
          Grade
          --------------------------------------------------------- */}
      <section className={['shell', styles.body].join(' ')}>
        <p className={styles.count}>
          <span>{String(list.length).padStart(2, '0')}</span>
          {list.length === 1 ? ' peça' : ' peças'}
          {faixa && (
            <em>
              {' '}
              · de {money(faixa.min)} a {money(faixa.max)}
            </em>
          )}
        </p>

        <LayoutGroup id="colecao-grade">
          <motion.div layout className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {list.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {list.length === 0 && (
          <p className={styles.empty}>
            Esta gaveta está vazia por enquanto. A próxima série entra em breve.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------
          Nota de rodapé da coleção
          --------------------------------------------------------- */}
      <section className={['shell', styles.note].join(' ')}>
        <Reveal className={styles.noteInner}>
          <p className="eyebrow">Sobre os tamanhos</p>
          <p className="lede">
            Nossas modelagens vão de PP a GG, e a linha sob medida atende qualquer corpo a partir da
            sua medida. Se estiver entre dois números, escreva para nós antes de comprar — ou agende
            o provador privado e resolva isso no espelho, com a modelista ao lado.
          </p>
        </Reveal>
      </section>
    </Page>
  )
}
