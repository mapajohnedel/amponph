import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Search, ShieldCheck } from 'lucide-react'
import type { Dog } from '@/lib/mock-dogs'

type HeroProps = {
  dogs: Dog[]
}

const quickStats = [
  { label: 'Rescue partners', value: '120+' },
  { label: 'Happy adoptions', value: '3.4k' },
  { label: 'Avg. match time', value: '48 hrs' },
]

export function Hero({ dogs }: HeroProps) {
  const avatars = dogs.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-white dark:bg-card pb-20 pt-16 sm:pt-24 lg:pb-32 lg:pt-32">
      {/* Soft background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-50 dark:from-orange-500/10 via-white dark:via-card to-blue-50 dark:to-blue-500/10 opacity-70" />
      
      <div className="site-container grid items-center gap-16 lg:grid-cols-2">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
              <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
              Adopt, don&apos;t shop 🐾
            </div>
            <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-6xl lg:text-7xl">
              Find Your New Best Friend.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
              Thousands of loving pets are waiting for a home. We make the path from discovery to adoption feel warm, simple, and trustworthy.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/browse"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-500 px-8 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Browse Pets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/partner/register"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-50 dark:bg-muted px-8 text-base font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-muted"
            >
              Register as Shelter
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-border">
            <div className="flex -space-x-3">
              {avatars.map((dog, index) => (
                <div
                  key={dog.id}
                  className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white dark:ring-card"
                  style={{ zIndex: avatars.length - index }}
                >
                  <Image src={dog.image} alt={dog.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-foreground">3.4k+</span> happy adoptions
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-muted shadow-2xl ring-1 ring-slate-900/5">
            <Image
              src="/hero-placeholder.svg"
              alt="Illustration of a happy adopter holding a dog"
              fill
              priority
              className="object-cover"
            />
            
            {/* Subtle overlay elements for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 dark:bg-card/90 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-foreground">Verified Rescue Partners</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Every listing is reviewed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
