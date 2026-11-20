import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { primaryActionClass, secondaryActionClass, StatusPage } from '@/components/status-page'

export default function NotFound() {
  return (
    <StatusPage
      icon={PawPrint}
      eyebrow="404"
      title="We couldn't find that page"
      description="The page may have moved, or the pet you were looking for has already found a home."
      actions={
        <>
          <Link href="/browse" className={primaryActionClass}>
            Browse pets
          </Link>
          <Link href="/" className={secondaryActionClass}>
            Go home
          </Link>
        </>
      }
    />
  )
}
