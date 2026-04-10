import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Mail, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse Pets' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/auth', label: 'Log In' },
]

const supportLinks = [
  { href: '/#featured-pets', label: 'Featured Pets' },
  { href: '/#contact', label: 'Adoption Support' },
  { href: '/admin', label: 'Admin' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/60 bg-[linear-gradient(180deg,#fffaf6_0%,#eef7ff_100%)]">
      <div className="absolute left-[8%] top-12 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[10%] top-10 h-28 w-28 rounded-full bg-[#84c5ff]/20 blur-3xl" />

      <div className="site-container relative py-16">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.32)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-border/70">
                  <Image
                    src="/amponph-logo.png"
                    alt="AmponPH logo"
                    width={180}
                    height={78}
                    className="h-14 w-auto"
                  />
                </div>
                <div className="max-w-xl space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Helping more pets find loving homes across the Philippines.
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    A modern, adoption-first experience designed to make discovery, connection,
                    and rehoming feel warm, simple, and trustworthy.
                  </p>
                </div>
              </div>

              <Link
                href="/browse"
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Start Adopting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.32)] backdrop-blur sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Need adoption help?</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reach out for guidance on finding the right pet, preparing your home, or starting the
              application process.
            </p>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#145da0]" />
                <span>hello@amponph.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#145da0]" />
                <span>+63 917 000 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#145da0]" />
                <span>Metro Manila, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-[0_20px_60px_-36px_rgba(20,44,90,0.25)] backdrop-blur md:grid-cols-3 sm:p-8">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#145da0]">
              Quick Links
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#145da0]">
              Support
            </h3>
            <div className="space-y-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#145da0]">
              About AmponPH
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              We connect adopters with rescue-ready pets through a friendly, modern platform that
              prioritizes trust, clarity, and better matches.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AmponPH. Built to help pets get a second chance.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="/auth" className="transition-colors hover:text-primary">
              Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
