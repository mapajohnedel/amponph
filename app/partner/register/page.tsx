'use client'

import Link from 'next/link'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, ChevronDown, HeartHandshake, MapPin, Phone, ShieldCheck, User } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { getAuthenticatedHome } from '@/lib/auth/roles'
import {
  getCityOptionsByProvince,
  getProvinceLabel,
  philippineProvinceOptions,
} from '@/lib/philippines-locations'
import {
  partnerApplicationSchema,
  type PartnerApplicantType,
  type PartnerApplicationInput,
} from '@/lib/partner/applications'

const initialForm: PartnerApplicationInput = {
  applicantType: 'shelter',
  organizationName: '',
  contactPersonName: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  provinceOrRegion: '',
  notes: '',
}

export default function PartnerRegisterPage() {
  const router = useRouter()
  const { user, loading } = useAuthUser()
  const [form, setForm] = useState<PartnerApplicationInput>(initialForm)
  const [selectedProvinceKey, setSelectedProvinceKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cityOptions = useMemo(
    () => getCityOptionsByProvince(selectedProvinceKey),
    [selectedProvinceKey]
  )

  useEffect(() => {
    if (!loading && user) {
      router.replace(getAuthenticatedHome(user))
    }
  }, [loading, router, user])

  const updateField = <Key extends keyof PartnerApplicationInput>(
    key: Key,
    value: PartnerApplicationInput[Key]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleTypeChange = (applicantType: PartnerApplicantType) => {
    updateField('applicantType', applicantType)
  }

  const handleProvinceChange = (provinceKey: string) => {
    setSelectedProvinceKey(provinceKey)
    updateField('provinceOrRegion', provinceKey ? getProvinceLabel(provinceKey) : '')
    updateField('city', '')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const parsed = partnerApplicationSchema.safeParse(form)

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? 'Please complete the required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/partner-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      })

      const result = (await response.json()) as {
        error?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to submit your application.')
      }

      setForm(initialForm)
      setSelectedProvinceKey('')
      setSuccessMessage(
        result.message ??
          'Application received. We will review your details before creating your partner login.'
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit your application.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] dark:bg-[linear-gradient(180deg,var(--page-gradient-from)_0%,var(--page-gradient-to)_100%)] py-12">
        <div className="site-container">
          <div className="rounded-[2.5rem] border border-white/70 dark:border-white/10 bg-white/85 dark:bg-card/85 p-10 text-center shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur">
            <h1 className="text-2xl font-bold text-foreground">Loading partner application...</h1>
            <p className="mt-3 text-muted-foreground">
              Checking whether you already have an active account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] dark:bg-[linear-gradient(180deg,var(--page-gradient-from)_0%,var(--page-gradient-to)_100%)] py-12">
      <div className="site-container grid min-h-[calc(100vh-9rem)] items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] dark:from-primary/10 via-white dark:via-card to-[#eef7ff] dark:to-sky-400/10 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeartHandshake className="h-7 w-7" />
          </div>
          <div className="mt-8 space-y-4">
            <span className="inline-flex rounded-full bg-[#ffefe6] dark:bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
              Shelter and rescuer onboarding
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Apply to join AmponPH as a partner
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Submit your organization details and our admins will review your application before
              creating your partner account.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-card/80 p-5 backdrop-blur">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-foreground">Admin-reviewed access</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Every partner application is reviewed before account credentials are generated.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-card/80 p-5 backdrop-blur">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7ff] dark:bg-sky-400/10 text-[#145da0] dark:text-sky-300">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-foreground">Built for rescue teams</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Approved partners get a dedicated dashboard separate from the super-admin panel.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-card/80 p-5 backdrop-blur">
            <h2 className="font-semibold text-foreground">What happens next</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              <li>1. Submit your shelter or rescuer details.</li>
              <li>2. Our admin team reviews the application.</li>
              <li>3. Once approved, login credentials are emailed to you.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/70 dark:border-white/10 bg-white/85 dark:bg-card/85 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Partner application</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the information below so we can verify your shelter or rescue operation.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Applying as</label>
              <div className="flex gap-2 rounded-full bg-[#f6f9fe] dark:bg-muted/60 p-1.5">
                <button
                  type="button"
                  onClick={() => handleTypeChange('shelter')}
                  className={`flex-1 rounded-full py-3 text-sm font-medium transition-all ${
                    form.applicantType === 'shelter'
                      ? 'bg-primary text-primary-foreground shadow-[0_16px_36px_-22px_rgba(249,115,22,0.9)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Shelter
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('rescuer')}
                  className={`flex-1 rounded-full py-3 text-sm font-medium transition-all ${
                    form.applicantType === 'rescuer'
                      ? 'bg-primary text-primary-foreground shadow-[0_16px_36px_-22px_rgba(249,115,22,0.9)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Rescuer
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Shelter or Rescuer Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.organizationName}
                  onChange={(event) => updateField('organizationName', event.target.value)}
                  placeholder="AmponPH Rescue Team"
                  className="w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Contact Person
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.contactPersonName}
                  onChange={(event) => updateField('contactPersonName', event.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="partner@example.com"
                  className="w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-4 py-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <textarea
                  value={form.addressLine}
                  onChange={(event) => updateField('addressLine', event.target.value)}
                  placeholder="Street, barangay, building, or rescue pickup location"
                  className="min-h-28 w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Province or Region</label>
                <div className="relative">
                  <select
                    value={selectedProvinceKey}
                    onChange={(event) => handleProvinceChange(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-4 py-3 pr-12 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  >
                    <option value="">Select a province or region</option>
                    {philippineProvinceOptions.map((province) => (
                      <option key={province.key} value={province.key}>
                        {province.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">City</label>
                <div className="relative">
                  <select
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    disabled={!selectedProvinceKey}
                    className="w-full appearance-none rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-4 py-3 pr-12 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  >
                    <option value="">
                      {selectedProvinceKey ? 'Select a city' : 'Select a province first'}
                    </option>
                    {cityOptions.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Additional notes
              </label>
              <textarea
                value={form.notes ?? ''}
                onChange={(event) => updateField('notes', event.target.value)}
                placeholder="Tell us about your rescue work, operating area, or any details that can help with approval."
                className="min-h-28 w-full rounded-2xl border border-[#dce9f8] dark:border-border bg-[#fcfdff] dark:bg-muted/60 px-4 py-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already approved and received your credentials?{' '}
            <Link href="/auth" className="font-semibold text-primary transition-opacity hover:opacity-80">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
