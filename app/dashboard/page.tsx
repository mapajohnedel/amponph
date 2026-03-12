'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DogCard } from '@/components/dog-card'
import { useDogCatalog } from '@/lib/dog-catalog'
import { Heart, FileText, Settings, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'requests' | 'profile'>('favorites')
  const dogs = useDogCatalog()

  // Mock favorites and requests
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            My Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your favorites, adoption requests, and profile
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-4 sticky top-20">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                    activeTab === 'profile'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary/10'
                  }`}
                >
                  <Settings size={20} />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-left">
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    My Favorite Dogs
                  </h2>
                  <p className="text-muted-foreground">
                    {favorites.length} saved dog{favorites.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {favorites.map((dog) => (
                      <DogCard key={dog.id} dog={dog} layout="landscape" />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-border p-12 text-center">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      No favorites yet
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Start browsing and save your favorite dogs to see them here
                    </p>
                    <Link
                      href="/browse"
                      className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Browse Dogs
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Adoption Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
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
                        className="bg-white rounded-lg border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {request.dogName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.shelterName}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={14} />
                            Applied on {new Date(request.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && (
                            <>
                              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                              <span className="text-sm font-medium text-yellow-700">
                                Pending
                              </span>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <>
                              <CheckCircle
                                size={20}
                                className="text-green-600"
                              />
                              <span className="text-sm font-medium text-green-600">
                                Approved
                              </span>
                            </>
                          )}
                          {request.status === 'rejected' && (
                            <>
                              <XCircle
                                size={20}
                                className="text-red-600"
                              />
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
                  <div className="bg-white rounded-lg border border-border p-12 text-center">
                    <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      No adoption requests yet
                    </p>
                    <p className="text-muted-foreground">
                      Submit a request to start your adoption journey
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Profile Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage your account information
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-border p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value="John Doe"
                          readOnly
                          className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value="john@example.com"
                          readOnly
                          className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value="(555) 123-4567"
                          readOnly
                          className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value="San Francisco, CA"
                          readOnly
                          className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-foreground">
                          Email notifications for matching dogs
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <span className="text-foreground">
                          Updates on adoption requests
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span className="text-foreground">
                          Monthly newsletter with dog stories
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-border mt-8 pt-8">
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
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
