'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { primaryActionClass, secondaryActionClass, StatusPage } from '@/components/status-page'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPage
      icon={TriangleAlert}
      eyebrow="Something went wrong"
      title="This page hit a snag"
      description="Please try again. If it keeps happening, come back in a few minutes."
      actions={
        <>
          <button type="button" onClick={reset} className={primaryActionClass}>
            Try again
          </button>
          <Link href="/" className={secondaryActionClass}>
            Go home
          </Link>
        </>
      }
    />
  )
}
