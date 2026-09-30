/* =========================================================
   MALVA — Cadastro de cliente

   Ficha da cliente do ateliê: dados pessoais, endereço de
   entrega, preferências de prova e credenciais de acesso.
   São 22 campos preenchíveis, agrupados em quatro blocos.
   ========================================================= */

export interface CadastroForm {
  // --- dados pessoais
  nome: string
  cpf: string
  nascimento: string
  email: string
  telefone: string
  tratamento: string
  // --- endereço
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  // --- preferências do ateliê
  tamanho: string
  estilos: string[]
  comoConheceu: string
  contatoPreferido: string
  observacoes: string
  // --- acesso e consentimento
  senha: string
  confirmaSenha: string
  aceite: boolean
  novidades: boolean
}

export type CadastroErrors = Partial<Record<keyof CadastroForm, string>>

export const EMPTY_CADASTRO: CadastroForm = {
  nome: '',
  cpf: '',
  nascimento: '',
  email: '',
  telefone: '',
  tratamento: 'sem',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  tamanho: '',
  estilos: [],
  comoConheceu: '',
  contatoPreferido: 'whatsapp',
  observacoes: '',
  senha: '',
  confirmaSenha: '',
  aceite: false,
  novidades: true,
}

/** Quantidade de campos preenchíveis da ficha — usada no rodapé do formulário. */
export const TOTAL_CAMPOS = Object.keys(EMPTY_CADASTRO).length

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
] as const

export const TAMANHOS_CADASTRO = [
  'PP', 'P', 'M', 'G', 'GG', 'Ainda não sei — quero medir no ateliê',
]

export const ESTILOS = [
  'Alfaiataria',
  'Vestidos de festa',
  'Peças de seda',
  'Linho e algodão',
  'Kimonos e casacos',
  'Sob medida',
]

export const COMO_CONHECEU = [
  'Indicação de uma amiga',
  'Instagram',
  'Passei em frente ao ateliê',
  'Busca no Google',
  'Revista ou editorial',
  'Outro',
]

export const TRATAMENTOS = [
  { value: 'sem', label: 'Sem tratamento' },
  { value: 'sra', label: 'Sra.' },
  { value: 'srta', label: 'Srta.' },
  { value: 'nao-informar', label: 'Prefiro não informar' },
]

export const CONTATOS_CADASTRO = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'ligacao', label: 'Ligação' },
]

/* ---------------------------------------------------------
   Máscaras
   --------------------------------------------------------- */

/** 000.000.000-00 */
export function maskCPF(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return d.slice(0, 3) + '.' + d.slice(3)
  if (d.length <= 9) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6)
  return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9)
}

/** 00000-000 */
export function maskCEP(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  return d.length <= 5 ? d : d.slice(0, 5) + '-' + d.slice(5)
}

/* ---------------------------------------------------------
   Regras
   --------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
const cheio = (v: string) => v.trim().length > 0

/**
 * Validação real de CPF: os dois últimos algarismos são dígitos
 * verificadores, calculados sobre os nove primeiros. Sequências de um
 * mesmo algarismo (111.111.111-11) passam na conta e por isso são
 * barradas à parte.
 */
export function cpfValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '')
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false

  const digito = (ate: number): number => {
    let soma = 0
    for (let i = 0; i < ate; i++) soma += Number(d[i]) * (ate + 1 - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  return digito(9) === Number(d[9]) && digito(10) === Number(d[10])
}

/** Idade em anos completos na data de hoje. */
export function idadeEm(iso: string): number | null {
  const [a, m, dia] = iso.split('-').map(Number)
  if (!a || !m || !dia) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - a
  const antes = hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < dia)
  if (antes) idade--
  return idade
}

/** Força da senha, de 0 a 4 — alimenta a régua sob o campo. */
export function forcaSenha(senha: string): number {
  let f = 0
  if (senha.length >= 8) f++
  if (senha.length >= 12) f++
  if (/[a-zA-Z]/.test(senha) && /\d/.test(senha)) f++
  if (/[^a-zA-Z0-9]/.test(senha)) f++
  return f
}

export function validateCadastro(form: CadastroForm): CadastroErrors {
  const e: CadastroErrors = {}

  // --- dados pessoais
  if (!cheio(form.nome)) e.nome = 'Precisamos do seu nome para abrir a ficha.'
  else if (form.nome.trim().split(/\s+/).length < 2) e.nome = 'Escreva nome e sobrenome.'

  if (!cheio(form.cpf)) e.cpf = 'O CPF identifica a sua ficha no ateliê.'
  else if (!cpfValido(form.cpf)) e.cpf = 'Esse CPF não confere. Verifique os números.'

  if (!cheio(form.nascimento)) e.nascimento = 'Informe a sua data de nascimento.'
  else {
    const idade = idadeEm(form.nascimento)
    if (idade === null) e.nascimento = 'Data inválida.'
    else if (idade < 16) e.nascimento = 'O cadastro é a partir de 16 anos.'
    else if (idade > 120) e.nascimento = 'Confira o ano de nascimento.'
  }

  if (!cheio(form.email)) e.email = 'É por aqui que confirmamos o cadastro.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Esse e-mail parece incompleto.'

  const digitos = form.telefone.replace(/\D/g, '')
  if (!digitos) e.telefone = 'Precisamos de um telefone de contato.'
  else if (digitos.length < 10) e.telefone = 'Inclua o DDD — são 10 ou 11 dígitos.'

  // --- endereço
  const cep = form.cep.replace(/\D/g, '')
  if (!cep) e.cep = 'O CEP abre o restante do endereço.'
  else if (cep.length !== 8) e.cep = 'O CEP tem 8 dígitos.'

  if (!cheio(form.logradouro)) e.logradouro = 'Informe a rua ou avenida.'
  if (!cheio(form.numero)) e.numero = 'Informe o número.'
  if (!cheio(form.bairro)) e.bairro = 'Informe o bairro.'
  if (!cheio(form.cidade)) e.cidade = 'Informe a cidade.'

  if (!cheio(form.estado)) e.estado = 'Escolha o estado.'
  else if (!(UFS as readonly string[]).includes(form.estado)) e.estado = 'Estado inválido.'

  // --- preferências
  if (!cheio(form.tamanho)) e.tamanho = 'Seu tamanho habitual prepara a arara.'
  if (form.estilos.length === 0) e.estilos = 'Marque ao menos um estilo do seu interesse.'
  if (form.observacoes.length > 400) e.observacoes = 'Resuma em até 400 caracteres.'

  // --- acesso
  if (!cheio(form.senha)) e.senha = 'Crie uma senha para acessar a sua conta.'
  else if (form.senha.length < 8) e.senha = 'A senha precisa de ao menos 8 caracteres.'
  else if (!/[a-zA-Z]/.test(form.senha) || !/\d/.test(form.senha))
    e.senha = 'Misture letras e números.'

  if (!cheio(form.confirmaSenha)) e.confirmaSenha = 'Repita a senha.'
  else if (form.confirmaSenha !== form.senha) e.confirmaSenha = 'As duas senhas não são iguais.'

  if (!form.aceite) e.aceite = 'É preciso aceitar os termos para concluir o cadastro.'

  return e
}

/** Protocolo da ficha — legível e fácil de ditar no balcão. */
export function fichaCode(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return 'MV-C' + String(hash % 10000).padStart(4, '0')
}
