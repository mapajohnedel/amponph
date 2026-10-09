import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getAuthenticatedHome, isAdminUser, isPartnerUser } from '@/lib/auth/roles'

type TestUser = Parameters<typeof isAdminUser>[0]

function makeUser({
  email = 'someone@example.com',
  appMetadata = {},
  userMetadata = {},
}: {
  email?: string
  appMetadata?: Record<string, unknown>
  userMetadata?: Record<string, unknown>
} = {}): TestUser {
  return { email, app_metadata: appMetadata, user_metadata: userMetadata } as TestUser
}

const originalAdminEmails = process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS = 'Admin@AmponPH.test, second-admin@amponph.test'
})

afterEach(() => {
  if (originalAdminEmails === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS = originalAdminEmails
  }
})

describe('isAdminUser', () => {
  it('returns false for missing users', () => {
    expect(isAdminUser(null)).toBe(false)
    expect(isAdminUser(undefined)).toBe(false)
  })

  it.each([
    { role: 'admin' },
    { account_type: 'admin' },
    { role: ['admin'] },
  ])('ignores user-controlled user_metadata %o', (userMetadata) => {
    expect(isAdminUser(makeUser({ userMetadata }))).toBe(false)
  })

  it('grants admin from app_metadata.role', () => {
    expect(isAdminUser(makeUser({ appMetadata: { role: 'admin' } }))).toBe(true)
    expect(isAdminUser(makeUser({ appMetadata: { role: ' Admin ' } }))).toBe(true)
    expect(isAdminUser(makeUser({ appMetadata: { role: ['partner', 'admin'] } }))).toBe(true)
  })

  it('grants admin from the email allowlist, case-insensitively', () => {
    expect(isAdminUser(makeUser({ email: 'admin@amponph.test' }))).toBe(true)
    expect(isAdminUser(makeUser({ email: '  SECOND-ADMIN@amponph.test ' }))).toBe(true)
    expect(isAdminUser(makeUser({ email: 'not-admin@amponph.test' }))).toBe(false)
  })

  it('does not treat an empty allowlist as matching everyone', () => {
    process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS = ''
    expect(isAdminUser(makeUser({ email: '' }))).toBe(false)
    delete process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS
    expect(isAdminUser(makeUser({ email: 'admin@amponph.test' }))).toBe(false)
  })
})

describe('isPartnerUser', () => {
  it.each([
    { role: 'partner' },
    { account_type: 'partner' },
  ])('ignores user-controlled user_metadata %o', (userMetadata) => {
    expect(isPartnerUser(makeUser({ userMetadata }))).toBe(false)
  })

  it('grants partner from app_metadata.role', () => {
    expect(isPartnerUser(makeUser({ appMetadata: { role: 'partner' } }))).toBe(true)
    expect(isPartnerUser(makeUser({ appMetadata: { role: ['PARTNER'] } }))).toBe(true)
  })

  it('never treats an admin as a partner', () => {
    expect(isPartnerUser(makeUser({ appMetadata: { role: ['admin', 'partner'] } }))).toBe(false)
    expect(isPartnerUser(makeUser({ email: 'admin@amponph.test', appMetadata: { role: 'partner' } }))).toBe(false)
  })

  it('returns false for missing users and unknown roles', () => {
    expect(isPartnerUser(null)).toBe(false)
    expect(isPartnerUser(makeUser({ appMetadata: { role: 'adopter' } }))).toBe(false)
    expect(isPartnerUser(makeUser({ appMetadata: { role: 42 } }))).toBe(false)
  })
})

describe('getAuthenticatedHome', () => {
  it('routes admins, partners and adopters to their homes', () => {
    expect(getAuthenticatedHome(makeUser({ appMetadata: { role: 'admin' } }))).toBe('/admin')
    expect(getAuthenticatedHome(makeUser({ email: 'admin@amponph.test' }))).toBe('/admin')
    expect(getAuthenticatedHome(makeUser({ appMetadata: { role: 'partner' } }))).toBe('/partner')
    expect(getAuthenticatedHome(makeUser())).toBe('/dashboard')
    expect(getAuthenticatedHome(null)).toBe('/dashboard')
  })

  it('does not route by user_metadata', () => {
    expect(getAuthenticatedHome(makeUser({ userMetadata: { role: 'admin' } }))).toBe('/dashboard')
    expect(getAuthenticatedHome(makeUser({ userMetadata: { account_type: 'partner' } }))).toBe('/dashboard')
  })
})
