import styles from './Wordmark.module.css'

interface WordmarkProps {
  /** exibe a assinatura "ateliê de moda autoral" sob o nome */
  signature?: boolean
  className?: string
}

/**
 * Marca MALVA: a flor de malva tem cinco pétalas — o símbolo é
 * um corte transversal dela, desenhado com uma linha só.
 */
export function MalvaMark({ className }: { className?: string }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg viewBox="-32 -32 64 64" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {petals.map((deg) => (
          <path
            key={deg}
            d="M0 0 C -9 -8, -7 -22, 0 -26 C 7 -22, 9 -8, 0 0 Z"
            transform={'rotate(' + deg + ')'}
            opacity="0.9"
          />
        ))}
        <circle r="3.1" fill="currentColor" stroke="none" opacity="0.65" />
      </g>
    </svg>
  )
}

export function Wordmark({ signature = false, className }: WordmarkProps) {
  return (
    <span className={[styles.wrap, className ?? ''].join(' ')}>
      <MalvaMark className={styles.mark} />
      <span className={styles.text}>
        <span className={styles.name}>malva</span>
        {signature && <span className={styles.sig}>ateliê de moda autoral</span>}
      </span>
    </span>
  )
}
