'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AppLoadingScreen } from '@/components/app/app-loading-screen'

function NavigationLoadingInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navigating, setNavigating] = useState(false)

  const routeKey = `${pathname}?${searchParams.toString()}`

  useEffect(() => {
    setNavigating(false)
  }, [routeKey])

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

      setNavigating(true)
    }

    const onPopState = () => {
      setNavigating(true)
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    if (!navigating) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navigating])

  if (!navigating) return null

  return <AppLoadingScreen variant="overlay" />
}

export function NavigationLoading() {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingInner />
    </Suspense>
  )
}
