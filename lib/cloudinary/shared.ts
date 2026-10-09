const DEFAULT_PET_IMAGES_FOLDER = 'amponph/pets'
const SAFE_PUBLIC_ID_PATTERN = /^[A-Za-z0-9_\-./]+$/

export function normalizeFolder(folder: string) {
  return folder.trim().replace(/^\/+|\/+$/g, '')
}

export function getPetImagesBaseFolder() {
  return normalizeFolder(process.env.CLOUDINARY_PET_IMAGES_FOLDER || DEFAULT_PET_IMAGES_FOLDER) || DEFAULT_PET_IMAGES_FOLDER
}

export function getPartnerPetImagesFolder(userId: string, baseFolder = getPetImagesBaseFolder()) {
  return `${normalizeFolder(baseFolder)}/${userId}`
}

function isSafePublicId(publicId: string) {
  return (
    SAFE_PUBLIC_ID_PATTERN.test(publicId) &&
    !publicId.includes('..') &&
    !publicId.includes('//') &&
    !publicId.startsWith('/') &&
    !publicId.endsWith('/')
  )
}

// Only IDs inside `${baseFolder}/${userId}/` may be destroyed on behalf of a partner.
export function isOwnedPetImagePublicId(publicId: string, userId: string, baseFolder = getPetImagesBaseFolder()) {
  if (typeof publicId !== 'string' || !userId || !isSafePublicId(userId) || userId.includes('/')) {
    return false
  }

  const prefix = `${getPartnerPetImagesFolder(userId, baseFolder)}/`

  return isSafePublicId(publicId) && publicId.startsWith(prefix) && publicId.length > prefix.length
}

export function filterOwnedPublicIds(publicIds: string[], userId: string, baseFolder = getPetImagesBaseFolder()) {
  return publicIds.filter((publicId) => isOwnedPetImagePublicId(publicId, userId, baseFolder))
}

export function isAllowedCloudinaryImageUrl(url: string, cloudName: string | undefined) {
  if (!cloudName || typeof url !== 'string' || url.includes('..') || url.includes('\\')) {
    return false
  }

  try {
    const parsedUrl = new URL(url)

    return (
      parsedUrl.protocol === 'https:' &&
      parsedUrl.hostname === 'res.cloudinary.com' &&
      !parsedUrl.username &&
      !parsedUrl.password &&
      !parsedUrl.port &&
      parsedUrl.pathname.startsWith(`/${cloudName}/image/upload/`)
    )
  } catch {
    return false
  }
}
