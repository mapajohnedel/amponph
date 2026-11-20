import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  submitPartnerApplication: vi.fn(),
  approvePartnerApplication: vi.fn(),
  listPartnerApplications: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: state.user }, error: null }) },
  }),
}))

vi.mock('@/lib/partner/server', () => ({
  submitPartnerApplication: state.submitPartnerApplication,
  approvePartnerApplication: state.approvePartnerApplication,
  listPartnerApplications: state.listPartnerApplications,
}))

import { UserFacingError } from '@/lib/api/errors'
import { GET, POST } from '@/app/api/partner-applications/route'
import { POST as APPROVE } from '@/app/api/partner-applications/[id]/approve/route'

const admin = { id: 'admin-1', email: 'admin@example.com', app_metadata: { role: 'admin' }, user_metadata: {} }

const validApplication = {
  applicantType: 'shelter',
  organizationName: 'Happy Paws Shelter',
  contactPersonName: 'Juan Dela Cruz',
  email: 'contact@happypaws.test',
  phone: '09171234567',
  addressLine: '123 Rizal Street',
  city: 'Quezon City',
  provinceOrRegion: 'Metro Manila',
}

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function callApprove(body: unknown = {}) {
  return APPROVE(jsonRequest(body), { params: Promise.resolve({ id: 'application-1' }) })
}

beforeEach(() => {
  state.user = admin
  state.submitPartnerApplication.mockReset()
  state.approvePartnerApplication.mockReset()
  state.listPartnerApplications.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('GET /api/partner-applications', () => {
  it('returns 401 for non-admins, including a self-assigned user_metadata role', async () => {
    state.user = { ...admin, app_metadata: {}, user_metadata: { role: 'admin' } }
    expect((await GET()).status).toBe(401)
    expect(state.listPartnerApplications).not.toHaveBeenCalled()
  })

  it('hides database errors behind a generic message', async () => {
    state.listPartnerApplications.mockRejectedValue(new Error('relation "partner_applications" does not exist'))
    const response = await GET()
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to load partner applications.' })
  })
})

describe('POST /api/partner-applications', () => {
  it('accepts a valid application', async () => {
    state.submitPartnerApplication.mockResolvedValue({ id: 'application-1' })
    expect((await POST(jsonRequest(validApplication))).status).toBe(201)
  })

  it('returns 400 with a readable message for invalid input', async () => {
    const response = await POST(jsonRequest({ ...validApplication, email: 'not-an-email' }))
    expect(response.status).toBe(400)
    expect((await response.json()).error).not.toContain('[')
    expect(state.submitPartnerApplication).not.toHaveBeenCalled()
  })

  it('returns 400 for a malformed body', async () => {
    expect((await POST(jsonRequest('{oops'))).status).toBe(400)
  })

  it('returns 409 for a duplicate application', async () => {
    state.submitPartnerApplication.mockRejectedValue(
      new UserFacingError('An application already exists for this email address.', 409)
    )
    const response = await POST(jsonRequest(validApplication))
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: 'An application already exists for this email address.' })
  })
})

describe('POST /api/partner-applications/[id]/approve', () => {
  it('returns 401 when signed out', async () => {
    state.user = null
    expect((await callApprove()).status).toBe(401)
    expect(state.approvePartnerApplication).not.toHaveBeenCalled()
  })

  it('returns 409 when the application is no longer pending', async () => {
    state.approvePartnerApplication.mockRejectedValue(
      new UserFacingError('Only pending partner applications can be approved.', 409)
    )
    expect((await callApprove()).status).toBe(409)
  })

  it('hides auth-admin errors behind a generic message', async () => {
    state.approvePartnerApplication.mockRejectedValue(new Error('AuthApiError: email rate limit exceeded'))
    const response = await callApprove()
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to approve partner application.' })
  })
})
