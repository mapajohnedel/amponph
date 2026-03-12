'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'

export interface FilterOptions {
  breed?: string
  minAge?: number
  maxAge?: number
  size?: string
  location?: string
}

interface DogFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

const breeds = [
  'Golden Retriever',
  'Husky',
  'Labrador Mix',
  'German Shepherd',
  'Corgi',
  'Dachshund',
  'Boxer',
  'Beagle',
  'Poodle Mix',
]

const sizes = ['small', 'medium', 'large']

export function DogFilter({ onFilterChange }: DogFilterProps) {
  const [breed, setBreed] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  const applyFilters = (nextValues?: {
    breed?: string
    size?: string
    location?: string
  }) => {
    const nextBreed = nextValues?.breed ?? breed
    const nextSize = nextValues?.size ?? size
    const nextLocation = nextValues?.location ?? location
    const filters: FilterOptions = {}

    if (nextBreed) filters.breed = nextBreed
    if (nextSize) filters.size = nextSize
    if (nextLocation) filters.location = nextLocation

    onFilterChange(filters)
  }

  const handleReset = () => {
    setBreed('')
    setSize('')
    setLocation('')
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <button
        className="md:hidden flex items-center gap-2 font-semibold mb-6 text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Filter size={20} />
        Filters
      </button>

      {(isExpanded || !('ontouchstart' in window)) && (
        <>
          {/* Breed Filter */}
          <div className="mb-8">
            <label className="text-sm font-bold text-foreground block mb-3">
              Breed
            </label>
            <select
              value={breed}
              onChange={(e) => {
                const nextBreed = e.target.value
                setBreed(nextBreed)
                applyFilters({ breed: nextBreed })
              }}
              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              <option value="">All Breeds</option>
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="mb-8">
            <label className="text-sm font-bold text-foreground block mb-4">
              Size
            </label>
            <div className="space-y-3">
              {sizes.map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={(e) => {
                      const nextSize = e.target.value
                      setSize(nextSize)
                      applyFilters({ size: nextSize })
                    }}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground capitalize group-hover:text-primary transition-colors">{s}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="size"
                  value=""
                  checked={size === ''}
                  onChange={(e) => {
                    const nextSize = e.target.value
                    setSize(nextSize)
                    applyFilters({ size: nextSize })
                  }}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">All Sizes</span>
              </label>
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-8">
            <label className="text-sm font-bold text-foreground block mb-3">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                const nextLocation = e.target.value
                setLocation(nextLocation)
                applyFilters({ location: nextLocation })
              }}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 transition-all duration-200"
          >
            Reset Filters
          </button>
        </>
      )}
    </div>
  )
}
