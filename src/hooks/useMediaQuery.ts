import { useEffect, useState } from 'react'

/** Assina uma media query e devolve o estado atual. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Quem pediu menos movimento recebe menos movimento — em todo o site. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export const useIsCoarsePointer = () => useMediaQuery('(hover: none), (pointer: coarse)')

export const useIsMobile = () => useMediaQuery('(max-width: 780px)')
