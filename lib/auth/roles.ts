import type { User } from '@supabase/supabase-js'

type AuthUserLike = Pick<User, 'email' | 'app_metadata' | 'user_metadata'>
type SupportedRole = 'admin' | 'partner'

// Roles come only from app_metadata (server-controlled) and the admin email allowlist.
// Never trust user_metadata here: users can set it themselves via signUp/updateUser.

function getConfiguredAdminEmails() {
  return (process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function valueIncludesRole(value: unknown, role: SupportedRole): boolean {
  if (typeof value === 'string') {
    return value.trim().toLowerCase() === role
  }

  if (Array.isArray(value)) {
    return value.some((entry) => valueIncludesRole(entry, role))
  }

  return false
}

export function isAdminUser(user: AuthUserLike | null | undefined) {
  if (!user) {
    return false
  }

  const email = user.email?.trim().toLowerCase()
  const adminEmails = getConfiguredAdminEmails()

  if (email && adminEmails.includes(email)) {
    return true
  }

  return valueIncludesRole(user.app_metadata?.role, 'admin')
}

export function isPartnerUser(user: AuthUserLike | null | undefined) {
  if (!user || isAdminUser(user)) {
    return false
  }

  return valueIncludesRole(user.app_metadata?.role, 'partner')
}

export function getAuthenticatedHome(user: AuthUserLike | null | undefined) {
  if (isAdminUser(user)) {
    return '/admin'
  }

  if (isPartnerUser(user)) {
    return '/partner'
  }

  return '/dashboard'
}
