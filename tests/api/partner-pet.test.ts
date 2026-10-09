import { beforeEach, describe, expect, it, vi } from 'vitest'

const USER_A = '11111111-1111-4111-8111-111111111111'
const USER_B = '22222222-2222-4222-8222-222222222222'
const CLOUD = 'demo-cloud'

type PetRow = {
  id: string
  partner_user_id: string
  image_urls: string[]
  image_public_ids: string[]
}

const state = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  pet: null as Record<string, unknown> | null,
  updates: [] as Record<string, unknown>[],
  deletes: 0,
  deleteCloudinaryImages: vi.fn<(ids: string[]) => Promise<void>>(async () => {}),
}))

// Minimal chainable stand-in for the supabase query builder used by the route.
function createQuery() {
  let mode: 'select' | 'update' | 'delete' = 'select'
  let payload: Record<string, unknown> | null = null
  const query = {
    select: () => query,
    eq: () => query,
    update: (values: Record<string, unknown>) => {
      mode = 'update'
      payload = values
      state.updates.push(values)
      return query
    },
    delete: () => {
      mode = 'delete'
      state.deletes += 1
      return query
    },
    maybeSingle: async () => ({ data: state.pet, error: null }),
    single: async () => ({ data: { ...state.pet, ...payload }, error: null }),
    then: (resolve: (value: unknown) => unknown) => resolve({ data: null, error: null, mode }),
  }
  return query
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: state.user }, error: null }) },
    from: () => createQuery(),
  }),
}))

vi.mock('@/lib/cloudinary/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/cloudinary/server')>()
  return { ...actual, deleteCloudinaryImages: state.deleteCloudinaryImages }
})

import { DELETE, PATCH } from '@/app/api/partner/pets/[id]/route'

function imageUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/v1700000000/${publicId}.jpg`
}

function setPet(publicIds: string[]) {
  const pet: PetRow = {
    id: 'pet-1',
    partner_user_id: USER_A,
    image_urls: publicIds.map(imageUrl),
    image_public_ids: publicIds,
  }
  state.pet = pet
}

function patchBody(overrides: Record<string, unknown>) {
  return {
    name: 'Bantay',
    breed: 'Aspin',
    age_years: 2,
    gender: 'male',
    size: 'medium',
    location: 'Manila',
    description: '',
    status: 'published',
    ...overrides,
  }
}

function callPatch(body: Record<string, unknown>) {
  return PATCH(
    new Request('http://localhost/api', { method: 'PATCH', body: JSON.stringify(body) }),
    { params: Promise.resolve({ id: 'pet-1' }) }
  )
}

function callDelete() {
  return DELETE(new Request('http://localhost/api', { method: 'DELETE' }), { params: Promise.resolve({ id: 'pet-1' }) })
}

const own = (name: string) => `amponph/pets/${USER_A}/${name}`
const foreign = (name: string) => `amponph/pets/${USER_B}/${name}`

beforeEach(() => {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = CLOUD
  delete process.env.CLOUDINARY_PET_IMAGES_FOLDER
  state.user = { id: USER_A, email: 'a@example.com', app_metadata: { role: 'partner' }, user_metadata: {} }
  state.updates = []
  state.deletes = 0
  state.deleteCloudinaryImages.mockClear()
})

describe('PATCH /api/partner/pets/[id]', () => {
  it("rejects another partner's public ID without updating or deleting", async () => {
    setPet([own('one')])
    const response = await callPatch(
      patchBody({ image_urls: [imageUrl(own('one'))], image_public_ids: [own('one'), foreign('victim')] })
    )
    expect(response.status).toBe(400)
    expect(state.updates).toHaveLength(0)
    expect(state.deleteCloudinaryImages).not.toHaveBeenCalled()
  })

  it("rejects an image URL pointing at another partner's folder", async () => {
    setPet([own('one')])
    const response = await callPatch(patchBody({ image_urls: [imageUrl(foreign('victim'))] }))
    expect(response.status).toBe(400)
    expect(state.updates).toHaveLength(0)
  })

  it('rejects non-Cloudinary image URLs', async () => {
    setPet([own('one')])
    const response = await callPatch(patchBody({ image_urls: ['https://evil.example.com/x.jpg'] }))
    expect(response.status).toBe(400)
    expect(state.updates).toHaveLength(0)
  })

  it('deletes only removed images owned by the partner and keeps legacy ones', async () => {
    setPet([own('keep'), own('drop'), 'amponph/pets/legacy'])
    const response = await callPatch(patchBody({ image_urls: [imageUrl(own('keep'))], image_public_ids: [own('keep')] }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(state.updates).toHaveLength(1)
    expect(state.deleteCloudinaryImages).toHaveBeenCalledTimes(1)
    expect(state.deleteCloudinaryImages).toHaveBeenCalledWith([own('drop')])
    expect(body.cleanupWarning).toContain('1 older image(s)')
  })

  it('lets a partner keep an already stored legacy image', async () => {
    setPet(['amponph/pets/legacy'])
    const response = await callPatch(patchBody({ image_urls: [imageUrl('amponph/pets/legacy')] }))
    expect(response.status).toBe(200)
    expect(state.deleteCloudinaryImages).not.toHaveBeenCalled()
  })

  it('lets a partner keep an already stored non-Cloudinary image URL', async () => {
    const legacyUrl = 'https://images.example.com/old-dog.jpg'
    state.pet = { id: 'pet-1', partner_user_id: USER_A, image_urls: [legacyUrl], image_public_ids: [] }
    const response = await callPatch(patchBody({ image_urls: [legacyUrl, imageUrl(own('new'))], image_public_ids: [own('new')] }))
    expect(response.status).toBe(200)
    expect(state.updates).toHaveLength(1)
    expect(state.deleteCloudinaryImages).not.toHaveBeenCalled()
  })

  it('returns 403 for a user_metadata-only partner', async () => {
    state.user = { id: USER_A, email: 'a@example.com', app_metadata: {}, user_metadata: { role: 'partner' } }
    setPet([own('one')])
    expect((await callPatch(patchBody({ image_urls: [imageUrl(own('one'))] }))).status).toBe(403)
  })
})

describe('DELETE /api/partner/pets/[id]', () => {
  it('deletes the row and only destroys owned images', async () => {
    setPet([own('one'), foreign('planted'), 'amponph/pets/legacy'])
    const response = await callDelete()

    expect(response.status).toBe(200)
    expect(state.deletes).toBe(1)
    expect(state.deleteCloudinaryImages).toHaveBeenCalledWith([own('one')])
  })

  it('still succeeds with a warning when Cloudinary cleanup fails', async () => {
    setPet([own('one')])
    state.deleteCloudinaryImages.mockRejectedValueOnce(new Error('Cloudinary down'))
    const response = await callDelete()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true, cleanupWarning: 'Cloudinary down' })
  })

  it('returns 404 when the pet is not owned', async () => {
    state.pet = null
    expect((await callDelete()).status).toBe(404)
    expect(state.deletes).toBe(0)
  })
})
