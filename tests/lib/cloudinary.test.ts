import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  filterOwnedPublicIds,
  getPartnerPetImagesFolder,
  getPetImagesBaseFolder,
  isAllowedCloudinaryImageUrl,
  isOwnedPetImagePublicId,
  normalizeFolder,
} from '@/lib/cloudinary/shared'
import { extractCloudinaryPublicId } from '@/lib/cloudinary/server'

const USER_A = '11111111-1111-4111-8111-111111111111'
const USER_B = '22222222-2222-4222-8222-222222222222'
const BASE = 'amponph/pets'

const originalEnv = { ...process.env }

beforeEach(() => {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'demo-cloud'
  delete process.env.CLOUDINARY_PET_IMAGES_FOLDER
})

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('folders', () => {
  it('defaults and normalizes the base folder', () => {
    expect(getPetImagesBaseFolder()).toBe(BASE)
    process.env.CLOUDINARY_PET_IMAGES_FOLDER = '/custom/folder/'
    expect(getPetImagesBaseFolder()).toBe('custom/folder')
    process.env.CLOUDINARY_PET_IMAGES_FOLDER = '///'
    expect(getPetImagesBaseFolder()).toBe(BASE)
    expect(normalizeFolder('  /a/b// ')).toBe('a/b')
  })

  it('builds a per-partner folder', () => {
    expect(getPartnerPetImagesFolder(USER_A)).toBe(`${BASE}/${USER_A}`)
  })
})

describe('isOwnedPetImagePublicId', () => {
  it('accepts IDs inside the partner folder', () => {
    expect(isOwnedPetImagePublicId(`${BASE}/${USER_A}/photo_1`, USER_A)).toBe(true)
    expect(isOwnedPetImagePublicId(`${BASE}/${USER_A}/nested/photo-2`, USER_A)).toBe(true)
  })

  it("rejects another partner's IDs", () => {
    expect(isOwnedPetImagePublicId(`${BASE}/${USER_B}/photo_1`, USER_A)).toBe(false)
  })

  it('rejects legacy shared-folder IDs', () => {
    expect(isOwnedPetImagePublicId(`${BASE}/photo_1`, USER_A)).toBe(false)
    expect(isOwnedPetImagePublicId('photo_1', USER_A)).toBe(false)
  })

  it('rejects path traversal and malformed IDs', () => {
    const rejected = [
      `${BASE}/${USER_A}/../${USER_B}/photo`,
      `${BASE}/${USER_A}/..`,
      `${BASE}/${USER_A}//photo`,
      `/${BASE}/${USER_A}/photo`,
      `${BASE}/${USER_A}/photo/`,
      `${BASE}/${USER_A}/`,
      `${BASE}/${USER_A}`,
      `${BASE}/${USER_A}/photo?x=1`,
      `${BASE}/${USER_A}/pho to`,
      `${BASE}/${USER_A}/photo%2F..`,
      `${BASE}/${USER_A}extra/photo`,
    ]

    for (const publicId of rejected) {
      expect(isOwnedPetImagePublicId(publicId, USER_A), publicId).toBe(false)
    }
  })

  it('rejects bad user IDs', () => {
    expect(isOwnedPetImagePublicId(`${BASE}//photo`, '')).toBe(false)
    expect(isOwnedPetImagePublicId(`${BASE}/a/b/photo`, 'a/b')).toBe(false)
    expect(isOwnedPetImagePublicId(`${BASE}/../photo`, '..')).toBe(false)
  })

  it('rejects non-string input', () => {
    expect(isOwnedPetImagePublicId(42 as unknown as string, USER_A)).toBe(false)
  })

  it('respects a custom base folder', () => {
    expect(isOwnedPetImagePublicId(`other/${USER_A}/photo`, USER_A, 'other')).toBe(true)
    expect(isOwnedPetImagePublicId(`${BASE}/${USER_A}/photo`, USER_A, 'other')).toBe(false)
  })
})

describe('filterOwnedPublicIds', () => {
  it('keeps only owned IDs', () => {
    const ids = [
      `${BASE}/${USER_A}/keep`,
      `${BASE}/${USER_B}/foreign`,
      `${BASE}/legacy`,
      `${BASE}/${USER_A}/../${USER_B}/sneaky`,
    ]
    expect(filterOwnedPublicIds(ids, USER_A)).toEqual([`${BASE}/${USER_A}/keep`])
  })
})

describe('isAllowedCloudinaryImageUrl', () => {
  const good = `https://res.cloudinary.com/demo-cloud/image/upload/v1700000000/${BASE}/${USER_A}/photo.jpg`

  it('accepts HTTPS delivery URLs for the configured cloud', () => {
    expect(isAllowedCloudinaryImageUrl(good, 'demo-cloud')).toBe(true)
  })

  it('rejects other hosts, clouds, protocols and tricks', () => {
    const rejected = [
      good.replace('https://', 'http://'),
      good.replace('res.cloudinary.com', 'evil.example.com'),
      good.replace('res.cloudinary.com', 'res.cloudinary.com.evil.example.com'),
      good.replace('res.cloudinary.com', 'res.cloudinary.com:8443'),
      good.replace('https://', 'https://user:pass@'),
      good.replace('demo-cloud', 'other-cloud'),
      good.replace('/image/upload/', '/video/upload/'),
      `https://res.cloudinary.com/demo-cloud/image/upload/../../other-cloud/image/upload/x.jpg`,
      `https://res.cloudinary.com/demo-cloud/image/upload/a\\b.jpg`,
      'not a url',
      'javascript:alert(1)',
    ]

    for (const url of rejected) {
      expect(isAllowedCloudinaryImageUrl(url, 'demo-cloud'), url).toBe(false)
    }
  })

  it('rejects when the cloud name is not configured', () => {
    expect(isAllowedCloudinaryImageUrl(good, undefined)).toBe(false)
    expect(isAllowedCloudinaryImageUrl(good, '')).toBe(false)
  })
})

describe('extractCloudinaryPublicId', () => {
  it('extracts the public ID from a versioned URL', () => {
    expect(
      extractCloudinaryPublicId(`https://res.cloudinary.com/demo-cloud/image/upload/v1700000000/${BASE}/${USER_A}/photo.jpg`)
    ).toBe(`${BASE}/${USER_A}/photo`)
  })

  it('strips transformations before the version segment', () => {
    expect(
      extractCloudinaryPublicId(
        `https://res.cloudinary.com/demo-cloud/image/upload/c_fill,w_400/q_auto/v1700000000/${BASE}/${USER_A}/photo.webp`
      )
    ).toBe(`${BASE}/${USER_A}/photo`)
  })

  it('handles URLs without a version or extension', () => {
    expect(extractCloudinaryPublicId(`https://res.cloudinary.com/demo-cloud/image/upload/${BASE}/legacy.png`)).toBe(
      `${BASE}/legacy`
    )
    expect(extractCloudinaryPublicId(`https://res.cloudinary.com/demo-cloud/image/upload/v1/${BASE}/noext`)).toBe(
      `${BASE}/noext`
    )
  })

  it('returns null for other clouds, hosts or a missing cloud name', () => {
    expect(extractCloudinaryPublicId(`https://res.cloudinary.com/other-cloud/image/upload/v1/${BASE}/x.jpg`)).toBeNull()
    expect(extractCloudinaryPublicId('https://images.dog.ceo/breeds/x.jpg')).toBeNull()
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    expect(extractCloudinaryPublicId(`https://res.cloudinary.com/demo-cloud/image/upload/v1/${BASE}/x.jpg`)).toBeNull()
  })
})
