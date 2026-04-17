'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, FilePlus2, KeyRound, LayoutDashboard, LogOut, Menu, PawPrint, X } from 'lucide-react'
import { useAuthUser } from '@/hooks/use-auth-user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { supabase, user, loading, isAdmin, isPartner } = useAuthUser()
  const accountLabel = isAdmin
    ? 'Admin Panel'
    : isPartner
      ? user?.user_metadata?.organization_name ?? 'Partner Dashboard'
      : user?.user_metadata?.full_name ?? user?.email ?? 'Dashboard'
  const userEmail = user?.email ?? 'Signed in'
  const accountHref = isAdmin ? '/admin' : isPartner ? '/partner' : '/dashboard'
  const passwordHref = !isAdmin ? '/account/password' : null
  const partnerListingsHref = isPartner ? '/partner/listings' : null
  const createListingHref = isPartner ? '/partner/listings/new' : null
  const signedOutHref = isAdmin ? '/admin/login' : '/auth'
  const isRegularUser = Boolean(user) && !isAdmin && !isPartner
  const isGuest = !loading && !user

  const guestDesktopNav = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Adopt' },
    { href: '/#success-stories', label: 'Success Stories' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/partner/register', label: 'For Shelters' },
    { href: '/auth', label: 'Login' },
  ]
  const guestMobileNav = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Adopt' },
    { href: '/#success-stories', label: 'Success Stories' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/partner/register', label: 'For Shelters' },
    { href: '/support', label: 'Support' },
    { href: '/auth', label: 'Login' },
  ]

  const userDesktopNav = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/browse', label: 'Adopt' },
    { href: '/#success-stories', label: 'Success Stories' },
    { href: '/dashboard#favorites', label: 'Favorites' },
  ]
  const userMobileNav = [
    { href: '/support', label: 'Support' },
    ...userDesktopNav,
  ]

  const partnerDesktopNav = [
    { href: '/partner', label: 'Partner Dashboard' },
    { href: '/partner/listings', label: 'My Pets' },
    { href: '/partner/listings/new', label: 'Create Listing' },
  ]
  const partnerMobileNav = [{ href: '/support', label: 'Support' }, ...partnerDesktopNav]

  const adminDesktopNav = [{ href: '/admin', label: 'Admin Panel' }]
  const adminMobileNav = [{ href: '/support', label: 'Support' }, ...adminDesktopNav]

  const desktopNavLinks = isAdmin
    ? adminDesktopNav
    : isPartner
      ? partnerDesktopNav
      : isRegularUser
        ? userDesktopNav
        : guestDesktopNav
  const mobileNavLinks = isAdmin
    ? adminMobileNav
    : isPartner
      ? partnerMobileNav
      : isRegularUser
        ? userMobileNav
        : guestMobileNav
  const ctaHref = isAdmin ? '/admin' : isPartner ? '/partner' : '/browse'
  const ctaLabel = isAdmin ? 'Admin Panel' : isPartner ? 'Partner Dashboard' : 'Browse Pets'

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    setIsOpen(false)
    router.replace(signedOutHref)
    router.refresh()
    setIsSigningOut(false)
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="site-container">
        <div className="flex h-[4.75rem] items-center justify-between lg:h-20">
          <Link href="/" className="group flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/80">
              <Image
                src="/amponph-logo.png"
                alt="AmponPH logo"
                width={138}
                height={58}
                className="h-11 w-auto lg:h-12"
                priority
              />
            </div>
            <div className="hidden leading-tight sm:block">
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[#145da0]">
                Pet adoption platform
              </span>
              <span className="block text-sm text-muted-foreground">Find your next best friend</span>
            </div>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/support"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Support
            </Link>
            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-full border border-[#d6e8fb] bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:text-primary">
                    <span className="max-w-40 truncate">{accountLabel}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="truncate font-semibold text-foreground">{accountLabel}</div>
                    <div className="truncate text-xs font-normal text-muted-foreground">
                      {userEmail}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                    <Link href={accountHref}>
                      <LayoutDashboard className="h-4 w-4" />
                      {isAdmin ? 'Admin Panel' : isPartner ? 'Partner Dashboard' : 'Dashboard'}
                    </Link>
                  </DropdownMenuItem>
                  {passwordHref && (
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                      <Link href={passwordHref}>
                        <KeyRound className="h-4 w-4" />
                        Update Password
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {partnerListingsHref && (
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                      <Link href={partnerListingsHref}>
                        <PawPrint className="h-4 w-4" />
                        My Pets
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {createListingHref && (
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                      <Link href={createListingHref}>
                        <FilePlus2 className="h-4 w-4" />
                        Create Listing
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    variant="destructive"
                    className="rounded-xl px-3 py-2"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isSigningOut ? 'Logging out...' : 'Log out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {(user || isGuest) && (
              <Link href={ctaHref} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_36px_-20px_rgba(249,115,22,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                {ctaLabel}
              </Link>
            )}
          </div>

          <button
            className="rounded-xl p-2.5 transition-colors hover:bg-white/70 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border/70">
            <div className="space-y-1 px-1 pb-4 pt-3">
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!loading && user && (
                <>
                  <div className="rounded-xl px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">{accountLabel}</p>
                    <p className="truncate text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                  <Link
                    href={accountHref}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin ? 'Admin Panel' : isPartner ? 'Partner Dashboard' : 'Dashboard'}
                  </Link>
                  {passwordHref && (
                    <Link
                      href={passwordHref}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                      onClick={() => setIsOpen(false)}
                    >
                      Update Password
                    </Link>
                  )}
                  {partnerListingsHref && (
                    <Link
                      href={partnerListingsHref}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                      onClick={() => setIsOpen(false)}
                    >
                      My Pets
                    </Link>
                  )}
                  {createListingHref && (
                    <Link
                      href={createListingHref}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary/20"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Listing
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    {isSigningOut ? 'Logging out...' : 'Log out'}
                  </button>
                </>
              )}
              {(user || isGuest) && (
                <Link
                  href={ctaHref}
                  className="mt-3 block w-full rounded-full bg-primary px-4 py-3 text-center text-base font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  onClick={() => setIsOpen(false)}
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
