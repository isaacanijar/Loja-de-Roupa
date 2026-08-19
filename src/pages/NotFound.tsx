import { Page } from '@/components/layout/Page'
import { GarmentMorph } from '@/components/art/GarmentMorph'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { NAV } from '@/components/layout/Header'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

/* A peça continua trocando de forma — como quem procura na arara
   e não encontra o que veio buscar. */
const FRAMES = [
  { shape: 'slip' as const, colorway: { name: 'Pérola', hex: '#EFE4DC', sheen: '#FFFBF7', shade: '#CDB9AC' } },
  { shape: 'kimono' as const, colorway: { name: 'Malva', hex: '#CF92B3', sheen: '#F2DDE8', shade: '#9D5B81' } },
  { shape: 'trench' as const, colorway: { name: 'Areia', hex: '#E3D5CB', sheen: '#F7EFE8', shade: '#B7A49A' } },
]

export default function NotFound() {
  return (
    <Page title="Página não encontrada">
      <section className={['shell', styles.wrap].join(' ')}>
        <div className={styles.art}>
          <GarmentMorph frames={FRAMES} interval={2800} duration={1.3} className={styles.morph} />
        </div>

        <div className={styles.copy}>
          <p className="eyebrow">Erro 404</p>
          <TextReveal as="h1" immediate className={styles.title}>
            Esta peça saiu da arara
          </TextReveal>
          <p className="lede">
            A série pode ter fechado, ou o endereço veio com uma letra trocada. Nossas modelagens
            são arquivadas quando a última peça sai — e não voltam.
          </p>

          <Button to="/colecao" size="lg">
            Ver o que está no acervo
          </Button>

          <nav className={styles.links} aria-label="Atalhos">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </Page>
  )
}
