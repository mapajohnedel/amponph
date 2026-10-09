'use client'

import Link from 'next/link'
import { type FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import { getAuthenticatedHome, isAdminUser } from '@/lib/auth/admin'
import { navigateAfterAuthChange } from '@/lib/auth/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const { supabase, user, loading } = useAuthUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // While submitting, handleSubmit performs the redirect itself.
    if (!loading && user && !isSubmitting) {
      router.replace(getAuthenticatedHome(user))
    }
  }, [isSubmitting, loading, router, user])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut()
      setErrorMessage('This account is not authorized for admin access.')
      setIsSubmitting(false)
      return
    }

    navigateAfterAuthChange('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] py-12">
        <div className="site-container">
          <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-10 text-center shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur">
            <h1 className="text-2xl font-bold text-foreground">Checking admin access...</h1>
            <p className="mt-3 text-muted-foreground">
              Verifying whether this device already has an active admin session.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] py-12">
      <div className="site-container grid min-h-[calc(100vh-9rem)] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="mt-8 space-y-4">
            <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold text-primary">
              Shelter admin access
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sign in to the admin panel
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Use an admin-approved Supabase account to manage dog listings, review requests, and
              monitor shelter operations.
            </p>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/70 bg-white/80 p-5 backdrop-blur">
            <h2 className="font-semibold text-foreground">How admin access works</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This page only accepts accounts marked as admins through user metadata or the
              configured admin email list.
            </p>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Admin login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Regular adopter accounts should use the standard account login page.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 pl-12 pr-12 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing In...' : 'Continue to Admin'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Looking for your adopter account?{' '}
            <Link href="/auth" className="font-semibold text-primary transition-opacity hover:opacity-80">
              Go to user login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
