'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, HeartHandshake, Search } from 'lucide-react'
import { DogCard } from '@/components/dog-card'
import { type FilterOptions, DogFilter } from '@/components/dog-filter'
import { filterDogs, type Dog } from '@/lib/mock-dogs'

type BrowsePageClientProps = {
  dogs: Dog[]
}

export function BrowsePageClient({ dogs }: BrowsePageClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({})

  const handleFilterChange = (nextFilters: FilterOptions) => {
    setFilters(nextFilters)
  }

  const filteredDogs = useMemo(() => {
    return filterDogs(filters, dogs)
  }, [dogs, filters])

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_42%,#fffaf6_100%)]">
      <section className="relative overflow-hidden pb-16 pt-12">
        <div className="absolute left-[8%] top-24 -z-10 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[12%] top-20 -z-10 h-28 w-28 rounded-full bg-[#84c5ff]/25 blur-3xl" />

        <div className="site-container">
          <div className="mb-12 rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  Browse adoptable pets
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Find the pet that feels like family.
                </h1>
                <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
                  Explore loving companions across the Philippines with clearer details, friendly
                  filters, and a warmer adoption experience.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[24rem]">
                <div className="rounded-[1.75rem] bg-[#fff7f1] p-5 shadow-sm">
                  <p className="text-2xl font-bold text-foreground">{filteredDogs.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Available dog{filteredDogs.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-[#f3f9ff] p-5 shadow-sm">
                  <p className="text-2xl font-bold text-foreground">PH</p>
                  <p className="text-sm text-muted-foreground">Local adoption-ready listings</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#fff9ea] p-5 shadow-sm">
                  <p className="text-2xl font-bold text-foreground">Easy</p>
                  <p className="text-sm text-muted-foreground">Filters to match your lifestyle</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pet-results"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Browse Pets
                <Search className="h-4 w-4" />
              </a>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6e8fb] bg-white px-6 py-3.5 font-semibold text-[#145da0] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start Your Adoption Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div id="pet-results" className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div>
              <div className="sticky top-24 space-y-4">
                <DogFilter onFilterChange={handleFilterChange} />
                <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_45px_-28px_rgba(20,44,90,0.28)] backdrop-blur">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">Need help choosing?</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Start with size, breed, or location and narrow down the pets that match your
                    home and routine.
                  </p>
                </div>
              </div>
            </div>

            <div>
              {filteredDogs.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDogs.map((dog) => (
                    <DogCard key={dog.id} dog={dog} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/70 bg-white/80 py-20 text-center shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur">
                  <p className="mb-3 text-2xl font-semibold text-foreground">No dogs found</p>
                  <p className="max-w-md text-base leading-7 text-muted-foreground">
                    Try adjusting your filters to see more available pets near your preferred
                    location.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
