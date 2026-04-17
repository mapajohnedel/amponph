'use client'

import { useRouter } from 'next/navigation'
import { HeartHandshake } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { toast } from '@/hooks/use-toast'

type AdoptActionButtonProps = {
  petName: string
}

export function AdoptActionButton({ petName }: AdoptActionButtonProps) {
  const router = useRouter()
  const { user, loading } = useAuthUser()

  const handleClick = () => {
    if (loading) return

    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login first to continue with adoption.',
        className: 'border-amber-200 bg-amber-50 text-amber-900',
      })
      router.push('/auth')
      return
    }

    const contactSection = document.getElementById('contact-shelter')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.location.hash = '#contact-shelter'
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <HeartHandshake className="h-4 w-4" />
      Adopt {petName}
    </button>
  )
}
