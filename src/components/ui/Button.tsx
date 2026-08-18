import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** ocupa toda a largura disponível */
  block?: boolean
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }

type LinkProps = CommonProps & { to: string; href?: undefined }
type AnchorProps = CommonProps & { href: string; to?: undefined; target?: string; rel?: string }

/**
 * Botão do ateliê. O preenchimento sobe de baixo para cima no hover —
 * o mesmo gesto do tecido sendo levantado do cabide.
 */
export function Button(props: ButtonProps | LinkProps | AnchorProps) {
  const { children, variant = 'solid', size = 'md', className, block, ...rest } = props as
    CommonProps & Record<string, unknown>

  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    block ? styles.block : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </>
  )

  if ('to' in props && props.to) {
    const { to, ...linkRest } = rest as { to: string }
    return (
      <Link to={to} className={cls} {...linkRest}>
        {inner}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = rest as { href: string }
    return (
      <a href={href} className={cls} {...anchorRest}>
        {inner}
      </a>
    )
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
