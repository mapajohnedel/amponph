import { beforeEach, describe, expect, it, vi } from 'vitest'

const supabaseMock = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  rpcError: null as { code?: string; message: string } | null,
  rpc: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: supabaseMock.user }, error: null }),
    },
    rpc: async (...args: unknown[]) => {
      supabaseMock.rpc(...args)
      return { data: null, error: supabaseMock.rpcError }
    },
  }),
}))

import { POST } from '@/app/api/adoption-requests/[id]/approve/route'

const partner = { id: 'partner-1', email: 'partner@example.com', app_metadata: { role: 'partner' }, user_metadata: {} }

function callApprove(id = 'request-1') {
  return POST(new Request('http://localhost/api', { method: 'POST' }), { params: Promise.resolve({ id }) })
}

beforeEach(() => {
  supabaseMock.user = partner
  supabaseMock.rpcError = null
  supabaseMock.rpc.mockClear()
})

describe('POST /api/adoption-requests/[id]/approve', () => {
  it('returns 401 when signed out', async () => {
    supabaseMock.user = null
    expect((await callApprove()).status).toBe(401)
    expect(supabaseMock.rpc).not.toHaveBeenCalled()
  })

  it('returns 403 for users whose partner role is only in user_metadata', async () => {
    supabaseMock.user = { ...partner, app_metadata: {}, user_metadata: { role: 'partner' } }
    expect((await callApprove()).status).toBe(403)
    expect(supabaseMock.rpc).not.toHaveBeenCalled()
  })

  it('approves through the RPC', async () => {
    const response = await callApprove('request-9')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true, message: 'Adoption request approved.' })
    expect(supabaseMock.rpc).toHaveBeenCalledWith('approve_adoption_request', { request_id: 'request-9' })
  })

  it.each([
    ['P0002', 404],
    ['22P02', 404],
    ['AR409', 409],
    ['AR410', 409],
    ['XX000', 500],
  ])('maps RPC error %s to %i', async (code, status) => {
    supabaseMock.rpcError = { code, message: `error ${code}` }
    expect((await callApprove()).status).toBe(status)
  })
})
