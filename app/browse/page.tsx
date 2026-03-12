'use client'

import { useMemo, useState } from 'react'
import { DogCard } from '@/components/dog-card'
import { DogFilter, FilterOptions } from '@/components/dog-filter'
import { filterDogs } from '@/lib/mock-dogs'
import { useDogCatalog } from '@/lib/dog-catalog'

export default function BrowsePage() {
  const dogs = useDogCatalog()
  const [filters, setFilters] = useState<FilterOptions>({})

  const handleFilterChange = (filters: FilterOptions) => {
    setFilters(filters)
  }

  const filteredDogs = useMemo(() => {
    return filterDogs(filters, dogs)
  }, [dogs, filters])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect Dog
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Browse {filteredDogs.length} adoptable dog{filteredDogs.length !== 1 ? 's' : ''} available now
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <DogFilter onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Dog Grid */}
          <div className="lg:col-span-4">
            {filteredDogs.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDogs.map((dog) => (
                  <DogCard key={dog.id} dog={dog} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-border shadow-sm">
                <p className="text-xl text-muted-foreground mb-3">No dogs found</p>
                <p className="text-base text-muted-foreground">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
