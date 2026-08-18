import { useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Choice.module.css'

/* ---------------------------------------------------------
   Select — nativo por baixo (teclado e mobile funcionam),
   vestido por cima.
   --------------------------------------------------------- */

interface SelectProps {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  wide?: boolean
  required?: boolean
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecione',
  error,
  wide,
  required,
}: SelectProps) {
  const id = useId()

  return (
    <div className={[styles.select, wide ? styles.wide : '', error ? styles.invalid : ''].join(' ')}>
      <label htmlFor={id} className={styles.selectLabel}>
        {label}
        {!required && <span className={styles.optional}> (opcional)</span>}
      </label>

      <div className={styles.selectControl}>
        <select
          id={id}
          className={styles.native}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? id + '-err' : undefined}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <svg className={styles.caret} viewBox="0 0 16 10" aria-hidden="true">
          <path d="M1 1L8 8L15 1" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className={styles.underline} aria-hidden="true" />
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={id + '-err'}
            className={styles.error}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------------------------------------------------------
   Pílulas de escolha única — o marcador desliza entre elas.
   --------------------------------------------------------- */

interface PillGroupProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  error?: string
  /** identificador do grupo, para o marcador não migrar entre grupos */
  name: string
}

export function PillGroup({ label, value, options, onChange, error, name }: PillGroupProps) {
  return (
    <fieldset className={styles.pills}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.pillRow} role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              className={[styles.pill, active ? styles.pillOn : ''].join(' ')}
              onClick={() => onChange(opt.value)}
            >
              {active && (
                <motion.span
                  layoutId={'pill-' + name}
                  className={styles.pillFill}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className={styles.pillText}>{opt.label}</span>
            </button>
          )
        })}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </fieldset>
  )
}

/* ---------------------------------------------------------
   Caixa de marcação — o "risco" é costurado, não desenhado.
   --------------------------------------------------------- */

interface CheckLineProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  error?: string
}

export function CheckLine({ checked, onChange, children, error }: CheckLineProps) {
  return (
    <div className={styles.checkWrap}>
      <label className={styles.check}>
        <input
          type="checkbox"
          className={styles.checkInput}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.box} aria-hidden="true">
          <motion.svg viewBox="0 0 20 20" initial={false}>
            <motion.path
              d="M4 10.6 L8.2 14.6 L16 5.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>
        </span>
        <span className={styles.checkText}>{children}</span>
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
