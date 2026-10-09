import { describe, expect, it } from 'vitest'
import {
  normalizeOptionalText,
  partnerApplicationReviewSchema,
  partnerApplicationSchema,
} from '@/lib/partner/applications'

const validApplication = {
  applicantType: 'shelter',
  organizationName: '  Happy Paws Shelter ',
  contactPersonName: 'Juan Dela Cruz',
  email: 'contact@happypaws.test',
  phone: '09171234567',
  addressLine: '123 Rizal Street',
  city: 'Quezon City',
  provinceOrRegion: 'Metro Manila',
  notes: '',
}

describe('partnerApplicationSchema', () => {
  it('accepts a valid application and trims strings', () => {
    const result = partnerApplicationSchema.safeParse(validApplication)
    expect(result.success).toBe(true)
    expect(result.success && result.data.organizationName).toBe('Happy Paws Shelter')
  })

  it('allows notes to be omitted', () => {
    const withoutNotes: Partial<typeof validApplication> = { ...validApplication }
    delete withoutNotes.notes
    expect(partnerApplicationSchema.safeParse(withoutNotes).success).toBe(true)
  })

  it('rejects unknown applicant types', () => {
    expect(partnerApplicationSchema.safeParse({ ...validApplication, applicantType: 'admin' }).success).toBe(false)
  })

  it('rejects invalid email and whitespace-only required fields', () => {
    expect(partnerApplicationSchema.safeParse({ ...validApplication, email: 'nope' }).success).toBe(false)
    expect(partnerApplicationSchema.safeParse({ ...validApplication, organizationName: '   ' }).success).toBe(false)
    expect(partnerApplicationSchema.safeParse({ ...validApplication, phone: '123' }).success).toBe(false)
  })

  it('rejects overly long notes', () => {
    expect(partnerApplicationSchema.safeParse({ ...validApplication, notes: 'x'.repeat(1001) }).success).toBe(false)
  })
})

describe('partnerApplicationReviewSchema', () => {
  it('accepts empty or short notes and rejects long ones', () => {
    expect(partnerApplicationReviewSchema.safeParse({}).success).toBe(true)
    expect(partnerApplicationReviewSchema.safeParse({ reviewNotes: 'Looks good.' }).success).toBe(true)
    expect(partnerApplicationReviewSchema.safeParse({ reviewNotes: 'x'.repeat(1001) }).success).toBe(false)
  })
})

describe('normalizeOptionalText', () => {
  it('returns trimmed text or null', () => {
    expect(normalizeOptionalText('  hi ')).toBe('hi')
    expect(normalizeOptionalText('   ')).toBeNull()
    expect(normalizeOptionalText(undefined)).toBeNull()
  })
})
