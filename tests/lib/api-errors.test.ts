import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { errorResponse, UserFacingError } from '@/lib/api/errors'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('errorResponse', () => {
  it('passes a UserFacingError through with its status', async () => {
    const response = errorResponse(new UserFacingError('Only pending applications.', 409), 'Fallback.')
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ error: 'Only pending applications.' })
  })

  it('returns the first zod issue as a 400', async () => {
    const result = z.object({ email: z.string().email('Enter a valid email.') }).safeParse({ email: 'x' })
    const response = errorResponse(result.error, 'Fallback.')
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Enter a valid email.' })
  })

  it('treats a malformed JSON body as a 400', async () => {
    const response = errorResponse(new SyntaxError('Unexpected token'), 'Fallback.')
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid request body.' })
  })

  it('hides unexpected error details behind the fallback and logs them', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const internal = new Error('duplicate key value violates unique constraint "pets_pkey"')
    const response = errorResponse(internal, 'Unable to save.')
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Unable to save.' })
    expect(log).toHaveBeenCalledWith('Unable to save.', internal)
  })
})
