import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { NavigationLoading } from '@/components/navigation-loading'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'AmponPH | Pet Adoption Platform in the Philippines',
    template: '%s | AmponPH',
  },
  description:
    'AmponPH helps Filipino families discover adoptable pets, connect with rescues, and start a loving adoption journey.',
  applicationName: 'AmponPH',
  keywords: [
    'AmponPH',
    'pet adoption Philippines',
    'dog adoption Philippines',
    'adopt pets',
    'rescue dogs Philippines',
    'animal rescue',
  ],
  icons: {
    icon: '/amponph-logo.png',
    shortcut: '/amponph-logo.png',
    apple: '/amponph-logo.png',
  },
  openGraph: {
    title: 'AmponPH | Pet Adoption Platform in the Philippines',
    description:
      'Browse adoptable pets, connect with rescues, and help more animals find loving homes across the Philippines.',
    type: 'website',
    siteName: 'AmponPH',
    images: [
      {
        url: '/amponph-logo.png',
        width: 1024,
        height: 1024,
        alt: 'AmponPH logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AmponPH | Pet Adoption Platform in the Philippines',
    description:
      'Browse adoptable pets and start a warmer, more trusted adoption journey with AmponPH.',
    images: ['/amponph-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <NavigationLoading />
        <main className="pt-[4.75rem] lg:pt-20">
          {children}
        </main>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
