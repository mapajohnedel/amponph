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
        className: 'border-amber-200 bg-amber-50 text-amber-900',
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

    router.push(`/browse/${dog.id}#contact-shelter`)
  }

  return (
    <Link href={`/browse/${dog.id}`} className="group block" onClick={handleCardClick}>
      <article className="overflow-hidden rounded-[2rem] border border-[#edf3fb] bg-white shadow-[0_20px_60px_-36px_rgba(20,44,90,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(20,44,90,0.45)]">
        <div className="relative aspect-[4/4.5] overflow-hidden bg-gradient-to-br from-[#fff2e7] to-[#eef7ff]">
          <Image
            src={dog.image}
            alt={dog.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            {dog.breed}
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{dog.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dog.age} {dog.age === 1 ? 'year' : 'years'} old
                </p>
              </div>

              <span className="rounded-full bg-[#fef1e8] px-3 py-1 text-xs font-semibold capitalize text-primary">
                {dog.size}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-[#145da0]" />
              <span>{dog.location}</span>
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{dog.description}</p>

          <button
            type="button"
            onClick={handleAdoptClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#145da0] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
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
