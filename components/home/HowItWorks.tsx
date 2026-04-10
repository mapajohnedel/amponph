import Link from 'next/link'
import { ArrowRight, CalendarDays, FileCheck2, Home, type LucideIcon } from 'lucide-react'

type Step = {
  title: string
  description: string
  cta: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    title: 'Schedule a Visit',
    description: 'Come say hello, meet available pets, and get guidance from the rescue team.',
    cta: 'Schedule a Visit',
    icon: CalendarDays,
  },
  {
    title: 'Fill the Papers',
    description: 'Complete the adoption requirements with a straightforward, transparent process.',
    cta: 'Fill the Papers',
    icon: FileCheck2,
  },
  {
    title: 'Take Them Home',
    description: 'Welcome your new companion and start building your forever-home routine together.',
    cta: 'Take Them Home',
    icon: Home,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#eef7ff] py-20 sm:py-24">
      <div className="site-container">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Bringing a Pet Home &mdash; Here&apos;s How
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            A clear, friendly path from first visit to first cuddle on the couch.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="group flex flex-col gap-6 px-6 py-6 transition-colors duration-300 hover:bg-[#fffaf6] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/20 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="max-w-xl">
                    <p className="mb-1 text-sm font-semibold uppercase tracking-[0.24em] text-[#145da0]/80">
                      Step {index + 1}
                    </p>
                    <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                <Link
                  href="/browse"
                  className="inline-flex items-center gap-3 self-start text-lg font-bold text-[#145da0] transition-transform duration-300 group-hover:translate-x-1"
                >
                  {step.cta}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8e8fb] bg-[#f7fbff]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
