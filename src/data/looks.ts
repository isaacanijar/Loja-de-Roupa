import type { Look } from '@/types/catalog'

/* Editorial "Véspera" — a sequência de looks do lookbook.
   A ordem importa: é ela que define a coreografia do morph
   quando a página é rolada. */

export const LOOKS: Look[] = [
  {
    id: 'l-01',
    title: 'Primeira luz',
    subtitle: 'Look 01',
    shape: 'slip',
    colorway: { name: 'Pérola', hex: '#EFE4DC', sheen: '#FFFBF7', shade: '#CDB9AC' },
    productSlug: 'vestido-alba',
    caption:
      'A seda ainda fria da noite. Fotografado às 6h47 no ateliê, sem passar a peça — as marcas do cabide fazem parte.',
  },
  {
    id: 'l-02',
    title: 'Meio da manhã',
    subtitle: 'Look 02',
    shape: 'bufante',
    colorway: { name: 'Blush', hex: '#F0D4D0', sheen: '#FFEDEA', shade: '#C9A29D' },
    productSlug: 'blusa-serena',
    caption:
      'O linho abre a manga contra a luz e devolve a forma sozinho. Nenhuma armação por baixo.',
  },
  {
    id: 'l-03',
    title: 'Hora do vento',
    subtitle: 'Look 03',
    shape: 'trench',
    colorway: { name: 'Areia', hex: '#E3D5CB', sheen: '#F7EFE8', shade: '#B7A49A' },
    productSlug: 'trench-verao-tardio',
    caption:
      'Trench aberto, cinto na mão. A gabardine lavada cai como um tecido que já foi usado por alguém antes — de propósito.',
  },
  {
    id: 'l-04',
    title: 'Fim de tarde',
    subtitle: 'Look 04',
    shape: 'kimono',
    colorway: { name: 'Ouro pálido', hex: '#E6D0B3', sheen: '#FBF0DC', shade: '#C8A06A' },
    productSlug: 'kimono-lumen',
    caption:
      'O cetim de bambu pega o último sol da janela oeste. Foi por causa desta hora que a cor existe.',
  },
  {
    id: 'l-05',
    title: 'Véspera',
    subtitle: 'Look 05',
    shape: 'gode',
    colorway: { name: 'Ameixa', hex: '#4A3340', sheen: '#8A6C7C', shade: '#241119' },
    productSlug: 'vestido-noturno',
    caption:
      'O godê parado é uma coluna. Doze peças, numeradas de 01/12 a 12/12 na etiqueta interna.',
  },
]
