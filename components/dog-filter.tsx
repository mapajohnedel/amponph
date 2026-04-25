'use client'

import { useState } from 'react'
import { ChevronDown, Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import { dogBreedOptions, catBreedOptions } from '@/lib/breed-options'
import {
  getCityOptionsByProvince,
  getProvinceLabel,
  philippineProvinceOptions,
} from '@/lib/philippines-locations'

export interface FilterOptions {
  species?: string
  breed?: string
  minAge?: number
  maxAge?: number
  size?: string
  location?: string
}

interface DogFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

const sizes = ['small', 'medium', 'large']

export function DogFilter({ onFilterChange }: DogFilterProps) {
  const [species, setSpecies] = useState<string>('')
  const [breed, setBreed] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [selectedProvinceKey, setSelectedProvinceKey] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  const applyFilters = (nextValues?: {
    species?: string
    breed?: string
    size?: string
    provinceKey?: string
    city?: string
  }) => {
    const nextSpecies = nextValues?.species ?? species
    const nextBreed = nextValues?.breed ?? breed
    const nextSize = nextValues?.size ?? size
    const nextProvinceKey = nextValues?.provinceKey ?? selectedProvinceKey
    const nextCity = nextValues?.city ?? city
    const filters: FilterOptions = {}
    const nextLocation =
      nextCity || (nextProvinceKey ? getProvinceLabel(nextProvinceKey) : '')

    if (nextSpecies) filters.species = nextSpecies
    if (nextBreed) filters.breed = nextBreed
    if (nextSize) filters.size = nextSize
    if (nextLocation) filters.location = nextLocation

    onFilterChange(filters)
  }

  const handleReset = () => {
    setSpecies('')
    setBreed('')
    setSize('')
    setSelectedProvinceKey('')
    setCity('')
    onFilterChange({})
  }

  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_45px_-28px_rgba(20,44,90,0.28)] backdrop-blur">
      <div className="mb-4 hidden items-center gap-3 md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
          <SlidersHorizontal size={16} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Filter Pets</h2>
          <p className="text-xs text-muted-foreground">Quick, compact filters.</p>
        </div>
      </div>

      <button
        className="mb-4 flex items-center gap-2 font-semibold text-foreground md:hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Filter size={18} />
        Filters
      </button>

      {(isExpanded || !('ontouchstart' in window)) && (
        <>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              Species
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSpecies('')
                  setBreed('') // reset breed when species changes
                  applyFilters({ species: '', breed: '' })
                }}
                className={`rounded-xl px-2 py-2 text-sm font-medium transition-all ${
                  species === ''
                    ? 'bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(249,115,22,0.85)]'
                    : 'border border-[#dce9f8] bg-[#fcfdff] text-foreground hover:bg-[#f7fbff]'
                }`}
              >
                All Pets
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecies('dog')
                  setBreed('')
                  applyFilters({ species: 'dog', breed: '' })
                }}
                className={`rounded-xl px-2 py-2 text-sm font-medium transition-all ${
                  species === 'dog'
                    ? 'bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(249,115,22,0.85)]'
                    : 'border border-[#dce9f8] bg-[#fcfdff] text-foreground hover:bg-[#f7fbff]'
                }`}
              >
                Dogs
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecies('cat')
                  setBreed('')
                  applyFilters({ species: 'cat', breed: '' })
                }}
                className={`rounded-xl px-2 py-2 text-sm font-medium transition-all ${
                  species === 'cat'
                    ? 'bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(249,115,22,0.85)]'
                    : 'border border-[#dce9f8] bg-[#fcfdff] text-foreground hover:bg-[#f7fbff]'
                }`}
              >
                Cats
              </button>
            </div>
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              Breed
            </label>
            <div className="relative">
              <select
                value={breed}
                onChange={(e) => {
                  const nextBreed = e.target.value
                  setBreed(nextBreed)
                  applyFilters({ breed: nextBreed })
                }}
                className="w-full appearance-none rounded-xl border border-[#dce9f8] bg-[#fcfdff] px-3 py-2.5 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="">All breeds</option>
                {(species === 'cat'
                  ? catBreedOptions.filter((b) => b !== 'Other')
                  : species === 'dog'
                    ? dogBreedOptions.filter((b) => b !== 'Other')
                    : Array.from(new Set([...dogBreedOptions, ...catBreedOptions])).filter(
                        (b) => b !== 'Other'
                      )
                ).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0]" />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSize('')
                  applyFilters({ size: '' })
                }}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  size === ''
                    ? 'bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(249,115,22,0.85)]'
                    : 'border border-[#dce9f8] bg-[#fcfdff] text-foreground hover:bg-[#f7fbff]'
                }`}
              >
                All Sizes
              </button>
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s)
                    applyFilters({ size: s })
                  }}
                  className={`rounded-xl px-3 py-2 text-sm font-medium capitalize transition-all ${
                    size === s
                      ? 'bg-primary text-primary-foreground shadow-[0_12px_26px_-18px_rgba(249,115,22,0.85)]'
                      : 'border border-[#dce9f8] bg-[#fcfdff] text-foreground hover:bg-[#f7fbff]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              Location
            </label>
            <div className="space-y-3">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0]" />
                <select
                  value={selectedProvinceKey}
                  onChange={(e) => {
                    const nextProvinceKey = e.target.value
                    setSelectedProvinceKey(nextProvinceKey)
                    setCity('')
                    applyFilters({ provinceKey: nextProvinceKey, city: '' })
                  }}
                  className="w-full appearance-none rounded-xl border border-[#dce9f8] bg-[#fcfdff] py-2.5 pl-9 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="">All provinces or regions</option>
                  {philippineProvinceOptions.map((province) => (
                    <option key={province.key} value={province.key}>
                      {province.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0]" />
              </div>

              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => {
                    const nextCity = e.target.value
                    setCity(nextCity)
                    applyFilters({ city: nextCity })
                  }}
                  disabled={!selectedProvinceKey}
                  className="w-full appearance-none rounded-xl border border-[#dce9f8] bg-[#fcfdff] px-3 py-2.5 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {selectedProvinceKey ? 'All cities' : 'Select a province first'}
                  </option>
                  {getCityOptionsByProvince(selectedProvinceKey).map((locationOption) => (
                    <option key={locationOption.value} value={locationOption.value}>
                      {locationOption.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0]" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-full border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/5"
          >
            Reset Filters
          </button>
        </>
      )}
    </div>
  )
}
