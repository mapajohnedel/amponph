'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function NavigationLoadingInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navigating, setNavigating] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const navigatingRef = useRef(false)

  const routeKey = `${pathname}?${searchParams.toString()}`

  useEffect(() => {
    if (!navigatingRef.current) return
    navigatingRef.current = false
    setNavigating(false)
    setFinishing(true)
  }, [routeKey])

  useEffect(() => {
    if (!finishing) return
    const timeout = window.setTimeout(() => setFinishing(false), 400)
    return () => window.clearTimeout(timeout)
  }, [finishing])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.hasAttribute('download')) return
      if (anchor.target === '_blank' || anchor.target === '_parent') return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (e.button !== 0) return

      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return

      const nextPath = `${url.pathname}${url.search}`
      const currentPath = `${window.location.pathname}${window.location.search}`
      if (nextPath === currentPath) return

      navigatingRef.current = true
      setFinishing(false)
      setNavigating(true)
    }

    const onPopState = () => {
      navigatingRef.current = true
      setFinishing(false)
      setNavigating(true)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  if (!navigating && !finishing) return null

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-busy={navigating}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        className={`h-full origin-left bg-gradient-to-r from-primary via-[#f59e0b] to-[#3b82f6] shadow-[0_0_10px_rgba(249,115,22,0.6)] ${
          navigating ? 'navigation-progress-running' : 'navigation-progress-done'
        }`}
      />
    </div>
  )
}

export function NavigationLoading() {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingInner />
    </Suspense>
  )
}
