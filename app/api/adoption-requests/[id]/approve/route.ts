import { NextResponse } from 'next/server'
import { isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export async function POST(
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
      return NextResponse.json({ error: 'You must be signed in to review requests.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can review requests.' }, { status: 403 })
    }

    const { error: approveError } = await supabase.rpc('approve_adoption_request', {
      request_id: id,
    })

    if (approveError) {
      if (approveError.code === 'P0002' || approveError.code === '22P02') {
        return NextResponse.json({ error: 'Adoption request not found.' }, { status: 404 })
      }

      if (approveError.code === 'AR409' || approveError.code === 'AR410') {
        return NextResponse.json({ error: approveError.message }, { status: 409 })
      }

      return NextResponse.json({ error: approveError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Adoption request approved.' })
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : 'Unable to approve adoption request.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
