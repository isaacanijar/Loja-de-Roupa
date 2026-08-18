import { todayISO } from './format'

/* Validação do agendamento do provador privado.
   Regras conferidas por passo — o formulário só avança quando
   o passo corrente está limpo. */

export interface BookingForm {
  nome: string
  email: string
  telefone: string
  data: string
  horario: string
  acompanhantes: string
  ocasiao: string
  pecas: string[]
  tamanho: string
  busto: string
  cintura: string
  quadril: string
  altura: string
  observacoes: string
  contatoPreferido: string
  aceite: boolean
  novidades: boolean
}

export type BookingErrors = Partial<Record<keyof BookingForm, string>>

export const EMPTY_BOOKING: BookingForm = {
  nome: '',
  email: '',
  telefone: '',
  data: '',
  horario: '',
  acompanhantes: '1',
  ocasiao: '',
  pecas: [],
  tamanho: '',
  busto: '',
  cintura: '',
  quadril: '',
  altura: '',
  observacoes: '',
  contatoPreferido: 'whatsapp',
  aceite: false,
  novidades: true,
}

export const HORARIOS = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30']

export const OCASIOES = [
  'Casamento — noiva',
  'Casamento — convidada',
  'Formatura',
  'Evento de trabalho',
  'Renovação de guarda-roupa',
  'Sem ocasião. Só vontade.',
]

export const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'Prefiro medir no ateliê']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

const isFilled = (v: string) => v.trim().length > 0

const measureOk = (v: string) => {
  if (!isFilled(v)) return true // medidas são opcionais
  const n = Number(v.replace(',', '.'))
  return Number.isFinite(n) && n >= 30 && n <= 250
}

/** Campos exigidos em cada passo do formulário. */
export const STEP_FIELDS: (keyof BookingForm)[][] = [
  ['nome', 'email', 'telefone', 'contatoPreferido'],
  ['data', 'horario', 'acompanhantes'],
  ['pecas', 'tamanho', 'busto', 'cintura', 'quadril', 'altura', 'ocasiao', 'observacoes', 'aceite'],
]

export function validateBooking(form: BookingForm): BookingErrors {
  const e: BookingErrors = {}

  // --- passo 1: quem é você
  if (!isFilled(form.nome)) e.nome = 'Precisamos do seu nome para reservar a sala.'
  else if (form.nome.trim().split(/\s+/).length < 2) e.nome = 'Escreva nome e sobrenome.'

  if (!isFilled(form.email)) e.email = 'Enviamos a confirmação por e-mail.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Esse e-mail parece incompleto.'

  const digits = form.telefone.replace(/\D/g, '')
  if (!digits) e.telefone = 'Precisamos de um telefone de contato.'
  else if (digits.length < 10) e.telefone = 'Inclua o DDD — são 10 ou 11 dígitos.'

  // --- passo 2: quando
  if (!isFilled(form.data)) e.data = 'Escolha um dia para a prova.'
  else if (form.data < todayISO(1)) e.data = 'A partir de amanhã. Precisamos de um dia para separar as peças.'
  else if (new Date(form.data + 'T12:00:00').getDay() === 0)
    e.data = 'O ateliê fecha aos domingos. Escolha de terça a sábado.'
  else if (new Date(form.data + 'T12:00:00').getDay() === 1)
    e.data = 'Segunda é dia de corte. Escolha de terça a sábado.'

  if (!isFilled(form.horario)) e.horario = 'Escolha um horário.'

  const pessoas = Number(form.acompanhantes)
  if (!Number.isFinite(pessoas) || pessoas < 1) e.acompanhantes = 'Ao menos uma pessoa.'
  else if (pessoas > 4) e.acompanhantes = 'A sala comporta até 4 pessoas com conforto.'

  // --- passo 3: o que você procura
  if (form.pecas.length === 0) e.pecas = 'Marque ao menos uma peça para separarmos na arara.'
  if (!isFilled(form.tamanho)) e.tamanho = 'Seu tamanho habitual nos ajuda a preparar a prova.'

  if (!measureOk(form.busto)) e.busto = 'Medida em cm, entre 30 e 250.'
  if (!measureOk(form.cintura)) e.cintura = 'Medida em cm, entre 30 e 250.'
  if (!measureOk(form.quadril)) e.quadril = 'Medida em cm, entre 30 e 250.'
  if (!measureOk(form.altura)) e.altura = 'Altura em cm, entre 30 e 250.'

  if (form.observacoes.length > 600) e.observacoes = 'Resuma em até 600 caracteres.'

  if (!form.aceite) e.aceite = 'Confirme que podemos guardar seus dados para o atendimento.'

  return e
}

/** Erros restritos ao passo — usado para liberar o botão "continuar". */
export function errorsForStep(errors: BookingErrors, step: number): BookingErrors {
  const fields = STEP_FIELDS[step] ?? []
  const scoped: BookingErrors = {}
  for (const f of fields) {
    if (errors[f]) scoped[f] = errors[f]
  }
  return scoped
}
