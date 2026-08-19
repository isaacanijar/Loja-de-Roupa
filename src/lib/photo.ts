import type { Colorway, Product } from '@/types/catalog'

/* =========================================================
   MALVA — Endereço das fotos de catálogo

   Cada peça é fotografada uma vez por banho de cor, em
   manequim invisível, sempre no mesmo fundo e na mesma luz.
   O caminho não é guardado no acervo: ele é DERIVADO do slug
   da peça e do nome do tom, para não existir a possibilidade
   de a lista de cores e a lista de arquivos saírem de sincronia.

   public/pecas/{slug}--{tom}.webp
   ========================================================= */

/** "Ouro pálido" → "ouro-palido" */
export function toneSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
}

export function photoOf(product: Product, colorway: Colorway): string {
  return '/pecas/' + product.slug + '--' + toneSlug(colorway.name) + '.webp'
}

/**
 * Retalho de tecido recortado do meio da fotografia — é ele que veste
 * o volume 3D. Ladrilhado em espelho, fecha a volta da peça sem emenda;
 * a fotografia inteira não serviria, porque o fundo do estúdio entraria
 * junto e viraria listra em torno do corpo.
 */
export function swatchOf(product: Product, colorway: Colorway): string {
  return '/pecas/tecido/' + product.slug + '--' + toneSlug(colorway.name) + '.webp'
}

/** Foto de abertura da peça — o primeiro tom da cartela. */
export const coverOf = (product: Product): string => photoOf(product, product.colorways[0])
