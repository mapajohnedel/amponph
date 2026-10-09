'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HeartHandshake } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { toast } from '@/hooks/use-toast'

type AdoptActionButtonProps = {
  petId: string
  petName: string
}

export function AdoptActionButton({ petId, petName }: AdoptActionButtonProps) {
  const router = useRouter()
  const { user, loading } = useAuthUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClick = async () => {
    if (loading || isSubmitting) return

    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login first to continue with adoption.',
        className: 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300',
      })
      router.push('/auth')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/adoption-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petId }),
      })

      const payload = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to submit your adoption request.')
      }

      toast({
        title: 'Request submitted',
        description:
          payload.message ?? `Your request for ${petName} is pending partner approval.`,
      })
      router.push('/dashboard#requests')
      router.refresh()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to submit your adoption request.'
      toast({
        title: 'Request failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || isSubmitting}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <HeartHandshake className="h-4 w-4" />
      {isSubmitting ? 'Submitting request...' : `Adopt ${petName}`}
    </button>
  )
}
