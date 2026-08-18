import type { Product } from '@/types/catalog'

/* Acervo do ateliê. Cada peça aponta para uma modelagem paramétrica
   (SHAPES) e para uma cartela de cores que alimenta tanto a arte SVG
   quanto o material do visualizador 3D. */

export const PRODUCTS: Product[] = [
  {
    id: 'p-01',
    slug: 'vestido-alba',
    name: 'Vestido Alba',
    subtitle: 'o primeiro claro do dia',
    category: 'vestidos',
    price: 1890,
    shape: 'slip',
    colorways: [
      { name: 'Pérola', hex: '#EFE4DC', sheen: '#FFFBF7', shade: '#CDB9AC' },
      { name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' },
      { name: 'Ameixa', hex: '#4A3340', sheen: '#7B6672', shade: '#241119' },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    fabric: 'Seda charmeuse 19mm',
    origin: 'Fio italiano, tecelagem em Como',
    description:
      'Cortado na diagonal do tecido para que a seda escorra pelo corpo em vez de vesti-lo. A alça é uma fita única, contínua, que atravessa o decote sem costura aparente. É a peça que abriu o ateliê e continua sendo a mais pedida.',
    atelier: [
      { label: 'Modelagem', value: 'Viés integral, sem zíper — veste pela cabeça' },
      { label: 'Acabamento', value: 'Barra em rolotê feita à mão, 4h por peça' },
      { label: 'Cuidados', value: 'Lavagem a seco. Guardar pendurado em cabide forrado' },
      { label: 'Caimento', value: 'Fluido. Para um caimento mais justo, escolha um número abaixo' },
    ],
    edition: 40,
    badge: 'ícone',
  },
  {
    id: 'p-02',
    slug: 'trench-verao-tardio',
    name: 'Trench Verão Tardio',
    subtitle: 'para o vento que muda em março',
    category: 'alfaiataria',
    price: 2740,
    shape: 'trench',
    colorways: [
      { name: 'Areia', hex: '#E3D5CB', sheen: '#F7EFE8', shade: '#B7A49A' },
      { name: 'Musgo', hex: '#9AA891', sheen: '#C3CDBB', shade: '#6C7A64' },
    ],
    sizes: ['P', 'M', 'G'],
    fabric: 'Gabardine de algodão lavado',
    origin: 'Algodão orgânico, tecelagem em Americana/SP',
    description:
      'Um trench sem peso. O algodão passa por lavagem enzimática antes do corte, então a peça já chega macia — sem aquele período de amaciamento que endurece o ombro. Cinto removível, forro em cupro respirável.',
    atelier: [
      { label: 'Modelagem', value: 'Ombro caído, transpasse duplo, costas com prega macho' },
      { label: 'Acabamento', value: 'Casas de botão feitas à máquina de olhal, uma a uma' },
      { label: 'Cuidados', value: 'Lavar à mão em água fria. Secar à sombra, na horizontal' },
      { label: 'Caimento', value: 'Oversized por projeto. Fica no tamanho habitual' },
    ],
    edition: 24,
    badge: 'novo',
  },
  {
    id: 'p-03',
    slug: 'blusa-serena',
    name: 'Blusa Serena',
    subtitle: 'manga que ocupa espaço',
    category: 'blusas',
    price: 980,
    shape: 'bufante',
    colorways: [
      { name: 'Marfim', hex: '#FBF7F4', sheen: '#FFFFFF', shade: '#DCCEC4' },
      { name: 'Blush', hex: '#F0D4D0', sheen: '#FFEDEA', shade: '#C9A29D' },
      { name: 'Ouro pálido', hex: '#E6D0B3', sheen: '#F7E9D3', shade: '#C8A06A' },
    ],
    sizes: ['PP', 'P', 'M', 'G'],
    fabric: 'Voil de linho belga',
    origin: 'Linho cultivado em Flandres',
    description:
      'A manga é construída em três painéis, não em franzido — por isso ela mantém o volume redondo mesmo depois de horas de uso. Decote quadrado, punho fechado por dois botões de madrepérola.',
    atelier: [
      { label: 'Modelagem', value: 'Manga bufante em três gomos, cava alta' },
      { label: 'Acabamento', value: 'Costuras francesas em toda a peça, avesso limpo' },
      { label: 'Cuidados', value: 'Lavar à mão. Passar ainda úmida, do avesso' },
      { label: 'Caimento', value: 'Justo no corpo, amplo na manga' },
    ],
    edition: 60,
  },
  {
    id: 'p-04',
    slug: 'vestido-noturno',
    name: 'Vestido Noturno',
    subtitle: 'saia que desenha o giro',
    category: 'vestidos',
    price: 3200,
    shape: 'gode',
    colorways: [
      { name: 'Ameixa', hex: '#4A3340', sheen: '#8A6C7C', shade: '#241119' },
      { name: 'Malva profunda', hex: '#9D5B81', sheen: '#CF92B3', shade: '#6B3A56' },
    ],
    sizes: ['PP', 'P', 'M', 'G'],
    fabric: 'Crepe de seda duplo',
    origin: 'Fio italiano, tecelagem em Como',
    description:
      'Tomara-que-caia com estrutura interna leve — três barbatanas flexíveis apenas, o suficiente para sustentar sem prender a respiração. A saia é um godê de círculo completo: parada, cai reta; em movimento, abre.',
    atelier: [
      { label: 'Modelagem', value: 'Corpo estruturado, saia em godê de círculo inteiro' },
      { label: 'Acabamento', value: 'Zíper invisível costurado à mão, 90 min por peça' },
      { label: 'Cuidados', value: 'Lavagem a seco exclusivamente' },
      { label: 'Caimento', value: 'Ajustado no busto e na cintura. Provador recomendado' },
    ],
    edition: 12,
    badge: 'última série',
  },
  {
    id: 'p-05',
    slug: 'blazer-longo-atlas',
    name: 'Blazer Longo Atlas',
    subtitle: 'alfaiataria que respira',
    category: 'alfaiataria',
    price: 2380,
    shape: 'alfaiataria',
    colorways: [
      { name: 'Grafite', hex: '#3D3439', sheen: '#6D6167', shade: '#1F1A1E' },
      { name: 'Areia', hex: '#E3D5CB', sheen: '#F7EFE8', shade: '#B7A49A' },
      { name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' },
    ],
    sizes: ['P', 'M', 'G', 'GG'],
    fabric: 'Lã fria super 120s',
    origin: 'Lã merino, tecelagem em Biella',
    description:
      'Alfaiataria sem entretela pesada: a estrutura vem do corte, não do reforço. Ombro natural, lapela fina e comprimento que passa do quadril. Veste sobre vestido, sobre nada, sobre o ano inteiro.',
    atelier: [
      { label: 'Modelagem', value: 'Dois botões, lapela fina, fenda dupla nas costas' },
      { label: 'Acabamento', value: 'Ombro montado à mão, sem entretela termocolante' },
      { label: 'Cuidados', value: 'Escovar após o uso. Lavagem a seco quando necessário' },
      { label: 'Caimento', value: 'Reto e alongado. Fica no tamanho habitual' },
    ],
    edition: 30,
  },
  {
    id: 'p-06',
    slug: 'kimono-lumen',
    name: 'Kimono Lúmen',
    subtitle: 'cetim que atravessa a sala',
    category: 'blusas',
    price: 1640,
    shape: 'kimono',
    colorways: [
      { name: 'Ouro pálido', hex: '#E6D0B3', sheen: '#FBF0DC', shade: '#C8A06A' },
      { name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' },
    ],
    sizes: ['Único'],
    fabric: 'Cetim de viscose de bambu',
    origin: 'Viscose de circuito fechado, Áustria',
    description:
      'Manga morcego, cintura marcada só pela faixa. É peça de casa e é peça de festa — a diferença está no que vai por baixo. O cetim de bambu tem o brilho da seda com o toque frio do linho.',
    atelier: [
      { label: 'Modelagem', value: 'Tamanho único, manga morcego, faixa de amarrar' },
      { label: 'Acabamento', value: 'Viés contrastante em toda a borda, aplicado à mão' },
      { label: 'Cuidados', value: 'Lavar à mão em água fria. Não torcer' },
      { label: 'Caimento', value: 'Amplo e envolvente' },
    ],
    edition: 45,
  },
  {
    id: 'p-07',
    slug: 'macacao-praia-funda',
    name: 'Macacão Praia Funda',
    subtitle: 'linho lavado mil vezes',
    category: 'sob-medida',
    price: 2120,
    shape: 'macacao',
    colorways: [
      { name: 'Marfim', hex: '#FBF7F4', sheen: '#FFFFFF', shade: '#DCCEC4' },
      { name: 'Musgo', hex: '#9AA891', sheen: '#C3CDBB', shade: '#6C7A64' },
      { name: 'Ameixa', hex: '#4A3340', sheen: '#8A6C7C', shade: '#241119' },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    fabric: 'Linho pesado stone washed',
    origin: 'Linho europeu, lavanderia em São Paulo',
    description:
      'Perna ampla, cós alto, decote em V profundo fechado por um único colchete. Feito sob medida: o comprimento da perna é ajustado à sua altura e ao salto que você pretende usar.',
    atelier: [
      { label: 'Modelagem', value: 'Cós alto, perna reta ampla, costas nuas' },
      { label: 'Acabamento', value: 'Barra ajustada após a prova, com você na peça' },
      { label: 'Cuidados', value: 'Máquina, ciclo delicado, água fria. Amassa — é linho' },
      { label: 'Caimento', value: 'Sob medida. Duas provas incluídas' },
    ],
    edition: 8,
    badge: 'novo',
  },
  {
    id: 'p-08',
    slug: 'vestido-vespera',
    name: 'Vestido Véspera',
    subtitle: 'a noite antes da noite',
    category: 'vestidos',
    price: 2460,
    shape: 'slip',
    colorways: [
      { name: 'Malva profunda', hex: '#9D5B81', sheen: '#CF92B3', shade: '#6B3A56' },
      { name: 'Grafite', hex: '#3D3439', sheen: '#6D6167', shade: '#1F1A1E' },
    ],
    sizes: ['P', 'M', 'G'],
    fabric: 'Musseline de seda com forro em habotai',
    origin: 'Fio italiano, tecelagem em Como',
    description:
      'Duas camadas que se movem em tempos diferentes: o forro acompanha o corpo, a musseline chega meio segundo depois. É o vestido que fotografa em movimento.',
    atelier: [
      { label: 'Modelagem', value: 'Duas camadas independentes, decote drapeado' },
      { label: 'Acabamento', value: 'Barra da musseline com fio de seda, ponto invisível' },
      { label: 'Cuidados', value: 'Lavagem a seco. Vaporizar em vez de passar' },
      { label: 'Caimento', value: 'Fluido, marca a cintura sem apertar' },
    ],
    edition: 18,
  },
]

export const CATEGORIES = [
  { key: 'todos', label: 'Todo o acervo' },
  { key: 'vestidos', label: 'Vestidos' },
  { key: 'alfaiataria', label: 'Alfaiataria' },
  { key: 'blusas', label: 'Blusas & kimonos' },
  { key: 'sob-medida', label: 'Sob medida' },
] as const

export type CategoryFilter = (typeof CATEGORIES)[number]['key']

export const getProduct = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug)

export const relatedProducts = (product: Product, count = 3): Product[] =>
  PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const sameCat = (p: typeof a) => (p.category === product.category ? 0 : 1)
      return sameCat(a) - sameCat(b)
    })
    .slice(0, count)
