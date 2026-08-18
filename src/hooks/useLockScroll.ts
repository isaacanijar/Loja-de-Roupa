import { useEffect } from 'react'

/** Trava o scroll do documento sem deixar a página "pular" pela barra. */
export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = gap + 'px'

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [locked])
}
