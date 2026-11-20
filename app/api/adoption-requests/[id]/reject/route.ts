import { NextResponse } from 'next/server'
import { errorResponse, internalErrorResponse } from '@/lib/api/errors'
import { isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

type RejectPayload = {
  reviewNote?: string
}

const MAX_REVIEW_NOTE_LENGTH = 1000

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = (await request.json().catch(() => ({}))) as RejectPayload
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'You must be signed in to review requests.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can review requests.' }, { status: 403 })
    }

    const { data: requestRow, error: requestError } = await supabase
      .from('adoption_requests')
      .select('id, status')
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .maybeSingle()

    if (requestError) {
      return internalErrorResponse(requestError, 'Unable to load this adoption request.')
    }

    if (!requestRow) {
      return NextResponse.json({ error: 'Adoption request not found.' }, { status: 404 })
    }

    if (requestRow.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending adoption requests can be rejected.' },
        { status: 409 }
      )
    }

    const reviewNote = isNonEmptyString(payload.reviewNote)
      ? payload.reviewNote.trim().slice(0, MAX_REVIEW_NOTE_LENGTH)
      : null

    const { data: updatedRows, error: updateError } = await supabase
      .from('adoption_requests')
      .update({
        status: 'rejected',
        review_note: reviewNote,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('partner_user_id', user.id)
      .eq('status', 'pending')
      .select('id')

    if (updateError) {
      return internalErrorResponse(updateError, 'Unable to reject adoption request.')
    }

    if (!updatedRows || updatedRows.length === 0) {
      return NextResponse.json(
        { error: 'Only pending adoption requests can be rejected.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: true, message: 'Adoption request rejected.' })
  } catch (caughtError) {
    return errorResponse(caughtError, 'Unable to reject adoption request.')
  }
}
