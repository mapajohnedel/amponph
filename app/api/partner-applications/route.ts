import { NextResponse } from 'next/server'
import { errorResponse, internalErrorResponse } from '@/lib/api/errors'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/auth/roles'
import { partnerApplicationSchema } from '@/lib/partner/applications'
import { listPartnerApplications, submitPartnerApplication } from '@/lib/partner/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminUser(user)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const applications = await listPartnerApplications()
    return NextResponse.json({ applications })
  } catch (error) {
    return internalErrorResponse(error, 'Failed to load partner applications.')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = partnerApplicationSchema.parse(body)
    const application = await submitPartnerApplication(payload)

    return NextResponse.json(
      {
        application,
        message:
          'Application received. Our team will review your shelter or rescuer details before creating your partner account.',
      },
      { status: 201 }
    )
  } catch (error) {
    return errorResponse(error, 'Failed to submit your partner application.')
  }
}
