'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'

export default function AuthPage() {
  const router = useRouter()
  const { supabase, user, loading } = useAuthUser()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [loading, router, user])

  const resetMessages = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resetMessages()
    setIsSubmitting(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        setIsSubmitting(false)
        return
      }

      router.replace('/dashboard')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    if (data.session) {
      router.replace('/dashboard')
      router.refresh()
      return
    }

    setSuccessMessage('Account created. Check your email to confirm your account before signing in.')
    setIsSubmitting(false)
  }

  const toggleMode = (nextIsLogin: boolean) => {
    setIsLogin(nextIsLogin)
    resetMessages()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] py-12">
        <div className="site-container">
          <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-10 text-center shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur">
            <h1 className="text-2xl font-bold text-foreground">Checking your account...</h1>
            <p className="mt-3 text-muted-foreground">
              We&apos;re confirming your session before showing the auth form.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] py-12">
      <div className="site-container grid min-h-[calc(100vh-9rem)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full bg-[#84c5ff]/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex rounded-[1.5rem] bg-white p-2 shadow-sm ring-1 ring-border/70">
              <Image
                src="/amponph-logo.png"
                alt="AmponPH logo"
                width={170}
                height={72}
                className="h-14 w-auto"
                priority
              />
            </div>

            <div className="mt-8 space-y-4">
              <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold text-primary">
                Safe, simple adoption
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {isLogin ? 'Welcome back to AmponPH' : 'Create your adoption profile'}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {isLogin
                  ? 'Pick up where you left off and continue your journey toward meeting the right pet.'
                  : 'Join a warmer, more thoughtful pet adoption experience built for Filipino families.'}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-[#3b82f6]/15 text-primary">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-foreground">Adoption-first flow</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Save favorites, stay organized, and move through the application process with ease.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7ff] text-[#145da0]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-foreground">Trusted platform</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A cleaner, more reassuring experience for adopters who want clarity and confidence.
                </p>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Start with your account, then browse and connect with rescues.
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
            <div className="mb-8">
              <div className="flex gap-2 rounded-full bg-[#f6f9fe] p-1.5">
                <button
                  onClick={() => toggleMode(true)}
                  className={`flex-1 rounded-full py-3 transition-all font-medium text-sm ${
                    isLogin
                      ? 'bg-primary text-primary-foreground shadow-[0_16px_36px_-22px_rgba(249,115,22,0.9)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => toggleMode(false)}
                  className={`flex-1 rounded-full py-3 transition-all font-medium text-sm ${
                    !isLogin
                      ? 'bg-primary text-primary-foreground shadow-[0_16px_36px_-22px_rgba(249,115,22,0.9)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {isLogin ? 'Sign in to continue' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {isLogin
                  ? 'Access your saved pets, applications, and updates.'
                  : 'Start saving pets and preparing for your adoption journey.'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 pl-12 pr-12 text-sm text-foreground placeholder-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[0_18px_38px_-18px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
              >
                {isSubmitting
                  ? (isLogin ? 'Signing In...' : 'Creating Account...')
                  : (isLogin ? 'Sign In' : 'Create Account')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 font-medium text-foreground opacity-60"
              >
                <span>🔵</span>
                Google coming soon
              </button>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce9f8] bg-[#fcfdff] py-3 font-medium text-foreground opacity-60"
              >
                <span>👤</span>
                Facebook coming soon
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => toggleMode(!isLogin)}
                className="font-semibold text-primary transition-opacity hover:opacity-80"
              >
                {isLogin ? 'Register' : 'Sign in'}
              </button>
            </p>

            <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
              By {isLogin ? 'signing in' : 'registering'}, you agree to our{' '}
              <Link href="#" className="text-primary hover:opacity-80">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-primary hover:opacity-80">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
