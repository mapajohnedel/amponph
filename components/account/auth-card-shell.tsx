import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type AuthCardShellProps = {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}

export function AuthCardShell({ icon: Icon, title, description, children }: AuthCardShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] dark:bg-[linear-gradient(180deg,var(--page-gradient-from)_0%,var(--page-gradient-to)_100%)] py-12">
      <div className="site-container">
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-white/70 dark:border-white/10 bg-white/90 dark:bg-card/90 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground">
            <Icon className="h-8 w-8 shrink-0 text-primary" />
            {title}
          </h1>
          <p className="mt-3 mb-8 text-base leading-7 text-muted-foreground">{description}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
