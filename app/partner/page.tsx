import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2, FileText, HeartHandshake, Mail, MapPin, Phone } from 'lucide-react'
import { getAuthenticatedHome, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export default async function PartnerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  if (!isPartnerUser(user)) {
    redirect(getAuthenticatedHome(user))
  }

  const { data: profile } = await supabase
    .from('partner_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const organizationName =
    profile?.organization_name ?? user.user_metadata?.organization_name ?? 'Partner organization'
  const contactName = profile?.contact_person_name ?? user.user_metadata?.full_name ?? user.email
  const email = profile?.email ?? user.email ?? 'No email available'
  const phone = profile?.phone ?? user.user_metadata?.phone ?? 'No phone number yet'
  const city = profile?.city ?? user.user_metadata?.city ?? 'No city yet'
  const address = profile?.address_line ?? 'No address saved yet'
  const applicantType = profile?.applicant_type ?? user.user_metadata?.applicant_type ?? 'partner'
  const notes = profile?.notes ?? null

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            {applicantType}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to your partner dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Your organization has been approved to manage rescue activity on AmponPH. This
            dashboard can grow into listings, applications, and team management in later updates.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Profile
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-sm font-medium text-foreground">Organization name</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{organizationName}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-sm font-medium text-foreground">Primary contact</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{contactName}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="h-4 w-4 text-[#145da0]" />
                  Email
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{email}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 text-[#145da0]" />
                  Phone
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{phone}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-[#145da0]" />
                  City
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{city}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{address}</p>
              </div>
            </div>

            {notes && (
              <div className="mt-6 rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-sm font-medium text-foreground">Application notes</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {notes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <HeartHandshake className="h-5 w-5 text-primary" />
                Next Partner Tools
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                The partner area is ready for expansion. Upcoming improvements can plug into this
                dashboard without affecting the super-admin workflow.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Dog listing management for your organization</li>
                <li>Incoming adoption request review</li>
                <li>Partner profile editing and staff access</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Quick Links
              </h2>
              <div className="space-y-3">
                <Link
                  href="/partner/listings"
                  className="block rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  View my pet listings
                </Link>
                <Link
                  href="/partner/listings/new"
                  className="block rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  Create a new pet listing
                </Link>
                <Link
                  href="/browse"
                  className="block rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  Browse public pet listings
                </Link>
                <Link
                  href="/auth"
                  className="block rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/10"
                >
                  Return to account login
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
