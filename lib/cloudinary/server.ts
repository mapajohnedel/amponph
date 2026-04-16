import { createHash } from 'node:crypto'

function getCloudinaryEnv(
  name:
    | 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
    | 'CLOUDINARY_API_KEY'
    | 'CLOUDINARY_API_SECRET'
) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name}.`)
  }

  return value
}

function buildDestroySignature(publicId: string, timestamp: number) {
  const apiSecret = getCloudinaryEnv('CLOUDINARY_API_SECRET')
  const payload = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`

  return createHash('sha1')
    .update(`${payload}${apiSecret}`)
    .digest('hex')
}

export function extractCloudinaryPublicId(url: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName || !url.includes(`res.cloudinary.com/${cloudName}/image/upload/`)) {
    return null
  }

  const uploadIndex = url.indexOf('/image/upload/')

  if (uploadIndex === -1) {
    return null
  }

  let assetPath = url.slice(uploadIndex + '/image/upload/'.length)

  assetPath = assetPath.replace(/^https?:\/\/[^/]+\//, '')
  assetPath = assetPath.replace(/^([^/]+\/)+?(?=v\d+\/)/, '')
  assetPath = assetPath.replace(/^v\d+\//, '')

  const extensionIndex = assetPath.lastIndexOf('.')
  if (extensionIndex === -1) {
    return assetPath || null
  }

  return assetPath.slice(0, extensionIndex) || null
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  const uniquePublicIds = Array.from(new Set(publicIds.filter(Boolean)))

  if (uniquePublicIds.length === 0) {
    return
  }

  const cloudName = getCloudinaryEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
  const apiKey = getCloudinaryEnv('CLOUDINARY_API_KEY')

  for (const publicId of uniquePublicIds) {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = buildDestroySignature(publicId, timestamp)
    const formData = new FormData()

    formData.append('public_id', publicId)
    formData.append('invalidate', 'true')
    formData.append('timestamp', String(timestamp))
    formData.append('api_key', apiKey)
    formData.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    })

    const payload = (await response.json()) as
      | { result?: string; error?: { message?: string } }
      | undefined

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? 'Cloudinary image deletion failed.')
    }

    if (payload?.result && payload.result !== 'ok' && payload.result !== 'not found') {
      throw new Error(`Cloudinary image deletion returned "${payload.result}".`)
    }
  }
}
