import { motion } from 'framer-motion'
import styles from './StepBar.module.css'

interface StepBarProps {
  steps: string[]
  current: number
  /** permite voltar clicando em um passo já visitado */
  onJump?: (index: number) => void
  furthest: number
}

/** Régua de alfaiate: marca em que ponto do agendamento você está. */
export function StepBar({ steps, current, onJump, furthest }: StepBarProps) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100

  return (
    <div className={styles.wrap}>
      <div className={styles.rail} aria-hidden="true">
        <motion.span
          className={styles.fill}
          animate={{ width: pct + '%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <ol className={styles.list}>
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          const reachable = i <= furthest
          return (
            <li key={step} className={styles.item}>
              <button
                type="button"
                className={[
                  styles.node,
                  done ? styles.done : '',
                  active ? styles.active : '',
                  reachable ? '' : styles.locked,
                ].join(' ')}
                onClick={() => reachable && onJump?.(i)}
                disabled={!reachable}
                aria-current={active ? 'step' : undefined}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.label}>{step}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
