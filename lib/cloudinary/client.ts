'use client'

const MAX_PET_IMAGE_COUNT = 3
const MAX_PET_IMAGE_BYTES = 200 * 1024
const MAX_CANVAS_DIMENSION = 1600
const MIN_CANVAS_DIMENSION = 500
const QUALITY_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42]

type CloudinarySignaturePayload = {
  apiKey: string
  cloudName: string
  folder: string
  signature: string
  timestamp: number
}

type CloudinaryUploadResponse = {
  bytes: number
  public_id: string
  secure_url: string
}

export type UploadedPetImage = {
  bytes: number
  publicId: string
  url: string
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export { MAX_PET_IMAGE_BYTES, MAX_PET_IMAGE_COUNT }

function buildOutputName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf('.')
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName
  return `${baseName || 'pet-image'}.webp`
}

function clampCanvasSize(width: number, height: number, maxDimension: number) {
  const largestDimension = Math.max(width, height)

  if (largestDimension <= maxDimension) {
    return { width, height }
  }

  const scale = maxDimension / largestDimension

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Unable to read "${file.name}" as an image.`))
    }

    image.src = objectUrl
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to compress the selected image.'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

export async function compressPetImage(file: File) {
  if (file.size <= MAX_PET_IMAGE_BYTES) {
    return file
  }

  const image = await loadImage(file)
  let { width, height } = clampCanvasSize(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    MAX_CANVAS_DIMENSION
  )

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Your browser could not prepare the image for upload.')
  }

  let smallestBlob: Blob | null = null

  while (true) {
    canvas.width = width
    canvas.height = height
    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, quality)

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob
      }

      if (blob.size <= MAX_PET_IMAGE_BYTES) {
        return new File([blob], buildOutputName(file.name), {
          type: 'image/webp',
          lastModified: Date.now(),
        })
      }
    }

    if (width <= MIN_CANVAS_DIMENSION || height <= MIN_CANVAS_DIMENSION) {
      break
    }

    width = Math.max(MIN_CANVAS_DIMENSION, Math.round(width * 0.85))
    height = Math.max(MIN_CANVAS_DIMENSION, Math.round(height * 0.85))
  }

  if (!smallestBlob) {
    throw new Error(`We could not compress "${file.name}". Please try a different image.`)
  }

  return new File([smallestBlob], buildOutputName(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}

async function getUploadSignature(): Promise<CloudinarySignaturePayload> {
  const response = await fetch('/api/cloudinary/sign', {
    method: 'POST',
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.error ?? 'Unable to prepare image upload.')
  }

  return payload as CloudinarySignaturePayload
}

export async function uploadPetImageToCloudinary(file: File): Promise<UploadedPetImage> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.')
  }

  const compressedFile = await compressPetImage(file)
  const signaturePayload = await getUploadSignature()
  const formData = new FormData()

  formData.append('file', compressedFile)
  formData.append('api_key', signaturePayload.apiKey)
  formData.append('timestamp', String(signaturePayload.timestamp))
  formData.append('signature', signaturePayload.signature)
  formData.append('folder', signaturePayload.folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const payload = (await response.json()) as
    | CloudinaryUploadResponse
    | { error?: { message?: string } }

  if (!response.ok || !('secure_url' in payload)) {
    const errorPayload = payload as { error?: { message?: string } }
    throw new Error(errorPayload.error?.message ?? 'Cloudinary upload failed.')
  }

  return {
    bytes: payload.bytes,
    publicId: payload.public_id,
    url: payload.secure_url,
  }
}
