'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DogGallery } from '@/components/dog-gallery'
import { DogCard } from '@/components/dog-card'
import { getDogById } from '@/lib/mock-dogs'
import { useDogCatalog } from '@/lib/dog-catalog'
import { CheckCircle, Mail, Phone, MapPin, Heart, Share2, ArrowLeft } from 'lucide-react'

export default function DogProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const dogs = useDogCatalog()
  const dog = getDogById(params.id, dogs)

  if (!dog) {
    notFound()
  }

  // Get related dogs (same breed or similar)
  const relatedDogs = dogs
    .filter(
      (d) =>
        d.id !== dog.id &&
        (d.breed === dog.breed || d.size === dog.size)
    )
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-12 font-semibold text-lg"
        >
          <ArrowLeft size={20} />
          Back to Browse
        </Link>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Left Column - Gallery (Larger) */}
          <div className="lg:col-span-2">
            <DogGallery images={dog.images} dogName={dog.name} />
          </div>

          {/* Right Column - Details Card */}
          <div>
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl border border-border p-8 mb-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {dog.name}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {dog.breed}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-secondary/20 text-secondary-foreground text-sm font-semibold px-4 py-2 rounded-full">
                  {dog.age} year{dog.age !== 1 ? 's' : ''} old
                </span>
                <span className="bg-muted text-foreground text-sm font-semibold px-4 py-2 rounded-full capitalize">
                  {dog.gender}
                </span>
                <span className="bg-muted text-foreground text-sm font-semibold px-4 py-2 rounded-full capitalize">
                  {dog.size}
                </span>
                {dog.vaccinated && (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1">
                    <CheckCircle size={16} />
                    Vaccinated
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-muted-foreground mb-8 text-lg">
                <MapPin size={20} className="flex-shrink-0" />
                <span>{dog.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
                  Adopt {dog.name}
                </button>
                <button className="w-full border-2 border-primary text-primary px-6 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2">
                  <Heart size={20} />
                  Save to Favorites
                </button>
                <button className="w-full border border-border text-foreground px-6 py-4 rounded-xl font-semibold hover:bg-muted transition-colors duration-200 flex items-center justify-center gap-2">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Health & Care Info Card */}
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Health & Care
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-muted-foreground">Vaccinated</span>
                  <span className="font-semibold text-foreground">
                    {dog.vaccinated ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Neutered/Spayed</span>
                  <span className="font-semibold text-foreground">
                    {dog.neutered ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-2xl border border-border p-10 mb-20 shadow-sm">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            About {dog.name}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            {dog.description}
          </p>

          {/* Personality/Additional Info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-secondary/5 rounded-2xl p-8">
              <h3 className="font-bold text-lg text-foreground mb-4">
                Ideal Family
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Perfect for families with{' '}
                {dog.size === 'small'
                  ? 'apartments and smaller spaces'
                  : dog.size === 'medium'
                    ? 'average-sized homes'
                    : 'larger homes with space to run'}{' '}
                and time for regular exercise.
              </p>
            </div>
            <div className="bg-secondary/5 rounded-2xl p-8">
              <h3 className="font-bold text-lg text-foreground mb-4">
                Activity Level
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {dog.size === 'small'
                  ? 'Moderate exercise needs, great for walks and play'
                  : dog.breed.includes('Husky')
                    ? 'High energy, needs daily exercise and mental stimulation'
                    : 'Moderate to high energy, enjoys outdoor activities'}
              </p>
            </div>
          </div>
        </div>

        {/* Shelter/Contact Section */}
        <div className="bg-white rounded-2xl border border-border p-10 mb-20 shadow-sm">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Contact {dog.shelterName}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                {dog.shelterName}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {dog.shelterName} is committed to finding the perfect match
                between dogs and families.
              </p>
              <div className="space-y-4">
                <a
                  href={`mailto:${dog.shelterEmail}`}
                  className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity font-medium"
                >
                  <Mail size={20} className="flex-shrink-0" />
                  {dog.shelterEmail}
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity font-medium"
                >
                  <Phone size={20} className="flex-shrink-0" />
                  1-800-RESCUE-1
                </a>
              </div>
            </div>
            <div className="bg-muted rounded-2xl p-8">
              <h3 className="font-bold text-lg text-foreground mb-5">
                Adoption Process
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-lg text-primary flex-shrink-0 w-8">1.</span>
                  <span className="text-muted-foreground">Click "Adopt" to express interest</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-lg text-primary flex-shrink-0 w-8">2.</span>
                  <span className="text-muted-foreground">Complete adoption application</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-lg text-primary flex-shrink-0 w-8">3.</span>
                  <span className="text-muted-foreground">Meet with shelter staff</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-lg text-primary flex-shrink-0 w-8">4.</span>
                  <span className="text-muted-foreground">Finalize and take home!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Related Dogs */}
        {relatedDogs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-10">
              Similar Dogs You Might Like
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedDogs.map((relatedDog) => (
                <DogCard key={relatedDog.id} dog={relatedDog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
