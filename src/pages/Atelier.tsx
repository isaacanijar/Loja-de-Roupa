import { useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { GarmentFigure } from '@/components/art/GarmentFigure'
import { GarmentMorph } from '@/components/art/GarmentMorph'
import { SilkRibbon } from '@/components/art/SilkRibbon'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { MalvaMark } from '@/components/ui/Wordmark'
import { ATELIER_INFO, HANDS, MANIFESTO, TIMELINE } from '@/data/atelier'
import { initials } from '@/lib/format'
import styles from './Atelier.module.css'

/* As três modelagens que abriram cada fase da casa. */
const FASES = [
  { shape: 'slip' as const, colorway: { name: 'Pérola', hex: '#EFE4DC', sheen: '#FFFBF7', shade: '#CDB9AC' } },
  { shape: 'alfaiataria' as const, colorway: { name: 'Areia', hex: '#E3D5CB', sheen: '#F7EFE8', shade: '#B7A49A' } },
  { shape: 'gode' as const, colorway: { name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' } },
]

export default function Atelier() {
  const [fase, setFase] = useState(0)

  return (
    <Page title="O ateliê">
      {/* ---------------------------------------------------------
          Abertura
          --------------------------------------------------------- */}
      <header className={['shell', styles.head].join(' ')}>
        <div className={styles.headCopy}>
          <p className="eyebrow">Rua Aurora, 214 · Vila Buarque</p>
          <TextReveal as="h1" immediate className={styles.title}>
            Uma sala com janela para o leste
          </TextReveal>
          <p className={['lede', styles.intro].join(' ')}>
            A MALVA cabe em quatro mesas de corte, uma arara e a luz da manhã. Tudo o que sai daqui
            foi cortado, costurado e conferido nesta sala — por quem assina a etiqueta interna da
            peça.
          </p>
        </div>

        <Reveal delay={0.2} className={styles.headArt}>
          <MalvaMark className={styles.mark} />
        </Reveal>
      </header>

      {/* ---------------------------------------------------------
          Manifesto
          --------------------------------------------------------- */}
      <section className={['theme-ink', styles.manifesto].join(' ')}>
        <div className={['shell', styles.manifestoInner].join(' ')}>
          <div className={styles.manifestoHead}>
            <p className="eyebrow">Manifesto</p>
            <TextReveal as="h2" className={styles.h2}>
              O que a casa não negocia
            </TextReveal>
          </div>

          <ol className={styles.rules}>
            {MANIFESTO.map((rule, i) => (
              <Reveal key={rule.number} delay={i * 0.08}>
                <li className={styles.rule}>
                  <span className={styles.ruleNumber}>{rule.number}</span>
                  <div>
                    <h3 className={styles.ruleTitle}>{rule.title}</h3>
                    <p className={styles.ruleBody}>{rule.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <div className={styles.ribbon} aria-hidden="true">
        <SilkRibbon colors={['#E6D0B3', '#E3B7CE', '#9AA891']} opacity={0.5} />
      </div>

      {/* ---------------------------------------------------------
          Linha do tempo
          --------------------------------------------------------- */}
      <section className={['shell', styles.timeline].join(' ')}>
        <div className={styles.timelineHead}>
          <p className="eyebrow">Dez anos</p>
          <TextReveal as="h2" className={styles.h2}>
            Da mesa da sala ao provador privado
          </TextReveal>
        </div>

        <ol className={styles.years}>
          {TIMELINE.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.06} amount={0.4}>
              <li className={styles.year}>
                <div className={styles.yearMark}>
                  <span>{item.year}</span>
                  <i aria-hidden="true" />
                </div>
                <div className={styles.yearBody}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------
          O método — peça em transformação
          --------------------------------------------------------- */}
      <section className={['shell', styles.method].join(' ')}>
        <div className={styles.methodArt}>
          <GarmentMorph frames={FASES} index={fase} duration={1.4} className={styles.methodMorph} />
        </div>

        <div className={styles.methodCopy}>
          <p className="eyebrow">O método</p>
          <TextReveal as="h2" className={styles.h2}>
            Uma modelagem, muitas peças
          </TextReveal>
          <p className="lede">
            Toda peça da casa nasce do mesmo conjunto de medidas: decote, ombro, cava, cintura,
            quadril, barra. Mudar uma peça é mudar um número — e é por isso que um vestido de seda
            e um blazer de lã fria são parentes diretos aqui dentro.
          </p>

          <div className={styles.methodSteps}>
            {[
              { t: 'Medida', d: 'O desenho começa em números, não em inspiração solta.' },
              { t: 'Piloto', d: 'A peça é costurada em algodão cru e vestida em corpo real.' },
              { t: 'Série', d: 'Fechada a modelagem, a série sai — e depois é arquivada.' },
            ].map((step, i) => (
              <button
                key={step.t}
                type="button"
                className={[styles.step, fase === i ? styles.stepOn : ''].join(' ')}
                onClick={() => setFase(i)}
                aria-pressed={fase === i}
              >
                {fase === i && (
                  <motion.span
                    layoutId="atelie-passo"
                    className={styles.stepFill}
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
                <span className={styles.stepText}>
                  <strong>{step.t}</strong>
                  <em>{step.d}</em>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          As mãos
          --------------------------------------------------------- */}
      <section className={['shell', styles.hands].join(' ')}>
        <div className={styles.handsHead}>
          <p className="eyebrow">As mãos</p>
          <TextReveal as="h2" className={styles.h2}>
            Quem costura assina
          </TextReveal>
          <p className="lede">
            Cada peça sai com uma etiqueta interna bordada com o nome de quem a costurou. Não é
            gesto de marketing: é como a gente resolve um problema, quando aparece.
          </p>
        </div>

        <ul className={styles.handsGrid}>
          {HANDS.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.07}>
              <li className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(person.name)}
                </span>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------
          Visita
          --------------------------------------------------------- */}
      <section className={styles.visit}>
        <div className={['shell', styles.visitInner].join(' ')}>
          <Reveal className={styles.visitArt}>
            <GarmentFigure
              shape="kimono"
              colorway={{ name: 'Ouro pálido', hex: '#E6D0B3', sheen: '#FBF0DC', shade: '#C8A06A' }}
              alive
              hanger
            />
          </Reveal>

          <div className={styles.visitCopy}>
            <p className="eyebrow">Visitar</p>
            <TextReveal as="h2" className={styles.h2}>
              A porta abre com hora marcada
            </TextReveal>

            <dl className={styles.info}>
              <div>
                <dt>Endereço</dt>
                <dd>{ATELIER_INFO.address}</dd>
              </div>
              <div>
                <dt>Horários</dt>
                <dd>{ATELIER_INFO.hours}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>
                  <a href={'tel:' + ATELIER_INFO.phone.replace(/\D/g, '')}>{ATELIER_INFO.phone}</a>
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={'mailto:' + ATELIER_INFO.email}>{ATELIER_INFO.email}</a>
                </dd>
              </div>
            </dl>

            <Button to="/provador" size="lg">
              Agendar o provador privado
            </Button>
          </div>
        </div>
      </section>
    </Page>
  )
}
