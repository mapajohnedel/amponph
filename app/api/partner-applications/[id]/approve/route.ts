import { NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/auth/roles'
import { partnerApplicationReviewSchema } from '@/lib/partner/applications'
import { approvePartnerApplication } from '@/lib/partner/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const payload = partnerApplicationReviewSchema.parse(body)
    const { id } = await context.params
    const result = await approvePartnerApplication(id, user, payload)

    return NextResponse.json({
      message: 'Partner approved and account credentials generated successfully.',
      ...result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to approve partner application.'
    const status = message.includes('Only pending') ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
