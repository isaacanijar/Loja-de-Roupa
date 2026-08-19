import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { Hero } from '@/components/sections/Hero'
import { ProductCard } from '@/components/product/ProductCard'
import { GarmentFigure } from '@/components/art/GarmentFigure'
import { SilkRibbon } from '@/components/art/SilkRibbon'
import { LazyDressViewer } from '@/components/three/Stage3D'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { Marquee } from '@/components/ui/Marquee'
import { PRODUCTS, getProduct } from '@/data/products'
import { MANIFESTO } from '@/data/atelier'
import { LOOKS } from '@/data/looks'
import styles from './Home.module.css'

/* A vitrine: quatro peças que abrem a temporada. */
const VITRINE = PRODUCTS.slice(0, 4)

/* A peça que protagoniza a seção em volume. */
const ESTRELA = getProduct('vestido-noturno')!

export default function Home() {
  const [tone, setTone] = useState(0)
  const colorway = ESTRELA.colorways[tone]

  const { scrollYProgress } = useScroll()
  const ribbonX = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <Page title="Ateliê de moda autoral">
      <Hero />

      {/* ---------------------------------------------------------
          Declaração de abertura
          --------------------------------------------------------- */}
      <section className={['shell', styles.statement].join(' ')}>
        <Reveal className={styles.statementMark}>
          <span className="eyebrow">Desde 2016 · Rua Aurora, São Paulo</span>
        </Reveal>

        <TextReveal as="h2" className={styles.statementText}>
          Não fazemos coleção para durar uma estação. Fazemos peça para durar o tempo que ela quiser
          continuar sendo usada.
        </TextReveal>

        <Reveal delay={0.2} className={styles.statementSign}>
          <p className="serif-italic">Camila Reis</p>
          <span className="eyebrow">Direção criativa</span>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------
          Vitrine
          --------------------------------------------------------- */}
      <section className={['shell', styles.vitrine].join(' ')}>
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">01 — O acervo</p>
            <TextReveal as="h2" className={styles.sectionTitle}>
              Peças em série curta
            </TextReveal>
          </div>
          <Reveal delay={0.15} className={styles.sectionAside}>
            <p className="lede">
              Nenhuma modelagem passa de sessenta unidades. Quando a série fecha, ela é arquivada
              com o nome de quem a costurou.
            </p>
            <Button to="/colecao" variant="ghost">
              Ver o acervo inteiro
            </Button>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {VITRINE.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* fita de seda atravessando a página entre as seções */}
      <motion.div className={styles.ribbon} style={{ x: ribbonX }} aria-hidden="true">
        <SilkRibbon opacity={0.55} amplitude={30} thickness={30} />
      </motion.div>

      {/* ---------------------------------------------------------
          A peça em volume
          --------------------------------------------------------- */}
      <section className={['theme-ink', styles.volume].join(' ')}>
        <div className={['shell', styles.volumeGrid].join(' ')}>
          <div className={styles.volumeCopy}>
            <p className="eyebrow">02 — Volume</p>
            <TextReveal as="h2" className={styles.sectionTitle}>
              A peça por todos os lados
            </TextReveal>
            <p className={['lede', styles.volumeLede].join(' ')}>
              A mesma modelagem que desenha a peça no papel gera o volume aqui: o perfil da lateral
              — decote, busto, cintura, quadril, barra — girado em torno do eixo. Nada de fotografia.
              Gire com o dedo, troque a cor, veja como a saia abre.
            </p>

            <div className={styles.volumeSpecs}>
              <div>
                <span className="eyebrow">Peça</span>
                <p>{ESTRELA.name}</p>
              </div>
              <div>
                <span className="eyebrow">Tecido</span>
                <p>{ESTRELA.fabric}</p>
              </div>
              <div>
                <span className="eyebrow">Série</span>
                <p>{ESTRELA.edition} peças numeradas</p>
              </div>
            </div>

            <div className={styles.tones}>
              <span className="eyebrow">Banho de cor</span>
              <div className={styles.toneRow}>
                {ESTRELA.colorways.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    className={[styles.tone, i === tone ? styles.toneOn : ''].join(' ')}
                    onClick={() => setTone(i)}
                    aria-pressed={i === tone}
                  >
                    <i style={{ background: c.hex }} aria-hidden="true" />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <Button to={'/produto/' + ESTRELA.slug} size="lg">
              Ver a ficha da peça
            </Button>
          </div>

          <div className={styles.volumeStage}>
            <LazyDressViewer
              shape={ESTRELA.shape}
              colorway={colorway}
              className={styles.canvas}
              placeholder={
                <GarmentFigure
                  shape={ESTRELA.shape}
                  colorway={colorway}
                  alive
                  className={styles.ghost}
                />
              }
            />
            <p className={styles.stageHint}>arraste para girar</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          Lookbook — chamada
          --------------------------------------------------------- */}
      <section className={['shell', styles.editorial].join(' ')}>
        <div className={styles.editorialArt}>
          {LOOKS.slice(0, 3).map((look, i) => (
            <Reveal key={look.id} delay={i * 0.12} className={styles.editorialFig}>
              <GarmentFigure shape={look.shape} colorway={look.colorway} alive={i === 1} />
              <span className="eyebrow">{look.subtitle}</span>
            </Reveal>
          ))}
        </div>

        <div className={styles.editorialCopy}>
          <p className="eyebrow">03 — Editorial</p>
          <TextReveal as="h2" className={styles.sectionTitle}>
            Véspera
          </TextReveal>
          <p className="lede">
            Cinco looks fotografados em um único dia, do primeiro claro às seis e quarenta e sete
            até a hora de sair. No lookbook, uma peça vira a outra enquanto você rola — é a mesma
            modelagem mudando de medida, não um corte entre duas imagens.
          </p>
          <Button to="/lookbook" variant="outline" size="lg">
            Percorrer o editorial
          </Button>
        </div>
      </section>

      <Marquee
        items={['véspera', 'outono 26', 'série curta', 'são paulo', 'feito à mão']}
        display
        speed={54}
        className={styles.bigMarquee}
      />

      {/* ---------------------------------------------------------
          Manifesto
          --------------------------------------------------------- */}
      <section className={['shell', styles.manifesto].join(' ')}>
        <div className={styles.sectionHead}>
          <div>
            <p className="eyebrow">04 — O ateliê</p>
            <TextReveal as="h2" className={styles.sectionTitle}>
              Quatro regras da casa
            </TextReveal>
          </div>
          <Reveal delay={0.15} className={styles.sectionAside}>
            <Button to="/atelie" variant="ghost">
              Conhecer o ateliê
            </Button>
          </Reveal>
        </div>

        <ol className={styles.rules}>
          {MANIFESTO.map((rule, i) => (
            <Reveal key={rule.number} delay={i * 0.08}>
              <li className={styles.rule}>
                <span className={styles.ruleNumber}>{rule.number}</span>
                <h3 className={styles.ruleTitle}>{rule.title}</h3>
                <p className={styles.ruleBody}>{rule.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------
          Provador privado
          --------------------------------------------------------- */}
      <section className={styles.invite}>
        <div className={['shell', styles.inviteInner].join(' ')}>
          <Reveal className={styles.inviteArt}>
            <GarmentFigure
              shape="slip"
              colorway={{ name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' }}
              alive
              hanger
            />
          </Reveal>

          <div className={styles.inviteCopy}>
            <p className="eyebrow">05 — Provador privado</p>
            <TextReveal as="h2" className={styles.inviteTitle}>
              Uma cliente por vez, o acervo inteiro na arara
            </TextReveal>
            <p className="lede">
              Terça a sábado, com hora marcada. Você chega e a arara já está separada com as peças
              que você escolheu — e ninguém mais entra na sala. Café, espelho de três faces e a
              modelista disponível para ajuste.
            </p>
            <div className={styles.inviteActions}>
              <Button to="/provador" size="lg">
                Agendar minha prova
              </Button>
              <Link to="/atelie" className={styles.inviteLink}>
                Como funciona o atendimento
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
