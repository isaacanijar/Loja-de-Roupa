import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Field.module.css'

interface BaseProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  /** ocupa duas colunas na grade do formulário */
  wide?: boolean
  className?: string
}

interface InputProps extends BaseProps {
  type?: 'text' | 'email' | 'tel' | 'date' | 'number'
  min?: string
  max?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
  autoComplete?: string
  suffix?: string
}

interface AreaProps extends BaseProps {
  rows?: number
  maxLength?: number
}

/** Mensagem de erro: serifada em itálico, nunca em caixa vermelha. */
function ErrorLine({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          className={styles.error}
          role="alert"
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function Field({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  wide,
  className,
  type = 'text',
  min,
  max,
  inputMode,
  autoComplete,
  suffix,
}: InputProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  // campos de data mostram o placeholder nativo — o rótulo já sobe
  const lifted = focused || value.length > 0 || type === 'date'

  return (
    <div
      className={[
        styles.field,
        wide ? styles.wide : '',
        error ? styles.invalid : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label htmlFor={id} className={[styles.label, lifted ? styles.lifted : ''].join(' ')}>
        {label}
        {!required && <span className={styles.optional}> (opcional)</span>}
      </label>

      <div className={styles.control}>
        <input
          id={id}
          className={styles.input}
          type={type}
          value={value}
          min={min}
          max={max}
          inputMode={inputMode}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? id + '-err' : hint ? id + '-hint' : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
        <span className={styles.underline} aria-hidden="true" />
      </div>

      {hint && !error && (
        <p id={id + '-hint'} className={styles.hint}>
          {hint}
        </p>
      )}
      <ErrorLine id={id + '-err'} message={error} />
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  disabled,
  wide,
  className,
  rows = 4,
  maxLength = 600,
}: AreaProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div
      className={[
        styles.field,
        wide ? styles.wide : '',
        error ? styles.invalid : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label htmlFor={id} className={[styles.label, lifted ? styles.lifted : ''].join(' ')}>
        {label}
        {!required && <span className={styles.optional}> (opcional)</span>}
      </label>

      <div className={styles.control}>
        <textarea
          id={id}
          className={[styles.input, styles.area].join(' ')}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? id + '-err' : hint ? id + '-hint' : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.underline} aria-hidden="true" />
      </div>

      <div className={styles.areaFoot}>
        {hint && !error && (
          <p id={id + '-hint'} className={styles.hint}>
            {hint}
          </p>
        )}
        <span className={styles.counter}>
          {value.length}/{maxLength}
        </span>
      </div>
      <ErrorLine id={id + '-err'} message={error} />
    </div>
  )
}
