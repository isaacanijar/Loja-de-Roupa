import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Page } from '@/components/layout/Page'
import { Field, TextArea } from '@/components/form/Field'
import { CheckLine, PillGroup, SelectField } from '@/components/form/Choice'
import { PhotoMorph, frameOf } from '@/components/art/PhotoMorph'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { PRODUCTS, getProduct } from '@/data/products'
import { ATELIER_INFO } from '@/data/atelier'
import { maskPhone } from '@/lib/format'
import {
  COMO_CONHECEU,
  CONTATOS_CADASTRO,
  EMPTY_CADASTRO,
  ESTILOS,
  TAMANHOS_CADASTRO,
  TOTAL_CAMPOS,
  TRATAMENTOS,
  UFS,
  fichaCode,
  forcaSenha,
  maskCEP,
  maskCPF,
  validateCadastro,
  type CadastroForm,
} from '@/lib/cadastro'
import styles from './Register.module.css'

const FORCA = ['muito fraca', 'fraca', 'razoável', 'boa', 'forte']

const VITRINE = [
  frameOf(getProduct('vestido-alba')!),
  frameOf(getProduct('kimono-lumen')!),
  frameOf(getProduct('blazer-longo-atlas')!, getProduct('blazer-longo-atlas')!.colorways[1]),
]

export default function Register() {
  const [form, setForm] = useState<CadastroForm>(EMPTY_CADASTRO)
  const [tentou, setTentou] = useState(false)
  const [pronto, setPronto] = useState(false)

  const erros = useMemo(() => validateCadastro(form), [form])
  const mostra = tentou ? erros : {}

  const set = <K extends keyof CadastroForm>(chave: K, valor: CadastroForm[K]) =>
    setForm((f) => ({ ...f, [chave]: valor }))

  const alternaEstilo = (nome: string) =>
    setForm((f) => ({
      ...f,
      estilos: f.estilos.includes(nome)
        ? f.estilos.filter((e) => e !== nome)
        : [...f.estilos, nome],
    }))

  /* Quantos campos já foram preenchidos — a régua do rodapé. */
  const preenchidos = useMemo(
    () =>
      Object.entries(form).filter(([, v]) =>
        Array.isArray(v) ? v.length > 0 : typeof v === 'boolean' ? v : String(v).trim() !== '',
      ).length,
    [form],
  )

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    setTentou(true)
    if (Object.keys(erros).length > 0) {
      // leva a cliente ao primeiro campo com pendência
      const primeiro = document.querySelector('[aria-invalid="true"]')
      primeiro?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(primeiro as HTMLElement | null)?.focus?.()
      return
    }
    setPronto(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const forca = forcaSenha(form.senha)
  const protocolo = fichaCode(form.cpf + form.email)

  /* ---------------------------------------------------------
     Ficha aberta
     --------------------------------------------------------- */
  if (pronto) {
    return (
      <Page title="Cadastro concluído">
        <section className={['shell', styles.done].join(' ')}>
          <motion.div
            className={styles.doneArt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhotoMorph frames={VITRINE} interval={3200} className={styles.donePhoto} />
          </motion.div>

          <div className={styles.doneCopy}>
            <p className="eyebrow">Ficha {protocolo}</p>
            <TextReveal as="h1" immediate className={styles.doneTitle}>
              Sua ficha está aberta
            </TextReveal>
            <p className="lede">
              {form.nome.split(' ')[0]}, seu cadastro foi concluído. A confirmação vai para{' '}
              <strong>{form.email}</strong>, e a partir de agora a arara já chega separada no seu
              tamanho quando você marcar uma prova.
            </p>

            <dl className={styles.resumo}>
              <div>
                <dt>Nome</dt>
                <dd>{form.nome}</dd>
              </div>
              <div>
                <dt>CPF</dt>
                <dd>{form.cpf}</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>
                  {form.logradouro}, {form.numero}
                  {form.complemento ? ' — ' + form.complemento : ''} · {form.bairro},{' '}
                  {form.cidade}/{form.estado} · {form.cep}
                </dd>
              </div>
              <div>
                <dt>Tamanho</dt>
                <dd>{form.tamanho}</dd>
              </div>
              <div>
                <dt>Interesses</dt>
                <dd>{form.estilos.join(', ')}</dd>
              </div>
              <div>
                <dt>Contato</dt>
                <dd>
                  {CONTATOS_CADASTRO.find((c) => c.value === form.contatoPreferido)?.label} ·{' '}
                  {form.telefone}
                </dd>
              </div>
            </dl>

            <div className={styles.doneActions}>
              <Button to="/provador" size="lg">
                Agendar a primeira prova
              </Button>
              <Button to="/colecao" variant="ghost" size="lg">
                Ver o acervo
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
    <Page title="Cadastro de cliente">
      <header className={['shell', styles.head].join(' ')}>
        <div className={styles.headCopy}>
          <p className="eyebrow">Ficha de cliente</p>
          <TextReveal as="h1" immediate className={styles.title}>
            Abrir a sua ficha no ateliê
          </TextReveal>
          <p className={['lede', styles.intro].join(' ')}>
            O cadastro guarda as suas medidas, o seu endereço de entrega e o que você gosta de
            vestir. Da próxima vez, a arara já está separada quando você chega — e a peça sai
            daqui direto para a sua casa.
          </p>
        </div>

        <div className={styles.headArt}>
          <PhotoMorph frames={VITRINE} interval={3600} className={styles.headPhoto} />
        </div>
      </header>

      <div className={['shell', styles.layout].join(' ')}>
        <form className={styles.form} onSubmit={enviar} noValidate>
          {/* ---------------- 1. dados pessoais ---------------- */}
          <fieldset className={styles.bloco}>
            <legend className={styles.legend}>
              <span className={styles.legendNum}>01</span>
              <span>
                <strong>Dados pessoais</strong>
                <em>Quem assina a ficha</em>
              </span>
            </legend>

            <div className={styles.campos}>
              <Field
                label="Nome completo"
                value={form.nome}
                onChange={(v) => set('nome', v)}
                error={mostra.nome}
                required
                wide
                autoComplete="name"
              />
              <Field
                label="CPF"
                value={form.cpf}
                onChange={(v) => set('cpf', maskCPF(v))}
                error={mostra.cpf}
                required
                inputMode="numeric"
                hint="Só para identificar a ficha. Não sai do ateliê."
              />
              <Field
                label="Data de nascimento"
                type="date"
                value={form.nascimento}
                onChange={(v) => set('nascimento', v)}
                error={mostra.nascimento}
                required
                autoComplete="bday"
              />
              <Field
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(v) => set('email', v)}
                error={mostra.email}
                required
                inputMode="email"
                autoComplete="email"
              />
              <Field
                label="Telefone"
                type="tel"
                value={form.telefone}
                onChange={(v) => set('telefone', maskPhone(v))}
                error={mostra.telefone}
                required
                inputMode="tel"
                autoComplete="tel"
              />

              <div className={styles.full}>
                <PillGroup
                  name="tratamento"
                  label="Como prefere ser tratada?"
                  value={form.tratamento}
                  options={TRATAMENTOS}
                  onChange={(v) => set('tratamento', v)}
                  error={mostra.tratamento}
                />
              </div>
            </div>
          </fieldset>

          {/* ---------------- 2. endereço ---------------- */}
          <fieldset className={styles.bloco}>
            <legend className={styles.legend}>
              <span className={styles.legendNum}>02</span>
              <span>
                <strong>Endereço de entrega</strong>
                <em>Para onde a peça vai</em>
              </span>
            </legend>

            <div className={styles.campos}>
              <Field
                label="CEP"
                value={form.cep}
                onChange={(v) => set('cep', maskCEP(v))}
                error={mostra.cep}
                required
                inputMode="numeric"
                autoComplete="postal-code"
              />
              <Field
                label="Logradouro"
                value={form.logradouro}
                onChange={(v) => set('logradouro', v)}
                error={mostra.logradouro}
                required
                autoComplete="address-line1"
              />
              <Field
                label="Número"
                value={form.numero}
                onChange={(v) => set('numero', v)}
                error={mostra.numero}
                required
                inputMode="numeric"
              />
              <Field
                label="Complemento"
                value={form.complemento}
                onChange={(v) => set('complemento', v)}
                error={mostra.complemento}
                hint="Apartamento, bloco, referência."
              />
              <Field
                label="Bairro"
                value={form.bairro}
                onChange={(v) => set('bairro', v)}
                error={mostra.bairro}
                required
              />
              <Field
                label="Cidade"
                value={form.cidade}
                onChange={(v) => set('cidade', v)}
                error={mostra.cidade}
                required
                autoComplete="address-level2"
              />
              <SelectField
                label="Estado"
                value={form.estado}
                options={UFS}
                onChange={(v) => set('estado', v)}
                error={mostra.estado}
                placeholder="UF"
                required
              />
            </div>
          </fieldset>

          {/* ---------------- 3. preferências ---------------- */}
          <fieldset className={styles.bloco}>
            <legend className={styles.legend}>
              <span className={styles.legendNum}>03</span>
              <span>
                <strong>Preferências do ateliê</strong>
                <em>O que separar para você</em>
              </span>
            </legend>

            <div className={styles.campos}>
              <SelectField
                label="Tamanho habitual"
                value={form.tamanho}
                options={TAMANHOS_CADASTRO}
                onChange={(v) => set('tamanho', v)}
                error={mostra.tamanho}
                required
              />
              <SelectField
                label="Como conheceu a MALVA"
                value={form.comoConheceu}
                options={COMO_CONHECEU}
                onChange={(v) => set('comoConheceu', v)}
                error={mostra.comoConheceu}
              />

              <div className={styles.full}>
                <p className={styles.grupoRotulo}>
                  Estilos do seu interesse
                  {mostra.estilos && <em className={styles.grupoErro}>{mostra.estilos}</em>}
                </p>
                <ul className={styles.estilos}>
                  {ESTILOS.map((estilo) => {
                    const on = form.estilos.includes(estilo)
                    return (
                      <li key={estilo}>
                        <button
                          type="button"
                          className={[styles.estilo, on ? styles.estiloOn : ''].join(' ')}
                          onClick={() => alternaEstilo(estilo)}
                          aria-pressed={on}
                        >
                          {estilo}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className={styles.full}>
                <PillGroup
                  name="contato-cadastro"
                  label="Por onde prefere receber aviso de série nova?"
                  value={form.contatoPreferido}
                  options={CONTATOS_CADASTRO}
                  onChange={(v) => set('contatoPreferido', v)}
                  error={mostra.contatoPreferido}
                />
              </div>

              <TextArea
                label="Algo que a gente deva saber"
                value={form.observacoes}
                onChange={(v) => set('observacoes', v)}
                error={mostra.observacoes}
                wide
                rows={3}
                maxLength={400}
                hint="Ajustes de sempre, tecidos que não caem bem em você, alergias."
              />
            </div>
          </fieldset>

          {/* ---------------- 4. acesso ---------------- */}
          <fieldset className={styles.bloco}>
            <legend className={styles.legend}>
              <span className={styles.legendNum}>04</span>
              <span>
                <strong>Acesso e consentimento</strong>
                <em>Para entrar na sua conta depois</em>
              </span>
            </legend>

            <div className={styles.campos}>
              <div>
                <Field
                  label="Senha"
                  type="password"
                  value={form.senha}
                  onChange={(v) => set('senha', v)}
                  error={mostra.senha}
                  required
                  autoComplete="new-password"
                />
                {form.senha && !mostra.senha && (
                  <div className={styles.forca}>
                    <span className={styles.forcaTrilho} aria-hidden="true">
                      <motion.i
                        className={styles.forcaBarra}
                        animate={{ width: (forca / 4) * 100 + '%' }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        data-nivel={forca}
                      />
                    </span>
                    <em>{FORCA[forca]}</em>
                  </div>
                )}
              </div>

              <Field
                label="Confirmar senha"
                type="password"
                value={form.confirmaSenha}
                onChange={(v) => set('confirmaSenha', v)}
                error={mostra.confirmaSenha}
                required
                autoComplete="new-password"
              />

              <div className={[styles.full, styles.consentimentos].join(' ')}>
                <CheckLine
                  checked={form.aceite}
                  onChange={(v) => set('aceite', v)}
                  error={mostra.aceite}
                >
                  Li e aceito os termos de uso e autorizo a MALVA a guardar estes dados para
                  conduzir o meu atendimento e as minhas compras.
                </CheckLine>
                <CheckLine checked={form.novidades} onChange={(v) => set('novidades', v)}>
                  Quero receber aviso quando uma série nova abrir. No máximo uma vez por mês.
                </CheckLine>
              </div>
            </div>
          </fieldset>

          {/* ---------------- rodapé ---------------- */}
          <div className={styles.rodape}>
            <div className={styles.progresso}>
              <span className="eyebrow">
                {preenchidos} de {TOTAL_CAMPOS} campos
              </span>
              <span className={styles.progressoTrilho} aria-hidden="true">
                <motion.i
                  animate={{ width: (preenchidos / TOTAL_CAMPOS) * 100 + '%' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </div>

            <Button type="submit" size="lg">
              Concluir cadastro
            </Button>
          </div>

          {tentou && Object.keys(erros).length > 0 && (
            <p className={styles.aviso} role="alert">
              Faltam {Object.keys(erros).length}{' '}
              {Object.keys(erros).length === 1 ? 'campo' : 'campos'} para concluir. Os pendentes
              estão marcados acima.
            </p>
          )}
        </form>

        {/* ---------------- coluna lateral ---------------- */}
        <aside className={styles.aside}>
          <div className={styles.asideInner}>
            <p className="eyebrow">Por que se cadastrar</p>
            <ul className={styles.vantagens}>
              {[
                { t: 'A arara pronta', d: 'Suas medidas ficam guardadas: a prova começa com as peças já separadas.' },
                { t: 'Conserto vitalício', d: 'Barra, botão, zíper. A ficha guarda o histórico de cada peça sua.' },
                { t: 'Primeiro aviso', d: 'Série curta fecha rápido. Quem tem ficha sabe antes.' },
              ].map((v) => (
                <li key={v.t}>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </li>
              ))}
            </ul>

            <p className={styles.asideNota}>
              Já tem ficha?{' '}
              <Link to="/provador" className={styles.asideLink}>
                agende direto a sua prova
              </Link>
              .
            </p>

            <p className={styles.asideAddr}>{ATELIER_INFO.address}</p>
            <p className={styles.asideAcervo}>
              {PRODUCTS.length} modelagens abertas nesta temporada
            </p>
          </div>
        </aside>
      </div>
    </Page>
  )
}
