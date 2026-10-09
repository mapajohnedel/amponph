'use client'

import { useState } from 'react'
import { ChevronDown, Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import { dogBreedOptions, catBreedOptions } from '@/lib/breed-options'
import { useRouter, useSearchParams } from 'next/navigation'
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

const sizes = ['small', 'medium', 'large']

export function DogFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [species, setSpecies] = useState<string>(searchParams.get('species') || '')
  const [breed, setBreed] = useState<string>(searchParams.get('breed') || '')
  const [size, setSize] = useState<string>(searchParams.get('size') || '')
  
  // Try to derive province and city from location param if needed, or just use simple local state 
  // since location is stored as a single string "City, Province" or "Province" in the DB.
  // For simplicity, we keep the UI state local but update the URL on apply.
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
    const nextLocation = nextCity || (nextProvinceKey ? getProvinceLabel(nextProvinceKey) : '')
    const params = new URLSearchParams(searchParams.toString())

    // Always reset page to 1 when filters change
    params.delete('page')

    if (nextSpecies) params.set('species', nextSpecies)
    else params.delete('species')

    if (nextBreed) params.set('breed', nextBreed)
    else params.delete('breed')

    if (nextSize) params.set('size', nextSize)
    else params.delete('size')

    if (nextLocation) params.set('location', nextLocation)
    else params.delete('location')

    router.push(`?${params.toString()}`)
  }

  const handleReset = () => {
    setSpecies('')
    setBreed('')
    setSize('')
    setSelectedProvinceKey('')
    setCity('')
    router.push('?')
  }

  return (
    <div className="rounded-[1.5rem] border border-white/70 dark:border-white/10 bg-white/85 dark:bg-card/85 p-4 shadow-[0_18px_45px_-28px_rgba(20,44,90,0.28)] backdrop-blur">
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
                    : 'border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 text-foreground hover:bg-[#f7fbff] dark:hover:bg-muted/60'
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
                    : 'border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 text-foreground hover:bg-[#f7fbff] dark:hover:bg-muted/60'
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
                    : 'border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 text-foreground hover:bg-[#f7fbff] dark:hover:bg-muted/60'
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
                className="w-full appearance-none rounded-xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-3 py-2.5 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
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
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0] dark:text-sky-300" />
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
                    : 'border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 text-foreground hover:bg-[#f7fbff] dark:hover:bg-muted/60'
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
                      : 'border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 text-foreground hover:bg-[#f7fbff] dark:hover:bg-muted/60'
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
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0] dark:text-sky-300" />
                <select
                  value={selectedProvinceKey}
                  onChange={(e) => {
                    const nextProvinceKey = e.target.value
                    setSelectedProvinceKey(nextProvinceKey)
                    setCity('')
                    applyFilters({ provinceKey: nextProvinceKey, city: '' })
                  }}
                  className="w-full appearance-none rounded-xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 py-2.5 pl-9 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="">All provinces or regions</option>
                  {philippineProvinceOptions.map((province) => (
                    <option key={province.key} value={province.key}>
                      {province.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0] dark:text-sky-300" />
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
                  className="w-full appearance-none rounded-xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-3 py-2.5 pr-10 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
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
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#145da0] dark:text-sky-300" />
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
