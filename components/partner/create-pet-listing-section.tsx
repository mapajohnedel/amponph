'use client'

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, Dog, MapPin, ShieldCheck, Upload, X } from 'lucide-react'
import { breedOptions } from '@/lib/breed-options'
import {
  formatBytes,
  MAX_PET_IMAGE_BYTES,
  MAX_PET_IMAGE_COUNT,
  uploadPetImageToCloudinary,
} from '@/lib/cloudinary/client'
import { createClient } from '@/lib/supabase/client'

type ListingDraft = {
  name: string
  breed: string
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  status: 'draft' | 'published' | 'fostered' | 'archived'
  location: string
  description: string
  vaccinated: boolean
  neutered: boolean
}

type SelectedImage = {
  id: string
  file: File
  previewUrl: string
}

type ExistingImage = {
  id: string
  url: string
  publicId: string | null
}

export type PetListingInitialValues = {
  id: string
  name: string
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  status: 'draft' | 'published' | 'fostered' | 'archived'
  location: string
  description: string
  vaccinated: boolean
  neutered: boolean
  imageUrls: string[]
  imagePublicIds: string[]
}

type CreatePetListingSectionProps = {
  initialLocation?: string
  mode?: 'create' | 'edit'
  petId?: string
  initialValues?: PetListingInitialValues
}

function getInitialBreedState(initialBreed = '') {
  const trimmedBreed = initialBreed.trim()

  if (!trimmedBreed) {
    return {
      breed: '',
      customBreed: '',
    }
  }

  if (breedOptions.some((breedOption) => breedOption === trimmedBreed)) {
    return {
      breed: trimmedBreed,
      customBreed: '',
    }
  }

  return {
    breed: 'Other',
    customBreed: trimmedBreed,
  }
}

function createDraft(initialLocation = '', initialValues?: PetListingInitialValues): ListingDraft {
  const breedState = getInitialBreedState(initialValues?.breed ?? '')

  return {
    name: initialValues?.name ?? '',
    breed: breedState.breed,
    age: initialValues ? String(initialValues.age) : '',
    gender: initialValues?.gender ?? 'male',
    size: initialValues?.size ?? 'medium',
    status: initialValues?.status ?? 'published',
    location: initialValues?.location ?? initialLocation,
    description: initialValues?.description ?? '',
    vaccinated: initialValues?.vaccinated ?? true,
    neutered: initialValues?.neutered ?? false,
  }
}

function createExistingImages(initialValues?: PetListingInitialValues): ExistingImage[] {
  return (initialValues?.imageUrls ?? []).slice(0, MAX_PET_IMAGE_COUNT).map((url, index) => ({
    id: `existing-${index}-${url}`,
    url,
    publicId: initialValues?.imagePublicIds[index] ?? null,
  }))
}

function revokePreviewUrls(images: SelectedImage[]) {
  images.forEach((image) => URL.revokeObjectURL(image.previewUrl))
}

function buildSelectedImages(files: File[]) {
  return files.map((file) => ({
    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }))
}

export function CreatePetListingSection({
  initialLocation = '',
  mode = 'create',
  petId,
  initialValues,
}: CreatePetListingSectionProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [savedInitialValues, setSavedInitialValues] = useState<PetListingInitialValues | undefined>(
    initialValues
  )
  const [draft, setDraft] = useState<ListingDraft>(() => createDraft(initialLocation, initialValues))
  const [customBreed, setCustomBreed] = useState(() => getInitialBreedState(initialValues?.breed).customBreed)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(() =>
    createExistingImages(initialValues)
  )
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hasPreview, setHasPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStateMessage, setSubmitStateMessage] = useState<string | null>(null)
  const selectedImagesRef = useRef<SelectedImage[]>([])
  const isEditMode = mode === 'edit' && Boolean(petId)
  const isOtherBreed = draft.breed === 'Other'
  const resolvedBreed = isOtherBreed ? customBreed.trim() : draft.breed.trim()
  const totalImageCount = existingImages.length + selectedImages.length
  const allPreviewUrls = [
    ...existingImages.map((image) => image.url),
    ...selectedImages.map((image) => image.previewUrl),
  ]
  const primaryPreviewUrl = allPreviewUrls[0] ?? null

  useEffect(() => {
    selectedImagesRef.current = selectedImages
  }, [selectedImages])

  useEffect(() => {
    return () => {
      revokePreviewUrls(selectedImagesRef.current)
    }
  }, [])

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

  const clearSelectedImages = () => {
    revokePreviewUrls(selectedImagesRef.current)
    selectedImagesRef.current = []
    setSelectedImages([])
  }

  const resetForm = () => {
    const breedState = getInitialBreedState(savedInitialValues?.breed)

    setDraft(createDraft(initialLocation, savedInitialValues))
    setCustomBreed(breedState.customBreed)
    setExistingImages(createExistingImages(savedInitialValues))
    setErrorMessage(null)
    setSuccessMessage(null)
    setHasPreview(false)
    setSubmitStateMessage(null)
    clearSelectedImages()
  }

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    )

    event.target.value = ''

    if (files.length === 0) {
      return
    }

    if (totalImageCount + files.length > MAX_PET_IMAGE_COUNT) {
      setErrorMessage(`You can upload up to ${MAX_PET_IMAGE_COUNT} pet images only.`)
      return
    }

    setErrorMessage(null)
    setSelectedImages((current) => [...current, ...buildSelectedImages(files)])
  }

  const removeSelectedImage = (imageId: string) => {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return current.filter((image) => image.id !== imageId)
    })
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages((current) => current.filter((image) => image.id !== imageId))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setHasPreview(false)

    if (!draft.name.trim() || !resolvedBreed || !draft.location.trim()) {
      setErrorMessage('Please complete the pet name, breed, and location.')
      return
    }

    if (totalImageCount === 0) {
      setErrorMessage('Please keep or upload at least one pet image before saving.')
      return
    }

    const parsedAge = Number(draft.age)

    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      setErrorMessage('Please enter a valid age in years.')
      return
    }

    setIsSubmitting(true)
    setSubmitStateMessage(isEditMode ? 'Preparing listing update...' : 'Checking your partner account...')

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(userError?.message ?? 'You must be signed in as a partner to save listings.')
      }

      const uploadedImages: Array<{ url: string; publicId: string }> = []
      const petName = draft.name.trim()

      for (const [index, image] of selectedImages.entries()) {
        setSubmitStateMessage(`Uploading image ${index + 1} of ${selectedImages.length}...`)
        const uploadedImage = await uploadPetImageToCloudinary(image.file)
        uploadedImages.push({
          url: uploadedImage.url,
          publicId: uploadedImage.publicId,
        })
      }

      const finalImages = [
        ...existingImages.map((image) => ({
          url: image.url,
          publicId: image.publicId,
        })),
        ...uploadedImages,
      ]

      if (isEditMode && petId) {
        setSubmitStateMessage('Updating listing...')

        const response = await fetch(`/api/partner/pets/${petId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: petName,
            breed: resolvedBreed,
            age_years: parsedAge,
            gender: draft.gender,
            size: draft.size,
            status: draft.status,
            location: draft.location.trim(),
            description: draft.description.trim() || '',
            image_urls: finalImages.map((image) => image.url),
            image_public_ids: finalImages
              .map((image) => image.publicId)
              .filter((value): value is string => Boolean(value)),
            vaccinated: draft.vaccinated,
            neutered: draft.neutered,
          }),
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload.error ?? 'Unable to update the pet listing.')
        }

        const updatedPet = payload.pet as {
          id: string
          name: string
          breed: string
          age_years: number
          gender: 'male' | 'female'
          size: 'small' | 'medium' | 'large'
          status: 'draft' | 'published' | 'fostered' | 'archived'
          location: string
          description: string
          vaccinated: boolean
          neutered: boolean
          image_urls: string[]
          image_public_ids: string[]
        }

        const nextInitialValues: PetListingInitialValues = {
          id: updatedPet.id,
          name: updatedPet.name,
          breed: updatedPet.breed,
          age: Number(updatedPet.age_years),
          gender: updatedPet.gender,
          size: updatedPet.size,
          status: updatedPet.status,
          location: updatedPet.location,
          description: updatedPet.description ?? '',
          vaccinated: updatedPet.vaccinated,
          neutered: updatedPet.neutered,
          imageUrls: updatedPet.image_urls ?? [],
          imagePublicIds: updatedPet.image_public_ids ?? [],
        }

        clearSelectedImages()
        setExistingImages(createExistingImages(nextInitialValues))
        setSavedInitialValues(nextInitialValues)
        setHasPreview(true)
        setSuccessMessage(
          payload.cleanupWarning
            ? `Listing updated. ${payload.cleanupWarning}`
            : `${petName} was updated successfully.`
        )
        router.refresh()
      } else {
        setSubmitStateMessage('Saving listing to Supabase...')

        const { error } = await supabase.from('pets').insert({
          partner_user_id: user.id,
          name: petName,
          breed: resolvedBreed,
          age_years: parsedAge,
          gender: draft.gender,
          size: draft.size,
          status: draft.status,
          location: draft.location.trim(),
          description: draft.description.trim() || '',
          image_url: finalImages[0]?.url ?? null,
          image_urls: finalImages.map((image) => image.url),
          image_public_ids: finalImages
            .map((image) => image.publicId)
            .filter((value): value is string => Boolean(value)),
          vaccinated: draft.vaccinated,
          neutered: draft.neutered,
          published_at: new Date().toISOString(),
        })

        if (error) {
          throw new Error(error.message)
        }

        setHasPreview(true)
        setSuccessMessage(
          `${petName} is now live with ${finalImages.length} optimized photo${finalImages.length === 1 ? '' : 's'}.`
        )
        setDraft(createDraft(initialLocation))
        setCustomBreed('')
        clearSelectedImages()
        setExistingImages([])
      }
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : 'Something went wrong while saving the pet listing.'
      )
    } finally {
      setIsSubmitting(false)
      setSubmitStateMessage(null)
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Dog className="h-5 w-5 text-primary" />
            {isEditMode ? 'Edit Pet Listing' : 'Create Pet Listing'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {isEditMode
              ? 'Update the pet details, replace photos if needed, and we will clean up removed Cloudinary images after the listing is saved.'
              : 'Add the pet details, choose up to three photos, and we&apos;ll compress each image to about 200 KB before uploading it to Cloudinary and saving the URLs to Supabase.'}
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

            {isEditMode && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      status: event.target.value as ListingDraft['status'],
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="published">Published</option>
                  <option value="fostered">Fostered</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Choose `Fostered` when this pet is no longer available for new adopters.
                </p>
              </div>
            )}
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
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-medium text-foreground">Pet Photos</label>
              <span className="text-xs font-semibold text-[#145da0]">
                {totalImageCount}/{MAX_PET_IMAGE_COUNT} selected
              </span>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-[#d6e8fb] bg-[#f8fbff] px-6 py-8 text-center transition-colors hover:border-primary/40 hover:bg-[#f3f9ff]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">
                {isEditMode ? 'Add replacement or extra photos' : `Upload up to ${MAX_PET_IMAGE_COUNT} images`}
              </p>
              <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                Each image is compressed client-side to about {formatBytes(MAX_PET_IMAGE_BYTES)}
                before it is uploaded to Cloudinary.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
                className="hidden"
                disabled={isSubmitting || totalImageCount >= MAX_PET_IMAGE_COUNT}
              />
            </label>

            {totalImageCount > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {existingImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={image.url}
                        alt={`Current pet photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                        aria-label={`Remove current image ${index + 1}`}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-foreground">Saved image</p>
                      <p className="mt-1 text-xs text-muted-foreground">Already stored in Cloudinary</p>
                    </div>
                  </div>
                ))}

                {selectedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={image.previewUrl}
                        alt={`Selected pet photo ${existingImages.length + index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(image.id)}
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                        aria-label={`Remove new image ${index + 1}`}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-foreground">{image.file.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Original size: {formatBytes(image.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? submitStateMessage || 'Saving Listing...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Save Listing'}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isEditMode ? 'Reset Changes' : 'Clear Form'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-[#edf3fb] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)] p-6 shadow-[0_20px_60px_-36px_rgba(20,44,90,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#145da0]">
              Listing preview
            </p>

            <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-white">
              <div className="relative aspect-[4/3] bg-[linear-gradient(180deg,#fff3e8_0%,#eef7ff_100%)]">
                {primaryPreviewUrl ? (
                  <img
                    src={primaryPreviewUrl}
                    alt="Pet listing preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                      <Camera className="h-8 w-8 text-primary" />
                      <p className="text-sm font-medium">
                        {isEditMode
                          ? 'Keep at least one current image or upload a new one.'
                          : 'Your first uploaded image becomes the cover.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
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

                {allPreviewUrls.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {allPreviewUrls.map((imageUrl, index) => (
                      <img
                        key={`${imageUrl}-${index}`}
                        src={imageUrl}
                        alt={`Preview gallery ${index + 1}`}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-border"
                      />
                    ))}
                  </div>
                )}

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {draft.description.trim() ||
                    'A strong listing description explains the pet’s personality, routine, and the kind of home that would be a good fit.'}
                </p>
              </div>
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
              <li>Up to three compressed photos for a faster Cloudinary-backed gallery</li>
            </ul>
          </div>

          {hasPreview && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                {isEditMode ? 'Listing updated successfully' : 'Listing published successfully'}
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                {isEditMode
                  ? 'Your pet listing details and gallery have been updated. Removed Cloudinary images were scheduled for cleanup after the save.'
                  : 'Your pet listing now has optimized Cloudinary image URLs stored in the `pets` table and is published automatically.'}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
