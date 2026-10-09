import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle, Clock3, Mail, PawPrint, XCircle } from 'lucide-react'
import { AdoptionRequestReviewActions } from '@/components/partner/adoption-request-review-actions'
import { getAuthenticatedHome, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

type PartnerAdoptionRequestRow = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  requester_name: string | null
  requester_email: string | null
  review_note: string | null
  pets:
    | { name: string; breed: string; image_url: string | null; image_urls: string[] | null }
    | { name: string; breed: string; image_url: string | null; image_urls: string[] | null }[]
    | null
}

function getSingleRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null
  }

  return Array.isArray(value) ? value[0] ?? null : value
}

export default async function PartnerRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  if (!isPartnerUser(user)) {
    redirect(getAuthenticatedHome(user))
  }

  const { data: requests, error } = await supabase
    .from('adoption_requests')
    .select(
      'id, status, created_at, requester_name, requester_email, review_note, pets(name, breed, image_url, image_urls)'
    )
    .eq('partner_user_id', user.id)
    .order('created_at', { ascending: false })

  const adoptionRequests = ((requests ?? []) as PartnerAdoptionRequestRow[]).map((request) => ({
    ...request,
    pet: getSingleRelation(request.pets),
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <Link
          href="/partner"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white dark:bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to partner dashboard
        </Link>

        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] dark:from-primary/10 via-white dark:via-card to-[#eef7ff] dark:to-sky-400/10 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <span className="inline-flex rounded-full bg-[#ffefe6] dark:bg-primary/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            Partner workflow
          </span>
          <h1 className="mt-6 flex items-center gap-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <PawPrint className="h-8 w-8 text-primary" />
            Adoption Requests
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Review incoming adopter requests and decide who gets approved for each pet.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            Failed to load adoption requests: {error.message}
          </div>
        )}

        {!error && adoptionRequests.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-white dark:bg-card p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">No adoption requests yet</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              New requests will appear here as adopters click the adopt action on your listings.
            </p>
          </div>
        )}

        {!error && adoptionRequests.length > 0 && (
          <div className="space-y-4">
            {adoptionRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-border bg-white dark:bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      {request.pet?.image_urls?.[0] || request.pet?.image_url ? (
                        <Image
                          src={request.pet?.image_urls?.[0] ?? request.pet?.image_url ?? ''}
                          alt={request.pet?.name ?? 'Pet listing'}
                          width={56}
                          height={56}
                          unoptimized
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-muted" />
                      )}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Requested pet
                        </p>
                        <h2 className="text-xl font-bold text-foreground">
                          {request.pet?.name ?? 'Pet listing'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {request.pet?.breed ?? 'Breed not listed'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        {request.requester_name?.trim() || 'Unnamed adopter'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#145da0] dark:text-sky-300" />
                        {request.requester_email ?? 'No email shared'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#145da0] dark:text-sky-300" />
                        Submitted {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {request.review_note && (
                      <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                        Review note: {request.review_note}
                      </p>
                    )}
                  </div>

                  <div className="md:text-right">
                    {request.status === 'pending' && (
                      <div className="space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <Clock3 className="h-3.5 w-3.5" />
                          Pending
                        </span>
                        <AdoptionRequestReviewActions requestId={request.id} />
                      </div>
                    )}

                    {request.status === 'approved' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approved
                      </span>
                    )}

                    {request.status === 'rejected' && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                        <XCircle className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
