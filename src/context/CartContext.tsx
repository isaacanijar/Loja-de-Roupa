import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Colorway, Product } from '@/types/catalog'

export interface CartLine {
  key: string
  product: Product
  size: string
  colorway: Colorway
  qty: number
}

interface CartValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  /** peça recém-adicionada — dispara a animação de confirmação */
  lastAdded: string | null
  add: (product: Product, size: string, colorway: Colorway) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  open: () => void
  close: () => void
}

const CartCtx = createContext<CartValue | null>(null)

const lineKey = (p: Product, size: string, c: Colorway) => p.id + '|' + size + '|' + c.name

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  const add = useCallback((product: Product, size: string, colorway: Colorway) => {
    const key = lineKey(product, size, colorway)
    setLines((prev) => {
      const found = prev.find((l) => l.key === key)
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 5) } : l))
      }
      return [...prev, { key, product, size, colorway, qty: 1 }]
    })
    setLastAdded(key)
    setOpen(true)
    window.setTimeout(() => setLastAdded(null), 2200)
  }, [])

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 5) } : l)),
    )
  }, [])

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
    return {
      lines,
      count,
      subtotal,
      isOpen,
      lastAdded,
      add,
      remove,
      setQty,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }
  }, [lines, isOpen, lastAdded, add, remove, setQty])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartValue {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return ctx
}
