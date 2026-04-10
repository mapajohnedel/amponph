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
    <section className="relative overflow-hidden pb-24 pt-12 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-gradient-to-b from-primary/10 via-secondary/10 to-transparent" />
      <div className="absolute left-[8%] top-28 -z-10 h-20 w-20 rounded-full bg-[#ff9f6b]/25 blur-2xl" />
      <div className="absolute right-[10%] top-16 -z-10 h-24 w-24 rounded-full bg-[#84c5ff]/30 blur-2xl" />
      <div className="absolute right-[22%] top-1/2 -z-10 h-16 w-16 rounded-full bg-[#ffd36b]/35 blur-xl" />

      <div className="site-container grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">

          <div className="space-y-5">
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              Find Your New Best Friend &amp; Everything They Need!
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Adopt, don&apos;t shop. Thousands of loving pets are waiting, and we make the path
              from discovery to adoption feel warm, simple, and trustworthy.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_24px_48px_-22px_rgba(249,115,22,0.9)]"
            >
              Browse Pets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6e8fb] bg-white px-6 py-3.5 text-base font-semibold text-[#145da0] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              How it works
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((dog, index) => (
                <div
                  key={dog.id}
                  className="relative h-12 w-12 overflow-hidden rounded-full border-4 border-white bg-[#f8fbff] shadow-md"
                  style={{ zIndex: avatars.length - index }}
                >
                  <Image src={dog.image} alt={dog.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground sm:text-base">
              Loved by adopters and rescue teams across the Philippines.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_60px_-34px_rgba(20,44,90,0.35)] backdrop-blur sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 top-14 hidden rounded-full bg-white px-4 py-3 shadow-lg sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1e7] text-primary">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Adopt with heart</p>
                <p className="text-xs text-muted-foreground">From inquiry to forever home</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-3 bottom-10 hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#145da0]">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Search smarter</p>
                <p className="text-xs text-muted-foreground">Filter by size, age, and lifestyle</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-4 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.4)] backdrop-blur sm:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,180,119,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.18),_transparent_30%)]" />
            <div className="relative rounded-[2rem] bg-gradient-to-br from-[#fff5ec] via-white to-[#eef7ff] p-4">
              <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-[#ffb58f]/55 blur-2xl" />
              <div className="absolute bottom-12 left-8 h-20 w-20 rounded-full bg-[#9ad0ff]/50 blur-2xl" />

              <div className="absolute left-8 top-10 h-16 w-16 rounded-[2rem] bg-[#ffefe6]" />
              <div className="absolute bottom-12 right-6 h-12 w-12 rounded-full bg-[#dceeff]" />

              <div className="relative aspect-[4/4.3] overflow-hidden rounded-[2rem]">
                <Image
                  src="/hero-placeholder.svg"
                  alt="Illustration of a happy adopter holding a dog"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="relative -mt-8 ml-4 mr-4 rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Friendly, verified listings</p>
                    <p className="text-sm text-muted-foreground">
                      Designed to help more adopters take action.
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#145da0]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
