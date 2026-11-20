'use client'

import Link from 'next/link'
import { type FormEvent, useMemo, useState } from 'react'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { AuthCardShell } from '@/components/account/auth-card-shell'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setIsSubmitting(false)

    if (error) {
      console.error('Failed to send password reset email.', error)
      setErrorMessage('We could not send the reset email right now. Please try again in a few minutes.')
      return
    }

    setSent(true)
  }

  return (
    <AuthCardShell
      icon={KeyRound}
      title="Forgot password"
      description="Enter the email you signed up with and we'll send you a link to choose a new password."
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          If an account exists for <span className="font-semibold">{email.trim()}</span>, a reset link
          is on its way. Open it in this same browser. Check your spam folder if it doesn&apos;t
          arrive within a few minutes.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-border bg-background px-12 py-3 text-sm text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}

      <Link
        href="/auth"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </AuthCardShell>
  )
}
