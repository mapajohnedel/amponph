'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthUser } from '@/hooks/use-auth-user'
import { Heart, FileText, Settings, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react'
import { navigateAfterAuthChange } from '@/lib/auth/navigation'

type AdoptionRequestRow = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  partner_user_id: string
  pet_name: string | null
  pet_image_url: string | null
}

type DashboardAdoptionRequest = {
  id: string
  dogName: string
  dogImageUrl: string | null
  shelterName: string
  partnerContactName: string
  partnerEmail: string
  partnerPhone: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
}

type FavoriteRow = {
  pet_id: string
  created_at: string
  pet_name_snapshot: string
  pet_image_snapshot: string | null
  pets:
    | {
        id: string
        breed: string
        location: string
        image_url: string | null
        image_urls: string[] | null
      }
    | {
        id: string
        breed: string
        location: string
        image_url: string | null
        image_urls: string[] | null
      }[]
    | null
}

type DashboardFavorite = {
  petId: string
  name: string
  imageUrl: string | null
  breed: string
  location: string
  savedAt: string
}

type PublicPartnerContactProfile = {
  user_id: string
  organization_name: string
  contact_person_name: string
  email: string
  phone: string
}

function getSingleRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null
  }

  return Array.isArray(value) ? value[0] ?? null : value
}

function RequestOutcomeModal({
  status,
  dogName,
  shelterName,
  partnerContactName,
  partnerEmail,
  partnerPhone,
}: {
  status: 'approved' | 'rejected'
  dogName: string
  shelterName: string
  partnerContactName: string
  partnerEmail: string
  partnerPhone: string
}) {
  const isApproved = status === 'approved'
  const hasEmail = partnerEmail.includes('@')
  const hasPhone = !partnerPhone.toLowerCase().includes('no phone')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            isApproved
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          View update
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isApproved ? 'Congratulations, you have been chosen!' : 'Update on your request'}
          </DialogTitle>
          <DialogDescription>
            {isApproved
              ? `Your request for ${dogName} was approved.`
              : `Sorry, your request for ${dogName} was rejected.`}
          </DialogDescription>
        </DialogHeader>

        {isApproved ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="mb-3 text-sm font-semibold text-emerald-700">Next Steps</p>
              <ul className="space-y-2 text-sm text-foreground">
                <li>✅ Contact the rescuer</li>
                <li>📅 Schedule a visit</li>
                <li>🐾 Meet the pet</li>
                <li>❤️ Complete adoption</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm">
              <p className="font-semibold text-foreground">{shelterName}</p>
              <p className="mt-1 text-muted-foreground">Contact person: {partnerContactName}</p>
              <p className="mt-1 text-muted-foreground">
                Email:{' '}
                {hasEmail ? (
                  <a href={`mailto:${partnerEmail}`} className="font-medium text-[#145da0] hover:underline">
                    {partnerEmail}
                  </a>
                ) : (
                  <span>{partnerEmail}</span>
                )}
              </p>
              <p className="mt-1 text-muted-foreground">
                Phone:{' '}
                {hasPhone ? (
                  <a href={`tel:${partnerPhone}`} className="font-medium text-[#145da0] hover:underline">
                    {partnerPhone}
                  </a>
                ) : (
                  <span>{partnerPhone}</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-100 bg-red-50/60 p-4 text-sm text-red-700">
            The partner selected another adopter for now. You can still browse and submit new
            requests for other pets.
          </div>
        )}

        <DialogFooter>
          <span className="text-xs text-muted-foreground">
            {isApproved ? 'Wishing you and your new pet a happy journey.' : 'Thank you for your interest in adopting.'}
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { supabase, user, loading, isAdmin, isPartner } = useAuthUser()
  const [activeTab, setActiveTab] = useState<'favorites' | 'requests' | 'profile'>('favorites')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [favorites, setFavorites] = useState<DashboardFavorite[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  const [favoritesError, setFavoritesError] = useState<string | null>(null)
  const [adoptionRequests, setAdoptionRequests] = useState<DashboardAdoptionRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [requestsError, setRequestsError] = useState<string | null>(null)
  const displayName = user?.user_metadata?.full_name ?? 'Your profile'
  const displayEmail = user?.email ?? 'Add your email'
  const displayPhone = user?.user_metadata?.phone ?? 'Add your phone number'
  const displayCity = user?.user_metadata?.city ?? 'Add your city'

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }

    if (!loading && user && isAdmin) {
      router.replace('/admin')
    }

    if (!loading && user && isPartner) {
      router.replace('/partner')
    }
  }, [isAdmin, isPartner, loading, router, user])

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '')

      if (hash === 'requests' || hash === 'profile' || hash === 'favorites') {
        setActiveTab(hash)
      }
    }

    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)

    return () => {
      window.removeEventListener('hashchange', syncTabFromHash)
    }
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    navigateAfterAuthChange('/auth')
  }

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user || isAdmin || isPartner) {
      setFavorites([])
      setFavoritesLoading(false)
      setFavoritesError(null)
      return
    }

    let cancelled = false

    const loadFavorites = async () => {
      setFavoritesLoading(true)
      setFavoritesError(null)

      const { data, error } = await supabase
        .from('favorite_pets')
        .select(
          'pet_id, created_at, pet_name_snapshot, pet_image_snapshot, pets(id, breed, location, image_url, image_urls)'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cancelled) {
        return
      }

      if (error) {
        setFavoritesError(error.message)
        setFavorites([])
        setFavoritesLoading(false)
        return
      }

      const mapped = ((data ?? []) as FavoriteRow[]).map((favorite) => {
        const pet = getSingleRelation(favorite.pets)
        return {
          petId: favorite.pet_id,
          name: favorite.pet_name_snapshot,
          imageUrl:
            pet?.image_urls?.[0] ?? pet?.image_url ?? favorite.pet_image_snapshot ?? null,
          breed: pet?.breed ?? 'Breed unavailable',
          location: pet?.location ?? 'Location unavailable',
          savedAt: favorite.created_at,
        }
      })

      setFavorites(mapped)
      setFavoritesLoading(false)
    }

    void loadFavorites()

    return () => {
      cancelled = true
    }
  }, [isAdmin, isPartner, loading, supabase, user])

  const handleRemoveFavorite = async (petId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petId }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to remove favorite.')
      }

      setFavorites((current) => current.filter((favorite) => favorite.petId !== petId))
    } catch (caughtError) {
      setFavoritesError(
        caughtError instanceof Error ? caughtError.message : 'Unable to remove favorite.'
      )
    }
  }

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user || isAdmin || isPartner) {
      setAdoptionRequests([])
      setRequestsLoading(false)
      setRequestsError(null)
      return
    }

    let cancelled = false

    const loadAdoptionRequests = async () => {
      setRequestsLoading(true)
      setRequestsError(null)

      const { data, error } = await supabase.rpc('get_requester_adoption_requests_details')

      if (cancelled) {
        return
      }

      if (error) {
        setRequestsError(error.message)
        setAdoptionRequests([])
        setRequestsLoading(false)
        return
      }

      const requestRows = (data ?? []) as AdoptionRequestRow[]
      const partnerIds = Array.from(new Set(requestRows.map((request) => request.partner_user_id)))
      let profileByUserId = new Map<string, PublicPartnerContactProfile>()

      if (partnerIds.length > 0) {
        const { data: partnerProfiles, error: partnerProfilesError } = await supabase.rpc(
          'get_public_partner_contact_profiles',
          {
            partner_ids: partnerIds,
          }
        )

        if (partnerProfilesError) {
          setRequestsError(partnerProfilesError.message)
          setAdoptionRequests([])
          setRequestsLoading(false)
          return
        }

        profileByUserId = new Map(
          ((partnerProfiles ?? []) as PublicPartnerContactProfile[]).map((profile) => [
            profile.user_id,
            profile,
          ])
        )
      }

      const mapped = requestRows.map((request) => {
        const partnerProfile = profileByUserId.get(request.partner_user_id)

        return {
          id: request.id,
          dogName: request.pet_name ?? 'Pet listing',
          dogImageUrl: request.pet_image_url ?? null,
          shelterName: partnerProfile?.organization_name ?? 'Partner organization',
          partnerContactName: partnerProfile?.contact_person_name ?? 'Partner representative',
          partnerEmail: partnerProfile?.email ?? 'No email available',
          partnerPhone: partnerProfile?.phone ?? 'No phone listed',
          status: request.status,
          date: request.created_at,
        }
      })

      setAdoptionRequests(mapped)
      setRequestsLoading(false)
    }

    void loadAdoptionRequests()

    return () => {
      cancelled = true
    }
  }, [isAdmin, isPartner, loading, supabase, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="site-container py-12">
          <div className="rounded-3xl border border-border bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">Loading your dashboard...</h1>
            <p className="mt-3 text-muted-foreground">
              Checking your session and preparing your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (isAdmin || isPartner) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            My Dashboard
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your favorites, adoption requests, and profile
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-lg border border-border bg-white p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors flex items-center gap-3 ${
                    activeTab === 'favorites'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary/10'
                  }`}
                >
                  <Heart size={20} />
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors flex items-center gap-3 ${
                    activeTab === 'requests'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary/10'
                  }`}
                >
                  <FileText size={20} />
                  Adoption Requests
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors flex items-center gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary/10'
                  }`}
                >
                  <Settings size={20} />
                  Profile Settings
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={20} />
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'favorites' && (
              <div>
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    My Favorite Dogs
                  </h2>
                  {!favoritesLoading && !favoritesError && (
                    <p className="text-muted-foreground">
                      {favorites.length} saved dog{favorites.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {favoritesLoading ? (
                  <div className="rounded-lg border border-border bg-white p-8">
                    <p className="text-sm text-muted-foreground">Loading your favorites...</p>
                  </div>
                ) : favoritesError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-8">
                    <p className="text-sm text-red-700">Failed to load favorites: {favoritesError}</p>
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {favorites.map((favorite) => (
                      <div
                        key={favorite.petId}
                        className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                      >
                        <div className="flex items-start gap-4 p-4">
                          {favorite.imageUrl ? (
                            <Image
                              src={favorite.imageUrl}
                              alt={favorite.name}
                              width={64}
                              height={64}
                              unoptimized
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-muted" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-semibold text-foreground">
                              {favorite.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{favorite.breed}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{favorite.location}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Saved on {new Date(favorite.savedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-border px-4 py-3">
                          <Link
                            href={`/browse/${favorite.petId}`}
                            className="text-sm font-medium text-[#145da0] transition-colors hover:text-primary"
                          >
                            View pet
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveFavorite(favorite.petId)}
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-white p-12 text-center">
                    <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium text-foreground">
                      No favorites yet
                    </p>
                    <p className="mb-6 text-muted-foreground">
                      Start browsing and save your favorite dogs to see them here
                    </p>
                    <Link
                      href="/browse"
                      className="inline-block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Browse Dogs
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Adoption Requests
                  </h2>
                  {!requestsLoading && !requestsError && (
                    <p className="text-muted-foreground">
                      {adoptionRequests.length} request{adoptionRequests.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {requestsLoading ? (
                  <div className="rounded-lg border border-border bg-white p-8">
                    <p className="text-sm text-muted-foreground">Loading your adoption requests...</p>
                  </div>
                ) : requestsError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-8">
                    <p className="text-sm text-red-700">
                      Failed to load adoption requests: {requestsError}
                    </p>
                  </div>
                ) : adoptionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {adoptionRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-1 items-start gap-3">
                          {request.dogImageUrl ? (
                            <Image
                              src={request.dogImageUrl}
                              alt={request.dogName}
                              width={52}
                              height={52}
                              unoptimized
                              className="h-[52px] w-[52px] rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-[52px] w-[52px] rounded-lg bg-muted" />
                          )}
                          <div>
                            <h3 className="mb-1 text-lg font-semibold text-foreground">
                              {request.dogName}
                            </h3>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {request.shelterName}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={14} />
                              Applied on {new Date(request.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && (
                            <>
                              <div className="h-3 w-3 rounded-full bg-yellow-400" />
                              <span className="text-sm font-medium text-yellow-700">
                                Pending
                              </span>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <div className="flex flex-col items-start gap-2 sm:items-end">
                              <span className="inline-flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                  Approved
                                </span>
                              </span>
                              <RequestOutcomeModal
                                status="approved"
                                dogName={request.dogName}
                                shelterName={request.shelterName}
                                partnerContactName={request.partnerContactName}
                                partnerEmail={request.partnerEmail}
                                partnerPhone={request.partnerPhone}
                              />
                            </div>
                          )}
                          {request.status === 'rejected' && (
                            <div className="flex flex-col items-start gap-2 sm:items-end">
                              <span className="inline-flex items-center gap-2">
                                <XCircle size={20} className="text-red-600" />
                                <span className="text-sm font-medium text-red-600">
                                  Rejected
                                </span>
                              </span>
                              <RequestOutcomeModal
                                status="rejected"
                                dogName={request.dogName}
                                shelterName={request.shelterName}
                                partnerContactName={request.partnerContactName}
                                partnerEmail={request.partnerEmail}
                                partnerPhone={request.partnerPhone}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-white p-12 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium text-foreground">
                      No adoption requests yet
                    </p>
                    <p className="text-muted-foreground">
                      Submit a request to start your adoption journey
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">
                    Profile Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your account information
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-white p-8">
                  <div className="mb-8">
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      Personal Information
                    </h3>
                    <div className="mb-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          readOnly
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={displayEmail}
                          readOnly
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={displayPhone}
                          readOnly
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">
                          City
                        </label>
                        <input
                          type="text"
                          value={displayCity}
                          readOnly
                          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-foreground">
                          Email notifications for matching dogs
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" defaultChecked className="h-4 w-4" />
                        <span className="text-foreground">
                          Updates on adoption requests
                        </span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" className="h-4 w-4" />
                        <span className="text-foreground">
                          Monthly newsletter with dog stories
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
