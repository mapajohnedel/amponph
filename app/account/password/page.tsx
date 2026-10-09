import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react'
import { UpdatePasswordForm } from '@/components/account/update-password-form'
import { isAdminUser, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export default async function AccountPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  if (isAdminUser(user)) {
    redirect('/admin')
  }

  const isPartner = isPartnerUser(user)
  const backHref = isPartner ? '/partner' : '/dashboard'
  const backLabel = isPartner ? 'Back to partner dashboard' : 'Back to dashboard'
  const accountLabel = isPartner ? 'Partner account' : 'User account'
  const userEmail = user.email ?? 'Signed in account'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] dark:bg-[linear-gradient(180deg,var(--page-gradient-from)_0%,var(--page-gradient-to)_100%)] py-12">
      <div className="site-container">
        <div className="mx-auto max-w-3xl">
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white dark:bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <div className="rounded-[2.5rem] border border-white/70 dark:border-white/10 bg-white/90 dark:bg-card/90 p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur sm:p-10">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-[#ffefe6] dark:bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
                {accountLabel}
              </span>
              <h1 className="mt-5 flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                <KeyRound className="h-8 w-8 text-primary" />
                Update Password
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Change the password for your signed-in account without going back to the dashboard.
              </p>
            </div>

            <div className="mb-8 rounded-3xl border border-border bg-background/50 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#145da0] dark:text-sky-300" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{userEmail}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    This page updates the password for your current {accountLabel.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>

            <UpdatePasswordForm
              title="Account Security"
              description="Enter a new password below, then save the change to secure your account."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
