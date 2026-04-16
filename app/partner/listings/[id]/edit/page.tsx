import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import {
  CreatePetListingSection,
  type PetListingInitialValues,
} from '@/components/partner/create-pet-listing-section'
import { getAuthenticatedHome, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export default async function EditPartnerListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  if (!isPartnerUser(user)) {
    redirect(getAuthenticatedHome(user))
  }

  const { data: profile } = await supabase
    .from('partner_profiles')
    .select('city, province_or_region')
    .eq('user_id', user.id)
    .single()

  const { data: pet, error: petError } = await supabase
    .from('pets')
    .select(
      'id, name, breed, age_years, gender, size, status, location, description, vaccinated, neutered, image_urls, image_public_ids'
    )
    .eq('id', id)
    .eq('partner_user_id', user.id)
    .maybeSingle()

  if (petError) {
    throw new Error(petError.message)
  }

  if (!pet) {
    notFound()
  }

  const initialLocation = [profile?.city, profile?.province_or_region]
    .filter(Boolean)
    .join(', ')

  const initialValues: PetListingInitialValues = {
    id: pet.id,
    name: pet.name,
    breed: pet.breed,
    age: Number(pet.age_years),
    gender: pet.gender,
    size: pet.size,
    status: pet.status,
    location: pet.location,
    description: pet.description ?? '',
    vaccinated: pet.vaccinated,
    neutered: pet.neutered,
    imageUrls: pet.image_urls ?? [],
    imagePublicIds: pet.image_public_ids ?? [],
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <Link
          href="/partner/listings"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my pet listings
        </Link>

        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            Partner listings
          </span>
          <h1 className="mt-6 flex items-center gap-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <PencilLine className="h-8 w-8 text-primary" />
            Edit pet listing
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Update the details for this adoptable pet and replace any photos that need refreshing.
          </p>
        </div>

        <CreatePetListingSection
          initialLocation={initialLocation}
          mode="edit"
          petId={pet.id}
          initialValues={initialValues}
        />
      </div>
    </div>
  )
}
