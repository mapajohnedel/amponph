import { NextResponse } from 'next/server'
import { errorResponse, internalErrorResponse } from '@/lib/api/errors'
import { isAdminUser, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

type AdoptionRequestPayload = {
  petId?: string
  message?: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AdoptionRequestPayload
    const petId = payload.petId?.trim()

    if (!petId) {
      return NextResponse.json({ error: 'Pet ID is required.' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to request adoption.' }, { status: 401 })
    }

    if (isAdminUser(user) || isPartnerUser(user)) {
      return NextResponse.json(
        { error: 'Only adopter accounts can submit adoption requests.' },
        { status: 403 }
      )
    }

    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('id, name, status, partner_user_id')
      .eq('id', petId)
      .eq('status', 'published')
      .maybeSingle()

    if (petError) {
      return internalErrorResponse(petError, 'Unable to load this pet.')
    }

    if (!pet) {
      return NextResponse.json({ error: 'Pet listing not found.' }, { status: 404 })
    }

    if (pet.partner_user_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot request adoption for your own pet listing.' },
        { status: 400 }
      )
    }

    const { data: existingRequest, error: existingError } = await supabase
      .from('adoption_requests')
      .select('id')
      .eq('pet_id', pet.id)
      .eq('requester_user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (existingError) {
      return internalErrorResponse(existingError, 'Unable to check your existing requests.')
    }

    if (existingRequest) {
      return NextResponse.json(
        { error: `You already have a pending request for ${pet.name}.` },
        { status: 409 }
      )
    }

    const message = isNonEmptyString(payload.message) ? payload.message.trim() : null

    const { data: createdRequest, error: insertError } = await supabase
      .from('adoption_requests')
      .insert({
        pet_id: pet.id,
        partner_user_id: pet.partner_user_id,
        requester_user_id: user.id,
        requester_name: user.user_metadata?.full_name ?? null,
        requester_email: user.email ?? null,
        message,
      })
      .select('id, status, created_at')
      .single()

    if (insertError) {
      return internalErrorResponse(insertError, 'Unable to submit adoption request.')
    }

    return NextResponse.json({
      success: true,
      message: `Adoption request for ${pet.name} submitted.`,
      request: createdRequest,
    })
  } catch (caughtError) {
    return errorResponse(caughtError, 'Unable to submit adoption request.')
  }
}
