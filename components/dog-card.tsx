'use client'

import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import type { Dog } from '@/lib/mock-dogs'

type DogCardProps = {
  dog: Dog
  layout?: 'default' | 'landscape'
}

export function DogCard({ dog, layout = 'default' }: DogCardProps) {
  const isLandscape = layout === 'landscape'

  return (
    <Link href={`/browse/${dog.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-border/50">
        {/* Image Container - Larger */}
        <div
          className={`relative overflow-hidden bg-muted ${
            isLandscape ? 'aspect-[16/9]' : 'h-64 sm:h-72'
          }`}
        >
          <img
            src={dog.image}
            alt={dog.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-lg hover:bg-muted transition-all duration-200"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Heart size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content - Better Spacing */}
        <div className="p-6">
          {/* Name and Badge */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {dog.name}
            </h3>
            {dog.vaccinated && (
              <span className="text-xs font-semibold bg-secondary/15 text-secondary-foreground px-3 py-1.5 rounded-full">
                Vaccinated
              </span>
            )}
          </div>

          {/* Breed and Age */}
          <p className="text-sm text-muted-foreground mb-3">
            {dog.breed} • {dog.age} {dog.age === 1 ? 'year' : 'years'}
          </p>

          {/* Size Badge */}
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-semibold bg-muted text-foreground px-3 py-1.5 rounded-full capitalize">
              {dog.size}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="flex-shrink-0" />
            <span>{dog.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
