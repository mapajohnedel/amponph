import type { Metadata } from 'next'
import { SupportPageClient } from '@/components/support/support-page-client'

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Support AmponPH with a donation via GCash or Maya and help connect rescued dogs with loving homes.',
}

export default function SupportPage() {
  return <SupportPageClient />
}
