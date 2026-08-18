import type { ShapeKey } from '@/lib/garment'

export interface Colorway {
  /** nome comercial do tom, como aparece na etiqueta */
  name: string
  /** cor base do tecido */
  hex: string
  /** brilho do fio — usado no gradiente de seda e no material 3D */
  sheen: string
  /** sombra da prega */
  shade: string
}

export type Category = 'vestidos' | 'alfaiataria' | 'blusas' | 'sob-medida'

export interface Product {
  id: string
  slug: string
  name: string
  /** linha de apoio, em serifada itálica */
  subtitle: string
  category: Category
  price: number
  shape: ShapeKey
  colorways: Colorway[]
  sizes: string[]
  fabric: string
  /** país / origem do tecido */
  origin: string
  description: string
  /** notas do ateliê, exibidas no acordeão da página de produto */
  atelier: { label: string; value: string }[]
  /** peças produzidas nesta série */
  edition: number
  badge?: 'novo' | 'última série' | 'ícone'
}

export interface Look {
  id: string
  title: string
  subtitle: string
  shape: ShapeKey
  colorway: Colorway
  /** slug do produto que ancora o look */
  productSlug: string
  caption: string
}
