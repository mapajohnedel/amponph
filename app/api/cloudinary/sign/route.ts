import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isPartnerUser } from '@/lib/auth/roles'
import { getPartnerPetImagesFolder } from '@/lib/cloudinary/shared'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function getRequiredEnv(name: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME' | 'CLOUDINARY_API_KEY' | 'CLOUDINARY_API_SECRET') {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name}.`)
  }

  return value
}

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'You must be signed in to upload pet images.' }, { status: 401 })
    }

    if (!isPartnerUser(user)) {
      return NextResponse.json({ error: 'Only partner accounts can upload pet images.' }, { status: 403 })
    }

    const cloudName = getRequiredEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
    const apiKey = getRequiredEnv('CLOUDINARY_API_KEY')
    const apiSecret = getRequiredEnv('CLOUDINARY_API_SECRET')
    const folder = getPartnerPetImagesFolder(user.id)
    const timestamp = Math.floor(Date.now() / 1000)
    const signaturePayload = `folder=${folder}&timestamp=${timestamp}`
    const signature = createHash('sha1')
      .update(`${signaturePayload}${apiSecret}`)
      .digest('hex')

    return NextResponse.json({
      apiKey,
      cloudName,
      folder,
      signature,
      timestamp,
    })
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : 'Unable to prepare Cloudinary upload.'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
