import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, FilePlus2 } from 'lucide-react'
import { CreatePetListingSection } from '@/components/partner/create-pet-listing-section'
import { getAuthenticatedHome, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export default async function NewPartnerListingPage() {
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
    .select('city, province_or_region')
    .eq('user_id', user.id)
    .single()

  const initialLocation = [profile?.city, profile?.province_or_region]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="min-h-screen bg-background">
      <div className="site-container py-12">
        <Link
          href="/partner"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to partner dashboard
        </Link>

        <div className="mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#fff3e8] via-white to-[#eef7ff] p-8 shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] sm:p-10">
          <span className="inline-flex rounded-full bg-[#ffefe6] px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            Partner listings
          </span>
          <h1 className="mt-6 flex items-center gap-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <FilePlus2 className="h-8 w-8 text-primary" />
            Create a new pet listing
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Build a complete listing for adoption-ready pets with the key details adopters need
            before they decide to reach out.
          </p>
        </div>

        <CreatePetListingSection initialLocation={initialLocation} />
      </div>
    </div>
  )
}
