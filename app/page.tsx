import Link from 'next/link'
import { ArrowRight, Heart, HeartHandshake, Home as HomeIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { PetCard } from '@/components/home/PetCard'
import { listPublishedPets } from '@/lib/pets/server'

const trustPoints = [
  {
    title: 'Verified rescues',
    description: 'Every listing is reviewed so families can adopt with confidence.',
    icon: ShieldCheck,
  },
  {
    title: 'Simple process',
    description: 'Clear steps make it easier to meet, apply, and bring a pet home.',
    icon: Sparkles,
  },
  {
    title: 'Made for matches',
    description: 'We highlight temperament, size, and lifestyle fit to help you choose well.',
    icon: HeartHandshake,
  },
]

const successStoryHighlights = [
  {
    title: 'Second chances matter',
    description:
      'Every rescue story begins with patience, healing, and one kind person willing to open their home.',
    icon: Heart,
  },
  {
    title: 'A loving tahanan changes everything',
    description:
      'When a dog feels safe and loved, they learn to trust again and become part of a real family.',
    icon: HomeIcon,
  },
]

const happyTails = [
  {
    name: 'Luna',
    status: 'Adopted',
    story:
      'From shy rescue to playful best friend, Luna now spends her days surrounded by love and gentle care.',
    location: 'Quezon City',
  },
  {
    name: 'Buddy',
    status: 'Fostered',
    story:
      'Buddy found comfort in a foster home where he could rest, heal, and slowly learn to trust people again.',
    location: 'Cebu City',
  },
  {
    name: 'Mochi',
    status: 'Adopted',
    story:
      'Mochi now wakes up to warm hugs, daily walks, and a family that chose kindness and a second chance.',
    location: 'Davao City',
  },
]

export default async function Home() {
  const { data: dogs } = await listPublishedPets()
  const featuredDogs = dogs.slice(0, 4)

  return (
    <div className="min-h-screen bg-white dark:bg-card">
      <Hero dogs={featuredDogs} />

      <section
        id="success-stories"
        className="relative py-24 sm:py-32"
      >
        <div className="site-container relative">
          <div className="grid gap-16 xl:grid-cols-2 xl:items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                  Success Stories
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-5xl">
                  Stories of rescue, healing, and happy new beginnings.
                </h2>
                <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Every rescued dog has a story of waiting, healing, and hoping for love. Here
                  at AmponPH, we celebrate the beautiful moments when dogs find a safe and caring
                  tahanan through the kindness of people who choose to adopt. These stories
                  remind us that second chances can change a life.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/browse"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-slate-700 px-6 font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-slate-600"
                >
                  Be Part of the Mission
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/partner/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card px-6 font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-muted"
                >
                  For Shelters
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
              {successStoryHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-foreground">{title}</h3>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-24">
            <div className="mb-10 max-w-2xl space-y-4">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
                Meet the dogs who found loving homes.
              </h3>
              <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                Here are some of the adopted and fostered dogs whose journeys inspire the
                AmponPH community.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {happyTails.map((story) => (
                <div
                  key={story.name}
                  className="flex flex-col rounded-3xl border border-slate-100 dark:border-border bg-slate-50 dark:bg-muted p-8 transition-all hover:bg-slate-100 dark:hover:bg-muted"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-foreground">{story.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{story.location}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        story.status === 'Adopted'
                          ? 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300'
                          : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {story.status}
                    </span>
                  </div>

                  <p className="flex-1 leading-relaxed text-slate-600 dark:text-slate-300">{story.story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section id="featured-pets" className="bg-slate-50 dark:bg-muted py-24 sm:py-32">
        <div className="site-container">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl">
                Meet friendly faces waiting for you.
              </h2>
              <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                A few lovable companions to get your search started, with quick details that make
                it easy to take the next step.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex h-12 items-center gap-2 self-start rounded-full border border-slate-200 dark:border-border bg-white dark:bg-card px-6 font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-muted hover:text-slate-900 dark:hover:text-foreground"
            >
              Explore all pets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredDogs.map((dog) => (
              <PetCard key={dog.id} dog={dog} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white dark:bg-card py-24 sm:py-32">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-700 px-6 py-16 shadow-2xl sm:px-12 sm:py-20 lg:px-20">
            {/* Subtle light effects instead of harsh gradients */}
            <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center gap-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 dark:bg-slate-600 px-4 py-1.5 text-sm font-medium text-slate-300">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  Ready when you are
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Give a pet a second chance at life.
                </h2>
                <p className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-300">
                  Start browsing adoptable pets and take the first step toward a life-changing connection.
                </p>
              </div>

              <Link
                href="/browse"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-500 px-8 text-lg font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                Start Adopting
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
