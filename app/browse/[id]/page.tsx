import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DogGallery } from '@/components/dog-gallery'
import { DogCard } from '@/components/dog-card'
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  HeartHandshake,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Share2,
  Sparkles,
} from 'lucide-react'
import { listPublishedPets } from '@/lib/pets/server'

export default async function DogProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const dogs = await listPublishedPets()
  const dog = dogs.find((entry) => entry.id === id)

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

  const activityLevel = dog.size === 'small'
    ? 'Moderate exercise needs, great for walks and indoor play.'
    : dog.breed.includes('Husky')
      ? 'High energy and happiest with daily exercise and mental stimulation.'
      : 'Moderate to high energy with room for walks, play, and routine.'

  const idealHome = dog.size === 'small'
    ? 'A cozy home or apartment with regular walks and gentle playtime.'
    : dog.size === 'medium'
      ? 'A family home with steady routines and room to explore.'
      : 'A home with more space and adopters ready for bigger-dog exercise needs.'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_42%,#fffaf6_100%)]">
      <div className="site-container py-12">
        <Link
          href="/browse"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft size={20} />
          Back to Browse
        </Link>

        <div className="mb-8 rounded-[2.75rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold text-primary">
                  Meet {dog.name}
                </span>
                {dog.vaccinated && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    Vaccinated
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {dog.name}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground sm:text-2xl">{dog.breed}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#fef1e8] px-4 py-2 text-sm font-semibold text-primary">
                  {dog.age} year{dog.age !== 1 ? 's' : ''} old
                </span>
                <span className="rounded-full bg-muted px-4 py-2 text-sm font-semibold capitalize text-foreground">
                  {dog.gender}
                </span>
                <span className="rounded-full bg-muted px-4 py-2 text-sm font-semibold capitalize text-foreground">
                  {dog.size}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
                  <MapPin className="h-4 w-4 text-[#145da0]" />
                  {dog.location}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[28rem]">
              <a
                href="#contact-shelter"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
              >
                <HeartHandshake className="h-4 w-4" />
                Adopt {dog.name}
              </a>
              <a
                href={`mailto:${dog.shelterEmail}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6e8fb] bg-white px-6 py-3.5 font-semibold text-[#145da0] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Heart className="h-4 w-4" />
                Email Shelter
              </a>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Share2 className="h-4 w-4" />
                More Pets
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-20 grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
          <div className="space-y-8">
            <DogGallery images={dog.images} dogName={dog.name} />

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">About {dog.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Personality, fit, and what makes this pet special.
                  </p>
                </div>
              </div>

              <p className="text-lg leading-8 text-muted-foreground">
                {dog.description || `${dog.name} is waiting for the right adopter to bring comfort, safety, and a loving forever home.`}
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-[#fff8f2] p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Ideal Home</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{idealHome}</p>
                </div>
                <div className="rounded-2xl bg-[#f3f9ff] p-6">
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Activity Level</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{activityLevel}</p>
                </div>
              </div>
            </div>

            {relatedDogs.length > 0 && (
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#145da0]">
                    <PawPrint className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Similar Pets You Might Like</h2>
                    <p className="text-sm text-muted-foreground">
                      More adoptable pets with a similar breed or size.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedDogs.map((relatedDog) => (
                    <DogCard key={relatedDog.id} dog={relatedDog} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8 xl:sticky xl:top-24 xl:self-start">
            <div
              id="contact-shelter"
              className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur"
            >
              <h2 className="text-2xl font-bold text-foreground">Quick Facts</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Breed</span>
                  <span className="font-semibold text-foreground">{dog.breed}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-semibold text-foreground">
                    {dog.age} year{dog.age !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-semibold capitalize text-foreground">{dog.gender}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-semibold capitalize text-foreground">{dog.size}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-muted-foreground">Vaccinated</span>
                  <span className="font-semibold text-foreground">{dog.vaccinated ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Neutered / Spayed</span>
                  <span className="font-semibold text-foreground">{dog.neutered ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur">
              <h2 className="text-2xl font-bold text-foreground">Contact {dog.shelterName}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Reach out to the rescue or shelter to express interest, ask follow-up questions,
                and begin the adoption process.
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${dog.shelterEmail}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  <Mail className="h-4 w-4 text-[#145da0]" />
                  {dog.shelterEmail}
                </a>
                <a
                  href={dog.shelterPhone ? `tel:${dog.shelterPhone}` : '#'}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  <Phone className="h-4 w-4 text-[#145da0]" />
                  {dog.shelterPhone || 'Phone number not listed yet'}
                </a>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm font-medium text-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#145da0]" />
                  {dog.location}
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[#fff8f2] p-6">
                <h3 className="text-lg font-semibold text-foreground">Adoption Process</h3>
                <ol className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                  <li>1. Express interest and introduce your household.</li>
                  <li>2. Coordinate with the rescue team for screening or questions.</li>
                  <li>3. Arrange a meet-and-greet or adoption next steps.</li>
                  <li>4. Finalize the adoption and welcome your new companion home.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
