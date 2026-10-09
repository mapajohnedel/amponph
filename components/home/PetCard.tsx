'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, MapPin } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { toast } from '@/hooks/use-toast'
import type { Dog } from '@/lib/mock-dogs'

type PetCardProps = {
  dog: Dog
}

export function PetCard({ dog }: PetCardProps) {
  const router = useRouter()
  const { user, loading } = useAuthUser()

  const requireLogin = () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login first to continue with adoption.',
        className: 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300',
      })
      router.push('/auth')
      return false
    }
    return true
  }

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault()
      return
    }

    if (!requireLogin()) {
      event.preventDefault()
    }
  }

  const handleAdoptClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (loading) return
    if (!requireLogin()) return

    router.push(`/browse/${dog.id}`)
  }

  return (
    <Link href={`/browse/${dog.id}`} className="group block h-full" onClick={handleCardClick}>
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 dark:hover:border-border">
        <div className="relative aspect-[4/4.5] overflow-hidden bg-slate-100 dark:bg-muted">
          <Image
            src={dog.image}
            alt={dog.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-card/90 px-3 py-1 text-xs font-semibold text-slate-900 dark:text-foreground shadow-sm backdrop-blur-md">
            {dog.breed}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-foreground line-clamp-1">{dog.name}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {dog.age} {dog.age === 1 ? 'year' : 'years'} old
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-slate-100 dark:bg-muted px-3 py-1 text-xs font-semibold capitalize text-slate-700 dark:text-slate-200">
                {dog.size}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{dog.location}</span>
            </div>
          </div>

          <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 flex-1">{dog.description}</p>

          <button
            type="button"
            onClick={handleAdoptClick}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            Adopt Me
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </article>
    </Link>
  )
}
