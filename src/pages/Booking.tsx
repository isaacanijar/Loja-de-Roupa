import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { Field, TextArea } from '@/components/form/Field'
import { CheckLine, PillGroup, SelectField } from '@/components/form/Choice'
import { StepBar } from '@/components/form/StepBar'
import { GarmentMorph } from '@/components/art/GarmentMorph'
import { GarmentFigure } from '@/components/art/GarmentFigure'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { PRODUCTS } from '@/data/products'
import { ATELIER_INFO } from '@/data/atelier'
import {
  EMPTY_BOOKING,
  HORARIOS,
  OCASIOES,
  TAMANHOS,
  errorsForStep,
  validateBooking,
  type BookingForm,
} from '@/lib/validation'
import { bookingCode, maskMeasure, maskPhone, prettyDate, todayISO } from '@/lib/format'
import styles from './Booking.module.css'

const PASSOS = ['Quem é você', 'Quando', 'O que procura']

const CONTATOS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'ligacao', label: 'Ligação' },
  { value: 'email', label: 'E-mail' },
]

const PESSOAS = [
  { value: '1', label: 'Só eu' },
  { value: '2', label: '+ 1' },
  { value: '3', label: '+ 2' },
  { value: '4', label: '+ 3' },
]

export default function Booking() {
  const [form, setForm] = useState<BookingForm>(EMPTY_BOOKING)
  const [step, setStep] = useState(0)
  const [furthest, setFurthest] = useState(0)
  const [tentou, setTentou] = useState<boolean[]>([false, false, false])
  const [pronto, setPronto] = useState(false)

  const erros = useMemo(() => validateBooking(form), [form])
  const errosDoPasso = errorsForStep(erros, step)
  const mostra = tentou[step] ? errosDoPasso : {}

  const set = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const marcarTentativa = () =>
    setTentou((t) => t.map((v, i) => (i === step ? true : v)))

  const avancar = () => {
    if (Object.keys(errosDoPasso).length > 0) {
      marcarTentativa()
      return
    }
    const next = Math.min(step + 1, PASSOS.length - 1)
    setStep(next)
    setFurthest((f) => Math.max(f, next))
  }

  const voltar = () => setStep((s) => Math.max(0, s - 1))

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.keys(erros).length > 0) {
      setTentou([true, true, true])
      // leva a cliente ao primeiro passo que ainda tem pendência
      const falho = [0, 1, 2].find((i) => Object.keys(errorsForStep(erros, i)).length > 0)
      if (falho !== undefined) setStep(falho)
      return
    }
    setPronto(true)
  }

  const togglePeca = (nome: string) =>
    setForm((f) => ({
      ...f,
      pecas: f.pecas.includes(nome) ? f.pecas.filter((p) => p !== nome) : [...f.pecas, nome],
    }))

  /* A arara do resumo: as peças marcadas viram os quadros do morph. */
  const araras = useMemo(() => {
    const escolhidas = PRODUCTS.filter((p) => form.pecas.includes(p.name))
    const base = escolhidas.length > 0 ? escolhidas : [PRODUCTS[0]]
    return base.map((p) => ({ shape: p.shape, colorway: p.colorways[0] }))
  }, [form.pecas])

  const protocolo = bookingCode(form.email + form.data + form.horario)

  /* ---------------------------------------------------------
     Confirmação
     --------------------------------------------------------- */
  if (pronto) {
    return (
      <Page title="Prova agendada">
        <section className={['shell', styles.done].join(' ')}>
          <motion.div
            className={styles.doneArt}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <GarmentFigure
              shape="slip"
              colorway={{ name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' }}
              alive
              hanger
            />
          </motion.div>

          <div className={styles.doneCopy}>
            <p className="eyebrow">Protocolo {protocolo}</p>
            <TextReveal as="h1" immediate className={styles.doneTitle}>
              A sala é sua
            </TextReveal>
            <p className="lede">
              {form.nome.split(' ')[0]}, sua prova está reservada para{' '}
              <strong>{prettyDate(form.data)}</strong>, às <strong>{form.horario}</strong>. A
              confirmação vai para {form.email} e falamos por{' '}
              {CONTATOS.find((c) => c.value === form.contatoPreferido)?.label.toLowerCase()} até
              a véspera.
            </p>

            <dl className={styles.doneInfo}>
              <div>
                <dt>Endereço</dt>
                <dd>{ATELIER_INFO.address}</dd>
              </div>
              <div>
                <dt>Na arara</dt>
                <dd>{form.pecas.join(', ')}</dd>
              </div>
              <div>
                <dt>Na sala</dt>
                <dd>
                  {form.acompanhantes === '1'
                    ? 'Só você'
                    : 'Você e mais ' + (Number(form.acompanhantes) - 1)}
                </dd>
              </div>
              {form.ocasiao && (
                <div>
                  <dt>Ocasião</dt>
                  <dd>{form.ocasiao}</dd>
                </div>
              )}
            </dl>

            <div className={styles.doneActions}>
              <Button to="/colecao" size="lg">
                Ver o acervo enquanto isso
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setForm(EMPTY_BOOKING)
                  setStep(0)
                  setFurthest(0)
                  setTentou([false, false, false])
                  setPronto(false)
                }}
              >
                Agendar outra prova
              </Button>
            </div>
          </div>
        </section>
      </Page>
    )
  }

  /* ---------------------------------------------------------
     Formulário
     --------------------------------------------------------- */
  return (
    <Page title="Provador privado">
      <header className={['shell', styles.head].join(' ')}>
        <p className="eyebrow">Atendimento com hora marcada</p>
        <TextReveal as="h1" immediate className={styles.title}>
          Provador privado
        </TextReveal>
        <p className={['lede', styles.intro].join(' ')}>
          Uma cliente por vez, o acervo inteiro na arara e a modelista ao lado. Você marca as peças
          aqui — elas estarão separadas no seu tamanho quando você chegar.
        </p>
      </header>

      <div className={['shell', styles.layout].join(' ')}>
        {/* ---------------- coluna do formulário ---------------- */}
        <form className={styles.form} onSubmit={enviar} noValidate>
          <StepBar steps={PASSOS} current={step} furthest={furthest} onJump={setStep} />

          {/* Sem AnimatePresence aqui de propósito: os campos deste painel
              têm as suas próprias animações de saída (mensagem de erro,
              marcador das pílulas) e elas seguravam a saída do painel para
              sempre — com mode="wait" o passo seguinte nunca chegava a
              montar e o formulário travava no passo 2. A troca de `key`
              remonta o painel e a entrada é animada do mesmo jeito. */}
          <div className={styles.panel}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 26, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* ---- passo 1 ---- */}
              {step === 0 && (
                <fieldset className={styles.fields}>
                  <legend className={styles.legend}>
                    <span className="eyebrow">Passo 01</span>
                    <h2>Para a etiqueta da reserva</h2>
                  </legend>

                  <Field
                    label="Nome e sobrenome"
                    value={form.nome}
                    onChange={(v) => set('nome', v)}
                    error={mostra.nome}
                    required
                    wide
                    autoComplete="name"
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    value={form.email}
                    onChange={(v) => set('email', v)}
                    error={mostra.email}
                    required
                    autoComplete="email"
                    inputMode="email"
                  />
                  <Field
                    label="Telefone"
                    type="tel"
                    value={form.telefone}
                    onChange={(v) => set('telefone', maskPhone(v))}
                    error={mostra.telefone}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    hint="Com DDD. É por aqui que confirmamos na véspera."
                  />

                  <div className={styles.full}>
                    <PillGroup
                      name="contato"
                      label="Como prefere que a gente fale com você?"
                      value={form.contatoPreferido}
                      options={CONTATOS}
                      onChange={(v) => set('contatoPreferido', v)}
                      error={mostra.contatoPreferido}
                    />
                  </div>
                </fieldset>
              )}

              {/* ---- passo 2 ---- */}
              {step === 1 && (
                <fieldset className={styles.fields}>
                  <legend className={styles.legend}>
                    <span className="eyebrow">Passo 02</span>
                    <h2>Dia e hora</h2>
                  </legend>

                  <Field
                    label="Data da prova"
                    type="date"
                    value={form.data}
                    onChange={(v) => set('data', v)}
                    error={mostra.data}
                    required
                    min={todayISO(1)}
                    max={todayISO(120)}
                    hint="Terça a sábado, a partir de amanhã."
                  />

                  <div className={styles.full}>
                    <PillGroup
                      name="horario"
                      label="Horário"
                      value={form.horario}
                      options={HORARIOS.map((h) => ({ value: h, label: h }))}
                      onChange={(v) => set('horario', v)}
                      error={mostra.horario}
                    />
                  </div>

                  <div className={styles.full}>
                    <PillGroup
                      name="pessoas"
                      label="Quem vem com você?"
                      value={form.acompanhantes}
                      options={PESSOAS}
                      onChange={(v) => set('acompanhantes', v)}
                      error={mostra.acompanhantes}
                    />
                  </div>

                  {form.data && !mostra.data && (
                    <p className={styles.echo}>
                      <span className="eyebrow">Reservado para</span>
                      <em>
                        {prettyDate(form.data)}
                        {form.horario ? ', às ' + form.horario : ''}
                      </em>
                    </p>
                  )}
                </fieldset>
              )}

              {/* ---- passo 3 ---- */}
              {step === 2 && (
                <fieldset className={styles.fields}>
                  <legend className={styles.legend}>
                    <span className="eyebrow">Passo 03</span>
                    <h2>O que separamos na arara</h2>
                  </legend>

                  <div className={styles.full}>
                    <p className={styles.groupLabel}>
                      Peças que você quer provar
                      {mostra.pecas && <em className={styles.groupError}>{mostra.pecas}</em>}
                    </p>
                    <ul className={styles.pecas}>
                      {PRODUCTS.map((p) => {
                        const on = form.pecas.includes(p.name)
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              className={[styles.peca, on ? styles.pecaOn : ''].join(' ')}
                              onClick={() => togglePeca(p.name)}
                              aria-pressed={on}
                            >
                              <GarmentFigure
                                shape={p.shape}
                                colorway={p.colorways[0]}
                                stitchOnView={false}
                                className={styles.pecaArt}
                              />
                              <span className={styles.pecaName}>{p.name}</span>
                              <span className={styles.pecaMeta}>{p.fabric}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <SelectField
                    label="Seu tamanho habitual"
                    value={form.tamanho}
                    options={TAMANHOS}
                    onChange={(v) => set('tamanho', v)}
                    error={mostra.tamanho}
                    required
                  />
                  <SelectField
                    label="Ocasião"
                    value={form.ocasiao}
                    options={OCASIOES}
                    onChange={(v) => set('ocasiao', v)}
                    error={mostra.ocasiao}
                  />

                  <p className={[styles.groupLabel, styles.full].join(' ')}>
                    Medidas, se você já as tiver à mão
                    <em className={styles.groupHint}>
                      Não são obrigatórias — a modelista mede no ateliê. Mas ajudam a separar o
                      número certo antes de você chegar.
                    </em>
                  </p>

                  <Field
                    label="Busto"
                    value={form.busto}
                    onChange={(v) => set('busto', maskMeasure(v))}
                    error={mostra.busto}
                    inputMode="numeric"
                    suffix="cm"
                  />
                  <Field
                    label="Cintura"
                    value={form.cintura}
                    onChange={(v) => set('cintura', maskMeasure(v))}
                    error={mostra.cintura}
                    inputMode="numeric"
                    suffix="cm"
                  />
                  <Field
                    label="Quadril"
                    value={form.quadril}
                    onChange={(v) => set('quadril', maskMeasure(v))}
                    error={mostra.quadril}
                    inputMode="numeric"
                    suffix="cm"
                  />
                  <Field
                    label="Altura"
                    value={form.altura}
                    onChange={(v) => set('altura', maskMeasure(v))}
                    error={mostra.altura}
                    inputMode="numeric"
                    suffix="cm"
                  />

                  <TextArea
                    label="Algo que a gente deva saber antes"
                    value={form.observacoes}
                    onChange={(v) => set('observacoes', v)}
                    error={mostra.observacoes}
                    wide
                    rows={4}
                    hint="Ajustes de sempre, tecidos que não caem bem em você, o salto que pretende usar."
                  />

                  <div className={[styles.full, styles.consents].join(' ')}>
                    <CheckLine
                      checked={form.aceite}
                      onChange={(v) => set('aceite', v)}
                      error={mostra.aceite}
                    >
                      Autorizo a MALVA a guardar estes dados para preparar e conduzir o meu
                      atendimento.
                    </CheckLine>
                    <CheckLine checked={form.novidades} onChange={(v) => set('novidades', v)}>
                      Quero receber aviso quando uma série nova abrir. No máximo uma vez por mês.
                    </CheckLine>
                  </div>
                </fieldset>
              )}
            </motion.div>
          </div>

          <div className={styles.nav}>
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={voltar}>
                Voltar
              </Button>
            ) : (
              <span />
            )}

            {step < PASSOS.length - 1 ? (
              <Button type="button" size="lg" onClick={avancar}>
                Continuar
              </Button>
            ) : (
              <Button type="submit" size="lg">
                Confirmar agendamento
              </Button>
            )}
          </div>
        </form>

        {/* ---------------- coluna do resumo ---------------- */}
        <aside className={styles.aside}>
          <div className={styles.asideInner}>
            <div className={styles.asideArt}>
              <GarmentMorph
                frames={araras}
                interval={3200}
                duration={1.3}
                className={styles.asideMorph}
              />
            </div>

            <p className="eyebrow">A sua arara</p>
            <p className={styles.asideCount}>
              {form.pecas.length === 0
                ? 'Nenhuma peça marcada ainda'
                : form.pecas.length === 1
                  ? '1 peça separada'
                  : form.pecas.length + ' peças separadas'}
            </p>

            <dl className={styles.resumo}>
              <div>
                <dt>Nome</dt>
                <dd>{form.nome || '—'}</dd>
              </div>
              <div>
                <dt>Dia</dt>
                <dd>{form.data ? prettyDate(form.data) : '—'}</dd>
              </div>
              <div>
                <dt>Hora</dt>
                <dd>{form.horario || '—'}</dd>
              </div>
              <div>
                <dt>Tamanho</dt>
                <dd>{form.tamanho || '—'}</dd>
              </div>
            </dl>

            <p className={styles.asideNote}>
              A prova dura cerca de uma hora e meia. Não há compromisso de compra — nem taxa. Se
              precisar remarcar, é só responder ao e-mail de confirmação.
            </p>

            <p className={styles.asideAddr}>{ATELIER_INFO.address}</p>
          </div>
        </aside>
      </div>
    </Page>
  )
}
