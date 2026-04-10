'use client'

import { useState } from 'react'
import { mockDogs } from '@/lib/mock-dogs'
import { Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dogs' | 'requests'>('dogs')
  const [showAddModal, setShowAddModal] = useState(false)

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

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage dogs, adoption requests, and shelter operations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('dogs')}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'dogs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Manage Dogs
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Adoption Requests
          </button>
        </div>

        {/* Dogs Management Tab */}
        {activeTab === 'dogs' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Dog Listings
                </h2>
                <p className="text-muted-foreground">
                  {mockDogs.length} dogs in your shelter
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={20} />
                Add Dog
              </button>
            </div>

            {/* Dogs Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/5 border-b border-border">
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
                        className="border-b border-border hover:bg-secondary/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {dog.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {dog.breed}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {dog.age}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize text-muted-foreground">
                          {dog.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {dog.location}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Available
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-primary">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-primary">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Dog Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Add New Dog
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Dog Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Buddy"
                        className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Breed
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Labrador"
                        className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="Years"
                          className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Size
                        </label>
                        <select className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary">
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
                      className="flex-1 border border-border text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-secondary/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Add Dog
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Adoption Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                Adoption Requests
              </h2>
              <p className="text-muted-foreground">
                {adoptionRequests.length} pending request{adoptionRequests.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {adoptionRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg border border-border p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {request.userName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Interested in: <span className="font-semibold">{request.dogName}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-sm">
                          <p className="text-muted-foreground">Email</p>
                          <p className="text-foreground font-medium">{request.email}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground">Phone</p>
                          <p className="text-foreground font-medium">{request.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'border border-primary text-primary hover:bg-primary/10'
                        }`}
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button className="px-4 py-2 rounded-lg font-semibold border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
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
      </div>
    </div>
  )
}
