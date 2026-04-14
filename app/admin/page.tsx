'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthenticatedHome } from '@/lib/auth/roles'
import { mockDogs } from '@/lib/mock-dogs'
import type { PartnerApplicationRecord } from '@/lib/partner/applications'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  LogOut,
  Building2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'

export default function AdminPage() {
  const router = useRouter()
  const { supabase, user, loading, isAdmin } = useAuthUser()
  const [activeTab, setActiveTab] = useState<'dogs' | 'requests' | 'applications'>('dogs')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [applications, setApplications] = useState<PartnerApplicationRecord[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<PartnerApplicationRecord | null>(
    null
  )
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewMessage, setReviewMessage] = useState<string | null>(null)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string
    password: string
    organizationName: string
    contactPersonName: string
  } | null>(null)
  const [isCopyingCredentials, setIsCopyingCredentials] = useState(false)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const adoptionRequests = [
    {
      id: 1,
      userName: 'John Doe',
      dogName: 'Max',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      date: '2024-03-10',
      status: 'pending',
    },
    {
      id: 2,
      userName: 'Sarah Smith',
      dogName: 'Luna',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      date: '2024-03-08',
      status: 'approved',
    },
  ]

  const pendingApplications = useMemo(
    () => applications.filter((application) => application.status === 'pending'),
    [applications]
  )

  const loadApplications = async () => {
    setApplicationsLoading(true)
    setApplicationsError(null)

    try {
      const response = await fetch('/api/partner-applications', {
        cache: 'no-store',
      })
      const result = (await response.json()) as {
        applications?: PartnerApplicationRecord[]
        error?: string
      }

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to load partner applications.')
      }

      setApplications(result.applications ?? [])
    } catch (error) {
      setApplicationsError(
        error instanceof Error ? error.message : 'Failed to load partner applications.'
      )
    } finally {
      setApplicationsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login')
    }

    if (!loading && user && !isAdmin) {
      router.replace(getAuthenticatedHome(user))
    }
  }, [isAdmin, loading, router, user])

  useEffect(() => {
    if (!loading && user && isAdmin) {
      void loadApplications()
    }
  }, [isAdmin, loading, user])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
    setIsSigningOut(false)
  }

  const handleApplicationAction = async (action: 'approve' | 'reject') => {
    if (!selectedApplication) {
      return
    }

    setReviewMessage(null)

    if (action === 'approve') {
      setIsApproving(true)
    } else {
      setIsRejecting(true)
    }

    try {
      const response = await fetch(`/api/partner-applications/${selectedApplication.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewNotes,
        }),
      })

      const result = (await response.json()) as {
        error?: string
        message?: string
        email?: string
        password?: string
        organizationName?: string
        contactPersonName?: string
      }

      if (!response.ok) {
        throw new Error(result.error ?? `Failed to ${action} application.`)
      }

      const message = result.message ?? `Application ${action}d successfully.`

      setReviewMessage(message)
      if (action === 'approve' && result.email && result.password) {
        setGeneratedCredentials({
          email: result.email,
          password: result.password,
          organizationName: result.organizationName ?? selectedApplication.organization_name,
          contactPersonName: result.contactPersonName ?? selectedApplication.contact_person_name,
        })
        setCopyMessage(null)
      } else if (action === 'reject') {
        setGeneratedCredentials(null)
        setCopyMessage(null)
      }
      setSelectedApplication(null)
      setReviewNotes('')
      await loadApplications()
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : `Failed to ${action} application.`)
    } finally {
      setIsApproving(false)
      setIsRejecting(false)
    }
  }

  const handleCopyCredentials = async () => {
    if (!generatedCredentials) {
      return
    }

    setIsCopyingCredentials(true)
    setCopyMessage(null)

    try {
      await navigator.clipboard.writeText(
        `Email: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}`
      )
      setCopyMessage('Credentials copied to clipboard.')
    } catch {
      setCopyMessage('Could not copy automatically. Please copy the credentials manually.')
    } finally {
      setIsCopyingCredentials(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="site-container py-12">
          <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">Loading admin dashboard...</h1>
            <p className="mt-3 text-muted-foreground">
              Checking your admin session before opening the control panel.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage platform operations, partner approvals, and rescue listings
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('dogs')}
            className={`border-b-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'dogs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage Dogs
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`border-b-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Adoption Requests
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`border-b-2 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Partner Applications
          </button>
        </div>

        {activeTab === 'dogs' && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dog Listings</h2>
                <p className="text-muted-foreground">{mockDogs.length} dogs in your catalog</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus size={20} />
                Add Dog
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-secondary/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Breed
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDogs.map((dog) => (
                      <tr
                        key={dog.id}
                        className="border-b border-border transition-colors hover:bg-secondary/5"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {dog.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{dog.breed}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{dog.age}</td>
                        <td className="px-6 py-4 text-sm capitalize text-muted-foreground">
                          {dog.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {dog.location}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            Available
                          </span>
                        </td>
                        <td className="flex gap-2 px-6 py-4 text-sm">
                          <button className="rounded p-2 text-primary transition-colors hover:bg-secondary/20">
                            <Eye size={18} />
                          </button>
                          <button className="rounded p-2 text-primary transition-colors hover:bg-secondary/20">
                            <Edit size={18} />
                          </button>
                          <button className="rounded p-2 text-red-600 transition-colors hover:bg-red-50">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-8">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">Add New Dog</h3>
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Dog Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Buddy"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Breed
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Labrador"
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="Years"
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Size
                        </label>
                        <select className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 rounded-lg border border-border px-4 py-2 font-semibold text-foreground transition-colors hover:bg-secondary/10"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                      Add Dog
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">Adoption Requests</h2>
              <p className="text-muted-foreground">
                {adoptionRequests.length} pending request{adoptionRequests.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {adoptionRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-border bg-white p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-foreground">{request.userName}</h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Interested in: <span className="font-semibold">{request.dogName}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground">{request.email}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{request.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'border border-primary text-primary hover:bg-primary/10'
                        }`}
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50">
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Partner Applications</h2>
                <p className="text-muted-foreground">
                  Review shelter and rescuer onboarding requests before creating partner accounts.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
                {pendingApplications.length} pending application
                {pendingApplications.length === 1 ? '' : 's'}
              </div>
            </div>

            {reviewMessage && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {reviewMessage}
              </div>
            )}

            {generatedCredentials && (
              <div className="mb-6 rounded-2xl border border-[#dce9f8] bg-[#f8fbff] p-5 text-sm text-foreground">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Generated partner credentials</h3>
                    <p className="mt-1 text-muted-foreground">
                      Share these credentials with {generatedCredentials.contactPersonName} from{' '}
                      {generatedCredentials.organizationName}. The password is only shown here right
                      after approval.
                    </p>
                    {copyMessage && (
                      <p className="mt-2 text-sm text-[#145da0]">{copyMessage}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleCopyCredentials()}
                      disabled={isCopyingCredentials}
                      className="rounded-full border border-[#d6e8fb] bg-white px-4 py-2 text-xs font-semibold text-[#145da0] transition-colors hover:bg-[#eef7ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCopyingCredentials ? 'Copying...' : 'Copy credentials'}
                    </button>
                    <button
                      onClick={() => {
                        setGeneratedCredentials(null)
                        setCopyMessage(null)
                      }}
                      className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
                      aria-label="Dismiss generated credentials"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#145da0]">
                      Email
                    </p>
                    <p className="mt-2 font-mono text-sm text-foreground">
                      {generatedCredentials.email}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#145da0]">
                      Password
                    </p>
                    <p className="mt-2 font-mono text-sm text-foreground">
                      {generatedCredentials.password}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {applicationsError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {applicationsError}
              </div>
            )}

            {applicationsLoading ? (
              <div className="rounded-3xl border border-border bg-white p-10 text-center">
                <h3 className="text-xl font-semibold text-foreground">Loading partner applications...</h3>
                <p className="mt-2 text-muted-foreground">
                  Pulling the latest submissions from Supabase.
                </p>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-3xl border border-border bg-white p-10 text-center">
                <h3 className="text-xl font-semibold text-foreground">No partner applications yet</h3>
                <p className="mt-2 text-muted-foreground">
                  New shelter and rescuer submissions will appear here for review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-3xl border border-border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-[#ffefe6] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            {application.applicant_type}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              application.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : application.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {application.organization_name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Contact person: {application.contact_person_name}
                          </p>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                          <div className="flex items-start gap-2">
                            <Mail className="mt-0.5 h-4 w-4 text-[#145da0]" />
                            <span>{application.email}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="mt-0.5 h-4 w-4 text-[#145da0]" />
                            <span>{application.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-[#145da0]" />
                            <span>
                              {application.city}, {application.province_or_region}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Submitted on{' '}
                          {new Date(application.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedApplication(application)
                          setReviewNotes(application.review_notes ?? '')
                          setReviewMessage(null)
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-semibold text-foreground transition-colors hover:bg-secondary/10"
                      >
                        <Eye size={18} />
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#145da0]">
                    Partner application review
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-foreground">
                    {selectedApplication.organization_name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Submitted by {selectedApplication.contact_person_name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedApplication(null)
                    setReviewNotes('')
                  }}
                  className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-secondary/10 hover:text-foreground"
                  aria-label="Close application review"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/40 p-5">
                  <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Building2 size={18} />
                    Organization details
                  </h4>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-foreground">Type</dt>
                      <dd className="capitalize text-muted-foreground">
                        {selectedApplication.applicant_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Name</dt>
                      <dd className="text-muted-foreground">
                        {selectedApplication.organization_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Address</dt>
                      <dd className="text-muted-foreground">
                        {selectedApplication.address_line}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">City</dt>
                      <dd className="text-muted-foreground">{selectedApplication.city}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Province / Region</dt>
                      <dd className="text-muted-foreground">
                        {selectedApplication.province_or_region}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-border bg-background/40 p-5">
                  <h4 className="mb-4 text-lg font-semibold text-foreground">Contact details</h4>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-foreground">Contact person</dt>
                      <dd className="text-muted-foreground">
                        {selectedApplication.contact_person_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Email</dt>
                      <dd className="text-muted-foreground">{selectedApplication.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Phone</dt>
                      <dd className="text-muted-foreground">{selectedApplication.phone}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Submitted</dt>
                      <dd className="text-muted-foreground">
                        {new Date(selectedApplication.created_at).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background/40 p-5">
                <h4 className="text-lg font-semibold text-foreground">Application notes</h4>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {selectedApplication.notes?.trim() || 'No additional notes were submitted.'}
                </p>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Review notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                  placeholder="Optional notes for this approval or rejection."
                  className="min-h-28 w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] px-4 py-3 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {selectedApplication.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => void handleApplicationAction('reject')}
                      disabled={isApproving || isRejecting}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X size={18} />
                      {isRejecting ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => void handleApplicationAction('approve')}
                      disabled={isApproving || isRejecting}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={18} />
                      {isApproving ? 'Approving...' : 'Approve and create account'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedApplication(null)
                      setReviewNotes('')
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:bg-secondary/10"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
