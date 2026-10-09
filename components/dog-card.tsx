'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, MapPin } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { toast } from '@/hooks/use-toast'
import type { Dog } from '@/lib/mock-dogs'

type DogCardProps = {
  dog: Dog
  layout?: 'default' | 'landscape'
}

export function DogCard({ dog, layout = 'default' }: DogCardProps) {
  const router = useRouter()
  const { supabase, user, loading, isAdmin, isPartner } = useAuthUser()
  const isLandscape = layout === 'landscape'
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

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

  useEffect(() => {
    if (!user || isAdmin || isPartner) {
      setIsFavorite(false)
      return
    }

    let cancelled = false

    const loadFavoriteState = async () => {
      const { data, error } = await supabase
        .from('favorite_pets')
        .select('id')
        .eq('user_id', user.id)
        .eq('pet_id', dog.id)
        .maybeSingle()

      if (cancelled || error) {
        return
      }

      setIsFavorite(Boolean(data))
    }

    void loadFavoriteState()

    return () => {
      cancelled = true
    }
  }, [dog.id, isAdmin, isPartner, supabase, user])

  const openDogProfile = () => {
    if (loading) return false
    if (!requireLogin()) {
      return false
    }
    router.push(`/browse/${dog.id}`)
    return true
  }

  const handleCardClick = () => {
    void openDogProfile()
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    void openDogProfile()
  }

  const handleAdoptClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (loading) return
    if (!requireLogin()) return

    router.push(`/browse/${dog.id}`)
  }

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (loading || favoriteLoading) return
    if (!requireLogin()) return
    if (isAdmin || isPartner) {
      toast({
        title: 'Not available',
        description: 'Favorites are for adopter accounts only.',
      })
      return
    }

    setFavoriteLoading(true)
    const nextFavorite = !isFavorite
    setIsFavorite(nextFavorite)

    try {
      const response = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: dog.id,
          petName: dog.name,
          petImage: dog.images?.[0] ?? dog.image ?? null,
        }),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to update favorites.')
      }

      toast({
        title: nextFavorite ? 'Added to favorites' : 'Removed from favorites',
        description: nextFavorite
          ? `${dog.name} is now in your favorites.`
          : `${dog.name} was removed from your favorites.`,
      })
    } catch (caughtError) {
      setIsFavorite(!nextFavorite)
      toast({
        title: 'Favorite update failed',
        description: caughtError instanceof Error ? caughtError.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  const preventCardNavigation = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.PointerEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="group cursor-pointer overflow-hidden rounded-[2rem] border border-[#edf3fb] dark:border-border bg-white dark:bg-card shadow-[0_20px_60px_-36px_rgba(20,44,90,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(20,44,90,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#fff2e7] dark:from-primary/10 to-[#eef7ff] dark:to-sky-400/10 ${
          isLandscape ? 'aspect-[16/9]' : 'h-64 sm:h-72'
        }`}
      >
        <img
          src={dog.image}
          alt={dog.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/90 dark:bg-card/90 p-2.5 shadow-lg backdrop-blur transition-all duration-200 hover:bg-white dark:hover:bg-card"
          onPointerDown={preventCardNavigation}
          onMouseDown={preventCardNavigation}
          onKeyDown={preventCardNavigation}
          onClick={handleFavoriteClick}
          disabled={favoriteLoading || loading}
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}
          />
        </button>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
          {dog.breed}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {dog.name}
          </h3>
          {dog.vaccinated && (
            <span className="rounded-full bg-[#eef7ff] dark:bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-[#145da0] dark:text-sky-300">
              Vaccinated
            </span>
          )}
        </div>

        <p className="mb-3 text-sm text-muted-foreground">
          {dog.age} {dog.age === 1 ? 'year' : 'years'} old
        </p>

        <div className="mb-4 flex gap-2">
          <span className="rounded-full bg-[#fef1e8] dark:bg-primary/15 px-3 py-1.5 text-xs font-semibold capitalize text-primary">
            {dog.size}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="flex-shrink-0 text-[#145da0] dark:text-sky-300" />
          <span>{dog.location}</span>
        </div>

        <button
          type="button"
          onClick={handleAdoptClick}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#145da0] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          Adopt Me
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
