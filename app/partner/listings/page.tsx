import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, FilePlus2, MapPin, PawPrint } from 'lucide-react'
import { PetListingThumbnail } from '@/components/partner/pet-listing-thumbnail'
import { getAuthenticatedHome, isPartnerUser } from '@/lib/auth/roles'
import { createClient } from '@/lib/supabase/server'

export default async function PartnerListingsPage() {
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

  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select(
      'id, name, breed, age_years, gender, size, location, description, image_url, vaccinated, neutered, status, published_at, created_at'
    )
    .eq('partner_user_id', user.id)
    .order('created_at', { ascending: false })

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
            <PawPrint className="h-8 w-8 text-primary" />
            My Pet Listings
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Review all pets currently connected to your partner account and add new listings when
            needed.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Link
            href="/partner/listings/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <FilePlus2 className="h-4 w-4" />
            Add Pet Listing
          </Link>
        </div>

        {petsError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load your pet listings: {petsError.message}
          </div>
        )}

        {!petsError && (!pets || pets.length === 0) && (
          <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">No pets added yet</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Create your first pet listing and it will appear here automatically.
            </p>
          </div>
        )}

        {!petsError && pets && pets.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-background/60">
                  <tr className="text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Pet
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Details
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Location
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Health
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pets.map((pet) => (
                    <tr key={pet.id} className="align-top">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-4">
                          <PetListingThumbnail src={pet.image_url} alt={pet.name} />

                          <div className="min-w-0">
                            <h2 className="text-base font-semibold text-foreground">{pet.name}</h2>
                            <p className="mt-1 text-sm text-muted-foreground">{pet.breed}</p>
                            <p className="mt-2 line-clamp-2 max-w-xs text-sm leading-6 text-muted-foreground">
                              {pet.description || 'No description added yet.'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#fef1e8] px-3 py-1.5 text-xs font-semibold text-primary">
                            {Number(pet.age_years)} {Number(pet.age_years) === 1 ? 'year' : 'years'} old
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                            {pet.gender}
                          </span>
                          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold capitalize text-foreground">
                            {pet.size}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-[#145da0]" />
                          <span>{pet.location}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {pet.vaccinated && (
                            <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                              Vaccinated
                            </span>
                          )}
                          {pet.neutered && (
                            <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                              Neutered / Spayed
                            </span>
                          )}
                          {!pet.vaccinated && !pet.neutered && (
                            <span className="text-sm text-muted-foreground">No tags yet</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-xs font-semibold capitalize text-[#145da0]">
                          {pet.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {pet.published_at
                          ? `Published ${new Date(pet.published_at).toLocaleDateString()}`
                          : `Created ${new Date(pet.created_at).toLocaleDateString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
