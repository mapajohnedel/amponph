import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type StatusPageProps = {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  actions: ReactNode
}

export function StatusPage({ icon: Icon, eyebrow, title, description, actions }: StatusPageProps) {
  return (
    <div className="flex min-h-[70vh] items-center bg-background py-16">
      <div className="site-container">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>
        </div>
      </div>
    </div>
  )
}

export const primaryActionClass =
  'inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90'

export const secondaryActionClass =
  'inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted'
