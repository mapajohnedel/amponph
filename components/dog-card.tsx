'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, MapPin } from 'lucide-react'
import type { Dog } from '@/lib/mock-dogs'

type DogCardProps = {
  dog: Dog
  layout?: 'default' | 'landscape'
}

export function DogCard({ dog, layout = 'default' }: DogCardProps) {
  const isLandscape = layout === 'landscape'

  return (
    <Link href={`/browse/${dog.id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-[2rem] border border-[#edf3fb] bg-white shadow-[0_20px_60px_-36px_rgba(20,44,90,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(20,44,90,0.45)]">
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#fff2e7] to-[#eef7ff] ${
            isLandscape ? 'aspect-[16/9]' : 'h-64 sm:h-72'
          }`}
        >
          <Image
            src={dog.image}
            alt={dog.name}
            fill
            sizes={isLandscape ? '(max-width: 1024px) 100vw, 33vw' : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 shadow-lg backdrop-blur transition-all duration-200 hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Heart size={20} className="text-muted-foreground" />
          </button>

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            {dog.breed}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {dog.name}
            </h3>
            {dog.vaccinated && (
              <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold text-[#145da0]">
                Vaccinated
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {dog.age} {dog.age === 1 ? 'year' : 'years'} old
          </p>

          <div className="flex gap-2 mb-4">
            <span className="rounded-full bg-[#fef1e8] px-3 py-1.5 text-xs font-semibold capitalize text-primary">
              {dog.size}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="flex-shrink-0 text-[#145da0]" />
            <span>{dog.location}</span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#145da0] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-primary">
            Adopt Me
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
