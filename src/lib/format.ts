/* Formatadores e máscaras — pt-BR. */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const money = (value: number) => BRL.format(value)

/** Parcelamento do ateliê: até 6x sem juros. */
export const installments = (value: number, parts = 6) => {
  const each = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / parts)
  return parts + 'x de ' + each + ' sem juros'
}

/** (11) 98765-4321 — máscara progressiva, aceita 10 ou 11 dígitos. */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2)
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6)
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7)
}

/** Centímetros com vírgula decimal, sem unidade. */
export function maskMeasure(raw: string): string {
  return raw.replace(/[^\d,]/g, '').replace(/(,.*),/g, '$1').slice(0, 5)
}

const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

/** "quinta-feira, 14 de maio" a partir de um valor de <input type="date">. */
export function prettyDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  const weekday = WEEKDAYS[date.getDay()]
  const suffix = date.getDay() > 0 && date.getDay() < 6 ? '-feira' : ''
  return weekday + suffix + ', ' + d + ' de ' + MONTHS[m - 1]
}

/** Data de hoje no formato aceito por <input type="date">. */
export function todayISO(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

/** Protocolo de agendamento — legível e fácil de ditar no telefone. */
export function bookingCode(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return 'MV-' + String(hash % 100000).padStart(5, '0')
}

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
