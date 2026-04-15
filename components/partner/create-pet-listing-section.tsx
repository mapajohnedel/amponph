'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { Camera, CheckCircle2, Dog, MapPin, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const breedOptions = [
  'Aspin',
  'Aspin Mix',
  'Mixed Breed',
  'Labrador Retriever',
  'Labrador Mix',
  'Golden Retriever',
  'Golden Retriever Mix',
  'German Shepherd',
  'German Shepherd Mix',
  'Shih Tzu',
  'Pomeranian',
  'Chihuahua',
  'Beagle',
  'Siberian Husky',
  'Husky Mix',
  'Poodle',
  'Poodle Mix',
  'Dachshund',
  'Corgi',
  'Rottweiler',
  'Border Collie',
  'Jack Russell Terrier',
  'Belgian Malinois',
  'Boxer',
  'Doberman',
  'Other',
] as const

type ListingDraft = {
  name: string
  breed: string
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  location: string
  description: string
  imageUrl: string
  vaccinated: boolean
  neutered: boolean
}

type CreatePetListingSectionProps = {
  initialLocation?: string
}

function createDefaultDraft(initialLocation = ''): ListingDraft {
  return {
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    location: initialLocation,
    description: '',
    imageUrl: '',
    vaccinated: true,
    neutered: false,
  }
}

export function CreatePetListingSection({
  initialLocation = '',
}: CreatePetListingSectionProps) {
  const supabase = useMemo(() => createClient(), [])
  const [draft, setDraft] = useState<ListingDraft>(() => createDefaultDraft(initialLocation))
  const [customBreed, setCustomBreed] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasPreview, setHasPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isOtherBreed = draft.breed === 'Other'
  const resolvedBreed = isOtherBreed ? customBreed.trim() : draft.breed.trim()

  const previewAge = useMemo(() => {
    if (!draft.age) {
      return 'Set an age'
    }

    const parsedAge = Number(draft.age)

    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      return 'Enter a valid age'
    }

    return `${parsedAge} ${parsedAge === 1 ? 'year' : 'years'} old`
  }, [draft.age])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setHasPreview(false)

    if (!draft.name.trim() || !resolvedBreed || !draft.location.trim()) {
      setErrorMessage('Please complete the pet name, breed, and location.')
      return
    }

    const parsedAge = Number(draft.age)

    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      setErrorMessage('Please enter a valid age in years.')
      return
    }

    setIsSubmitting(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setErrorMessage(userError?.message ?? 'You must be signed in as a partner to save listings.')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from('pets').insert({
      partner_user_id: user.id,
      name: draft.name.trim(),
      breed: resolvedBreed,
      age_years: parsedAge,
      gender: draft.gender,
      size: draft.size,
      location: draft.location.trim(),
      description: draft.description.trim() || '',
      image_url: draft.imageUrl.trim() || null,
      vaccinated: draft.vaccinated,
      neutered: draft.neutered,
      status: 'published',
      published_at: new Date().toISOString(),
    })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setHasPreview(true)
    setSuccessMessage(`${draft.name.trim()} is now live and available in your published pet listings.`)
    setDraft(createDefaultDraft(initialLocation))
    setCustomBreed('')
    setIsSubmitting(false)
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Dog className="h-5 w-5 text-primary" />
            Create Pet Listing
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Start with the most important details adopters look for: name, breed, age, size,
            location, health status, and a clear story about the pet&apos;s personality.
          </p>
        </div>
        <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold text-[#145da0]">
          Partner tool
        </span>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Pet Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Luna"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Breed</label>
              <select
                value={draft.breed}
                onChange={(event) => setDraft((current) => ({ ...current, breed: event.target.value }))}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              >
                <option value="">Select a breed</option>
                {breedOptions.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
              {isOtherBreed && (
                <input
                  type="text"
                  value={customBreed}
                  onChange={(event) => setCustomBreed(event.target.value)}
                  placeholder="Enter the breed"
                  className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Age</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={draft.age}
                onChange={(event) => setDraft((current) => ({ ...current, age: event.target.value }))}
                placeholder="2"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                value={draft.location}
                onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
                placeholder="Quezon City, Metro Manila"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                required
              />
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Prefilled from your partner profile. You can adjust it for this listing if needed.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Gender</label>
              <select
                value={draft.gender}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    gender: event.target.value as ListingDraft['gender'],
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Size</label>
              <select
                value={draft.size}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    size: event.target.value as ListingDraft['size'],
                  }))
                }
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Description</label>
            <textarea
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Share the pet's personality, energy level, ideal home, and any rescue background that helps adopters connect."
              rows={6}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Cover Image URL</label>
            <div className="relative">
              <Camera className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={draft.imageUrl}
                onChange={(event) => setDraft((current) => ({ ...current, imageUrl: event.target.value }))}
                placeholder="https://example.com/pet-photo.jpg"
                className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Use a direct image URL ending in something like `.jpg`, `.jpeg`, `.png`, or `.webp`.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
              <input
                type="checkbox"
                checked={draft.vaccinated}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, vaccinated: event.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-foreground">Vaccinated</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
              <input
                type="checkbox"
                checked={draft.neutered}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, neutered: event.target.checked }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-foreground">Neutered / Spayed</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
            >
              {isSubmitting ? 'Saving Listing...' : 'Save Listing'}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setDraft(createDefaultDraft(initialLocation))
                setCustomBreed('')
                setErrorMessage(null)
                setSuccessMessage(null)
                setHasPreview(false)
              }}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Clear Form
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#edf3fb] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)] p-6 shadow-[0_20px_60px_-36px_rgba(20,44,90,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#145da0]">
              Listing preview
            </p>

            <div className="mt-5 rounded-3xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {draft.name.trim() || 'Pet name'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{resolvedBreed || 'Breed'}</p>
                </div>
                {draft.vaccinated && (
                  <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold text-[#145da0]">
                    Vaccinated
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fef1e8] px-3 py-1.5 text-xs font-semibold text-primary">
                  {previewAge}
                </span>
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                  {draft.gender}
                </span>
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                  {draft.size}
                </span>
                {draft.neutered && (
                  <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                    Neutered / Spayed
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[#145da0]" />
                <span>{draft.location.trim() || 'Set a city or area'}</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {draft.description.trim() ||
                  'A strong listing description explains the pet’s personality, routine, and the kind of home that would be a good fit.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background/40 p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Suggested fields
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Name, breed, and age for fast scanning</li>
              <li>Gender, size, and location for browse filters</li>
              <li>Vaccination and neuter status for trust and screening</li>
              <li>Description with temperament, rescue history, and ideal home</li>
              <li>Cover photo and gallery upload when media storage is added</li>
            </ul>
          </div>

          {hasPreview && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                Listing published successfully
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Your pet listing now has a real row in the `pets` table and is stored with
                `published` status.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
