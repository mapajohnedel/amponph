import 'server-only'

import type { Dog } from '@/lib/mock-dogs'
import { createClient } from '@/lib/supabase/server'

type PetRow = {
  id: string
  partner_user_id: string
  name: string
  breed: string
  age_years: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  location: string
  description: string
  image_url: string | null
  image_urls: string[] | null
  vaccinated: boolean
  neutered: boolean
  status: 'draft' | 'published' | 'fostered' | 'archived'
}

type PartnerProfileSummary = {
  user_id: string
  organization_name: string
  email: string
  phone: string
}

function createPetPlaceholder(label: string, accent: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg)" />
      <circle cx="400" cy="310" r="140" fill="#ffffff" fill-opacity="0.92" />
      <path d="M275 235c-34-48-9-111 55-124-7 69 36 128 70 150-51 4-92-1-125-26Z" fill="#ffffff" fill-opacity="0.88" />
      <path d="M525 235c34-48 9-111-55-124 7 69-36 128-70 150 51 4 92-1 125-26Z" fill="#ffffff" fill-opacity="0.88" />
      <circle cx="350" cy="305" r="14" fill="#1f2937" />
      <circle cx="450" cy="305" r="14" fill="#1f2937" />
      <ellipse cx="400" cy="360" rx="34" ry="24" fill="#1f2937" />
      <path d="M360 394c20 18 59 18 79 0" fill="none" stroke="#1f2937" stroke-width="14" stroke-linecap="round" />
      <text x="400" y="610" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#0f172a">${label}</text>
      <text x="400" y="668" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#334155">AmponPH listing</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createFallbackImage(name: string) {
  const trimmedName = name.trim() || 'Rescue pet'
  return createPetPlaceholder(trimmedName, '#fed7aa')
}

function mapPetToDog(
  pet: PetRow,
  profile: PartnerProfileSummary | undefined
): Dog {
  const galleryImages = (pet.image_urls ?? []).filter(Boolean)
  const image = galleryImages[0] || pet.image_url || createFallbackImage(pet.name)

  return {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    age: Number(pet.age_years),
    gender: pet.gender,
    size: pet.size,
    location: pet.location,
    image,
    images: galleryImages.length > 0 ? galleryImages : [image],
    description: pet.description || '',
    vaccinated: pet.vaccinated,
    neutered: pet.neutered,
    shelterName: profile?.organization_name || 'Partner organization',
    shelterEmail: profile?.email || 'No contact email available',
    shelterPhone: profile?.phone || undefined,
  }
}

export async function listPublishedPets() {
  const supabase = await createClient()
  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select(
      'id, partner_user_id, name, breed, age_years, gender, size, location, description, image_url, image_urls, vaccinated, neutered, status'
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (petsError) {
    throw new Error(petsError.message)
  }

  const petRows = (pets ?? []) as PetRow[]
  const partnerIds = Array.from(new Set(petRows.map((pet) => pet.partner_user_id)))

  let partnerProfiles: PartnerProfileSummary[] = []

  if (partnerIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase.rpc(
      'get_public_partner_profiles',
      {
        partner_ids: partnerIds,
      }
    )

    if (profilesError) {
      throw new Error(profilesError.message)
    }

    partnerProfiles = (profiles ?? []) as PartnerProfileSummary[]
  }

  const profileByUserId = new Map(
    partnerProfiles.map((profile) => [profile.user_id, profile])
  )

  return petRows.map((pet) => mapPetToDog(pet, profileByUserId.get(pet.partner_user_id)))
}
