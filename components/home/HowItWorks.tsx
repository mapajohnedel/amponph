import Link from 'next/link'
import { ArrowRight, CalendarDays, FileCheck2, Home, Search, type LucideIcon } from 'lucide-react'

type Step = {
  title: string
  description: string
  cta: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    title: 'Browse and Choose',
    description:
      'Start on AmponPH by browsing adoptable pets. Take your time, read each profile, and see who you might want to foster or adopt when you are ready.',
    cta: 'Browse Pets',
    icon: Search,
  },
  {
    title: 'Apply & Get Approved',
    description: 'Submit an adoption application for your chosen pet. The partner shelter or rescuer will review it to ensure a great match.',
    cta: 'Apply Now',
    icon: FileCheck2,
  },
  {
    title: 'Schedule a Visit',
    description: 'Once approved, schedule a time to come say hello, meet your potential new pet, and get guidance from the rescue team.',
    cta: 'Schedule a Visit',
    icon: CalendarDays,
  },
  {
    title: 'Take Them Home',
    description: 'Finalize any remaining requirements, welcome your new companion, and start building your forever-home routine.',
    cta: 'Take Them Home',
    icon: Home,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-muted py-24 sm:py-32">
      <div className="site-container">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            How it works
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-5xl">
            Bringing a Pet Home &mdash; Here&apos;s How
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A clear, friendly path from browsing pets you love to your first cuddle on the couch.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-muted" />
            
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-sm border border-slate-100 dark:border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md z-10">
                    <Icon className="h-10 w-10 text-orange-500" />
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-700 text-sm font-bold text-white shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-foreground">{step.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.description}</p>

                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 transition-colors hover:text-orange-700 dark:hover:text-orange-300 mt-auto"
                  >
                    {step.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
