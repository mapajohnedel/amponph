import { NextResponse } from 'next/server'
import { errorResponse, internalErrorResponse } from '@/lib/api/errors'
import { isAdminUser, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

type FavoritePayload = {
  petId?: string
  petName?: string
  petImage?: string | null
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as FavoritePayload
    const petId = payload.petId?.trim()
    const petName = payload.petName?.trim()

    if (!petId || !petName) {
      return NextResponse.json({ error: 'Pet ID and pet name are required.' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to add favorites.' }, { status: 401 })
    }

    if (isAdminUser(user) || isPartnerUser(user)) {
      return NextResponse.json(
        { error: 'Only adopter accounts can save favorites.' },
        { status: 403 }
      )
    }

    const petImageSnapshot =
      typeof payload.petImage === 'string' && payload.petImage.trim().length > 0
        ? payload.petImage.trim()
        : null

    const { error: insertError } = await supabase.from('favorite_pets').upsert(
      {
        user_id: user.id,
        pet_id: petId,
        pet_name_snapshot: petName,
        pet_image_snapshot: petImageSnapshot,
      },
      { onConflict: 'user_id,pet_id' }
    )

    if (insertError) {
      return internalErrorResponse(insertError, 'Unable to save favorite.')
    }

    return NextResponse.json({ success: true })
  } catch (caughtError) {
    return errorResponse(caughtError, 'Unable to save favorite.')
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = (await request.json()) as FavoritePayload
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
      return NextResponse.json(
        { error: 'You must be signed in to remove favorites.' },
        { status: 401 }
      )
    }

    const { error: deleteError } = await supabase
      .from('favorite_pets')
      .delete()
      .eq('user_id', user.id)
      .eq('pet_id', petId)

    if (deleteError) {
      return internalErrorResponse(deleteError, 'Unable to remove favorite.')
    }

    return NextResponse.json({ success: true })
  } catch (caughtError) {
    return errorResponse(caughtError, 'Unable to remove favorite.')
  }
}
