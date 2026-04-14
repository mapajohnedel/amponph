'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DogCard } from '@/components/dog-card'
import { useDogCatalog } from '@/lib/dog-catalog'
import { useAuthUser } from '@/hooks/use-auth-user'
import { Heart, FileText, Settings, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { supabase, user, loading } = useAuthUser()
  const [activeTab, setActiveTab] = useState<'favorites' | 'requests' | 'profile'>('favorites')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const dogs = useDogCatalog()
  const displayName = user?.user_metadata?.full_name ?? 'Your profile'
  const displayEmail = user?.email ?? 'Add your email'
  const displayPhone = user?.user_metadata?.phone ?? 'Add your phone number'
  const displayCity = user?.user_metadata?.city ?? 'Add your city'

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [loading, router, user])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.replace('/auth')
    router.refresh()
  }

  // Mock favorites and requests until the Supabase data layer is added.
  const favorites = dogs.slice(0, 4)
  const adoptionRequests = [
    {
      id: 1,
      dogName: 'Max',
      shelterName: 'Bay Area Dog Rescue',
      status: 'pending',
      date: '2024-03-10',
    },
    {
      id: 2,
      dogName: 'Luna',
      shelterName: 'Seattle Animal Shelter',
      status: 'approved',
      date: '2024-03-05',
    },
    {
      id: 3,
      dogName: 'Charlie',
      shelterName: 'Portland Rescue Dogs',
      status: 'rejected',
      date: '2024-02-28',
    },
  ]

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
                  <p className="text-muted-foreground">
                    {favorites.length} saved dog{favorites.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {favorites.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {favorites.map((dog) => (
                      <DogCard key={dog.id} dog={dog} layout="landscape" />
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
                  <p className="text-muted-foreground">
                    {adoptionRequests.length} request{adoptionRequests.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {adoptionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {adoptionRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
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
                            <>
                              <CheckCircle size={20} className="text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                Approved
                              </span>
                            </>
                          )}
                          {request.status === 'rejected' && (
                            <>
                              <XCircle size={20} className="text-red-600" />
                              <span className="text-sm font-medium text-red-600">
                                Rejected
                              </span>
                            </>
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

                  <div className="mt-8 border-t border-border pt-8">
                    <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                      Save Changes
                    </button>
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
