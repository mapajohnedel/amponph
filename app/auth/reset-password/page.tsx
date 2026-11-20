'use client'

import Link from 'next/link'
import { KeyRound } from 'lucide-react'
import { AuthCardShell } from '@/components/account/auth-card-shell'
import { UpdatePasswordForm } from '@/components/account/update-password-form'
import { Bone } from '@/components/skeletons/page-skeletons'
import { useAuthUser } from '@/hooks/use-auth-user'
import { getAuthenticatedHome } from '@/lib/auth/roles'
import { navigateAfterAuthChange } from '@/lib/auth/navigation'

export default function ResetPasswordPage() {
  const { user, loading } = useAuthUser()

  return (
    <AuthCardShell
      icon={KeyRound}
      title="Choose a new password"
      description="Set a new password for your AmponPH account."
    >
      {loading ? (
        <div className="space-y-4">
          <Bone className="h-12 w-full rounded-2xl" />
          <Bone className="h-12 w-full rounded-2xl" />
          <Bone className="h-12 w-full rounded-full" />
        </div>
      ) : user ? (
        <UpdatePasswordForm
          title="New password"
          description={`Signed in as ${user.email ?? 'your account'}.`}
          onSuccess={() => navigateAfterAuthChange(getAuthenticatedHome(user))}
        />
      ) : (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            This reset link is invalid or has expired. Links work once, for a limited time, and only
            in the browser where you requested them.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request a new link
          </Link>
        </div>
      )}
    </AuthCardShell>
  )
}
