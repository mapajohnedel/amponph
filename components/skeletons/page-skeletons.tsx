import { cn } from '@/lib/utils'

const panelClass =
  'rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_70px_-36px_rgba(20,44,90,0.35)] backdrop-blur'

export function Bone({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton-shimmer rounded-full', className)} />
}

function LoadingStatus({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>
}

export function PetCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#edf3fb] bg-white shadow-[0_20px_60px_-36px_rgba(20,44,90,0.32)]">
      <Bone className="h-64 rounded-none sm:h-72" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <Bone className="h-6 w-1/2" />
          <Bone className="h-6 w-20" />
        </div>
        <Bone className="h-4 w-24" />
        <Bone className="h-7 w-16" />
        <Bone className="h-4 w-2/3" />
        <Bone className="h-10 w-32" />
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_45px_-28px_rgba(20,44,90,0.28)] backdrop-blur">
      <div className="mb-5 flex items-center gap-3">
        <Bone className="h-9 w-9 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Bone className="h-4 w-24" />
          <Bone className="h-3 w-32" />
        </div>
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="mb-5 space-y-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <Bone className="h-10 w-full" />
    </div>
  )
}

export function BrowsePageSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_42%,#fffaf6_100%)]">
      <section className="pb-16 pt-12" aria-busy="true">
        <LoadingStatus label="Loading pets" />
        <div className="site-container">
          <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="space-y-4">
              <FilterSkeleton />
              <div className="hidden rounded-[1.5rem] border border-white/70 bg-white/80 p-4 lg:block">
                <Bone className="mb-3 h-10 w-10 rounded-xl" />
                <Bone className="h-4 w-32" />
                <Bone className="mt-3 h-3 w-full" />
                <Bone className="mt-2 h-3 w-4/5" />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <PetCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function PetDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_42%,#fffaf6_100%)]">
      <div className="site-container py-12" aria-busy="true">
        <LoadingStatus label="Loading pet profile" />
        <Bone className="mb-8 h-5 w-36" />

        <div className={cn(panelClass, 'mb-8 rounded-[2.75rem] p-8 sm:p-10')}>
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl flex-1 space-y-4">
              <div className="flex gap-3">
                <Bone className="h-8 w-28" />
                <Bone className="h-8 w-28" />
              </div>
              <Bone className="h-12 w-2/3 rounded-2xl" />
              <Bone className="h-6 w-1/3" />
              <div className="flex flex-wrap gap-3 pt-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Bone key={index} className="h-9 w-24" />
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:w-[28rem]">
              {Array.from({ length: 3 }, (_, index) => (
                <Bone key={index} className="h-20 rounded-[1.5rem]" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
          <div className="space-y-8">
            <Bone className="h-96 rounded-2xl sm:h-[600px] lg:h-[650px]" />
            <div className={cn(panelClass, 'space-y-3 p-8')}>
              <Bone className="h-6 w-40" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-8">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className={cn(panelClass, 'space-y-4 p-8')}>
                <Bone className="h-6 w-32" />
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-5/6" />
                <Bone className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12" aria-busy="true">
        <LoadingStatus label="Loading page" />
        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <Bone className="h-7 w-36" />
          <Bone className="mt-6 h-11 w-2/3 rounded-2xl sm:w-1/2" />
          <Bone className="mt-4 h-5 w-full max-w-3xl" />
          <Bone className="mt-2 h-5 w-4/5 max-w-2xl" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-border p-5 last:border-b-0">
              <Bone className="h-14 w-14 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-1/3" />
                <Bone className="h-3 w-1/2" />
              </div>
              <Bone className="hidden h-8 w-24 sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)]">
      <div className="site-container py-12" aria-busy="true">
        <LoadingStatus label="Loading page" />
        <div className="grid items-center gap-10 py-8 lg:grid-cols-2">
          <div className="space-y-5">
            <Bone className="h-8 w-44" />
            <Bone className="h-14 w-full rounded-2xl" />
            <Bone className="h-14 w-4/5 rounded-2xl" />
            <Bone className="h-5 w-full" />
            <Bone className="h-5 w-3/4" />
            <div className="flex gap-4 pt-2">
              <Bone className="h-12 w-40" />
              <Bone className="h-12 w-40" />
            </div>
          </div>
          <Bone className="h-80 rounded-[2.5rem] lg:h-[28rem]" />
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
