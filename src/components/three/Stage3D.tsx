import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const SilkScene = lazy(() => import('./SilkScene'))
const DressViewer = lazy(() => import('./DressViewer'))

/**
 * Só acende a GPU quando a cena entra no campo de visão — e nunca
 * mais de uma vez. Enquanto isso, mostra o "fantasma" passado em
 * `placeholder`, para a página nunca aparecer vazia.
 */
function WhenVisible({
  children,
  placeholder,
  rootMargin = '240px',
}: {
  children: ReactNode
  placeholder?: ReactNode
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {visible ? <Suspense fallback={placeholder ?? null}>{children}</Suspense> : placeholder}
    </div>
  )
}

type SilkProps = Parameters<typeof SilkScene>[0]
type DressProps = Parameters<typeof DressViewer>[0]

export function LazySilkScene(props: SilkProps & { placeholder?: ReactNode }) {
  const { placeholder, ...rest } = props
  return (
    <WhenVisible placeholder={placeholder}>
      <SilkScene {...rest} />
    </WhenVisible>
  )
}

export function LazyDressViewer(props: DressProps & { placeholder?: ReactNode }) {
  const { placeholder, ...rest } = props
  return (
    <WhenVisible placeholder={placeholder} rootMargin="120px">
      <DressViewer {...rest} />
    </WhenVisible>
  )
}
