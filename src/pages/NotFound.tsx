import { Page } from '@/components/layout/Page'
import { PhotoMorph, frameOf } from '@/components/art/PhotoMorph'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { NAV } from '@/components/layout/Header'
import { getProduct } from '@/data/products'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

/* A peça continua trocando de forma — como quem procura na arara
   e não encontra o que veio buscar. */
const FRAMES = [
  frameOf(getProduct('vestido-alba')!),
  frameOf(getProduct('kimono-lumen')!, getProduct('kimono-lumen')!.colorways[1]),
  frameOf(getProduct('trench-verao-tardio')!),
]

export default function NotFound() {
  return (
    <Page title="Página não encontrada">
      <section className={['shell', styles.wrap].join(' ')}>
        <div className={styles.art}>
          <PhotoMorph frames={FRAMES} interval={3000} duration={1.1} className={styles.morph} />
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
