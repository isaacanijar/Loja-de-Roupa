import styles from './Marquee.module.css'

interface MarqueeProps {
  items: string[]
  /** segundos por volta completa */
  speed?: number
  /** inverte o sentido */
  reverse?: boolean
  /** versão grande, em serifada */
  display?: boolean
  className?: string
}

/** Faixa contínua — o letreiro da vitrine. */
export function Marquee({
  items,
  speed = 42,
  reverse = false,
  display = false,
  className,
}: MarqueeProps) {
  const line = [...items, ...items]

  return (
    <div
      className={[styles.wrap, display ? styles.display : '', className ?? ''].join(' ')}
      aria-hidden="true"
    >
      <div
        className={styles.track}
        style={{
          animationDuration: speed + 's',
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {line.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <i className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  )
}
