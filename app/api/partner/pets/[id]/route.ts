import { NextResponse } from 'next/server'
import { isPartnerUser } from '@/lib/auth/roles'
import { deleteCloudinaryImages, extractCloudinaryPublicId } from '@/lib/cloudinary/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const MAX_PET_IMAGE_COUNT = 3

type PetUpdatePayload = {
  name?: string
  breed?: string
  age_years?: number
  gender?: 'male' | 'female'
  size?: 'small' | 'medium' | 'large'
  location?: string
  description?: string
  vaccinated?: boolean
  neutered?: boolean
  image_urls?: string[]
  image_public_ids?: string[]
  status?: 'draft' | 'published' | 'fostered' | 'archived'
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizePublicIds(imageUrls: string[], imagePublicIds: string[]) {
  return Array.from(
    new Set([
      ...imagePublicIds.filter(isNonEmptyString),
      ...imageUrls
        .map((url: string) => extractCloudinaryPublicId(url))
        .filter((value: unknown): value is string => Boolean(value)),
    ])
  )
}

async function getOwnedPet(supabase: Awaited<ReturnType<typeof createClient>>, id: string, userId: string) {
  return supabase
    .from('pets')
    .select(
      'id, partner_user_id, image_url, image_urls, image_public_ids, name, breed, age_years, gender, size, location, description, vaccinated, neutered, status, published_at, created_at'
    )
    .eq('id', id)
    .eq('partner_user_id', userId)
    .maybeSingle()
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = (await request.json()) as PetUpdatePayload
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to update a pet listing.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can update pet listings.' }, { status: 403 })
    }

    const { data: pet, error: petError } = await getOwnedPet(supabase, id, user.id)

    if (petError) {
      return NextResponse.json({ error: petError.message }, { status: 500 })
    }

    if (!pet) {
      return NextResponse.json({ error: 'Pet listing not found.' }, { status: 404 })
    }

    const imageUrls = Array.isArray(payload.image_urls)
      ? payload.image_urls.filter(isNonEmptyString)
      : []
    const requestedPublicIds = Array.isArray(payload.image_public_ids)
      ? payload.image_public_ids.filter(isNonEmptyString)
      : []

    if (!isNonEmptyString(payload.name) || !isNonEmptyString(payload.breed) || !isNonEmptyString(payload.location)) {
      return NextResponse.json(
        { error: 'Name, breed, and location are required.' },
        { status: 400 }
      )
    }

    if (typeof payload.age_years !== 'number' || Number.isNaN(payload.age_years) || payload.age_years <= 0) {
      return NextResponse.json({ error: 'Age must be a valid positive number.' }, { status: 400 })
    }

    if (!['male', 'female'].includes(payload.gender ?? '')) {
      return NextResponse.json({ error: 'Gender must be either male or female.' }, { status: 400 })
    }

    if (!['small', 'medium', 'large'].includes(payload.size ?? '')) {
      return NextResponse.json({ error: 'Size must be small, medium, or large.' }, { status: 400 })
    }

    if (!['draft', 'published', 'fostered', 'archived'].includes(payload.status ?? '')) {
      return NextResponse.json(
        { error: 'Status must be draft, published, fostered, or archived.' },
        { status: 400 }
      )
    }

    if (imageUrls.length === 0 || imageUrls.length > MAX_PET_IMAGE_COUNT) {
      return NextResponse.json(
        { error: `Please keep between 1 and ${MAX_PET_IMAGE_COUNT} pet images.` },
        { status: 400 }
      )
    }

    const normalizedPublicIds = normalizePublicIds(imageUrls, requestedPublicIds)

    if (normalizedPublicIds.length > MAX_PET_IMAGE_COUNT) {
      return NextResponse.json(
        { error: `Only ${MAX_PET_IMAGE_COUNT} Cloudinary image references can be stored.` },
        { status: 400 }
      )
    }

    const previousPublicIds = normalizePublicIds(
      (pet.image_urls ?? []).filter(isNonEmptyString),
      (pet.image_public_ids ?? []).filter(isNonEmptyString)
    )

    const removedPublicIds = previousPublicIds.filter(
      (publicId) => !normalizedPublicIds.includes(publicId)
    )

    const { data: updatedPet, error: updateError } = await supabase
      .from('pets')
      .update({
        name: payload.name.trim(),
        breed: payload.breed.trim(),
        age_years: payload.age_years,
        gender: payload.gender,
        size: payload.size,
        location: payload.location.trim(),
        description: payload.description?.trim() ?? '',
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        image_public_ids: normalizedPublicIds,
        vaccinated: Boolean(payload.vaccinated),
        neutered: Boolean(payload.neutered),
        status: payload.status ?? 'published',
      })
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .select(
        'id, partner_user_id, image_url, image_urls, image_public_ids, name, breed, age_years, gender, size, location, description, vaccinated, neutered, status, published_at, created_at'
      )
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    let cleanupWarning: string | null = null

    if (removedPublicIds.length > 0) {
      try {
        await deleteCloudinaryImages(removedPublicIds)
      } catch (caughtError) {
        cleanupWarning =
          caughtError instanceof Error
            ? caughtError.message
            : 'The listing was updated, but some old Cloudinary images could not be deleted.'
      }
    }

    return NextResponse.json({
      success: true,
      cleanupWarning,
      pet: updatedPet,
    })
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : 'Unable to update the pet listing.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to delete a pet listing.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can delete pet listings.' }, { status: 403 })
    }

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('id, partner_user_id, image_urls, image_public_ids')
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .maybeSingle()

    if (petError) {
      return NextResponse.json({ error: petError.message }, { status: 500 })
    }

    if (!pet) {
      return NextResponse.json({ error: 'Pet listing not found.' }, { status: 404 })
    }

    const storedPublicIds = (pet.image_public_ids ?? []).filter(Boolean)
    const fallbackPublicIds = (pet.image_urls ?? [])
      .map((url: string) => extractCloudinaryPublicId(url))
      .filter((value: unknown): value is string => Boolean(value))

    await deleteCloudinaryImages([...storedPublicIds, ...fallbackPublicIds])

    const { error: deleteError } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('partner_user_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : 'Unable to delete the pet listing.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
