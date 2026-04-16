import { BrowsePageClient } from '@/components/browse/browse-page-client'
import { listPublishedPets } from '@/lib/pets/server'

export default async function BrowsePage() {
  const dogs = await listPublishedPets()

  return <BrowsePageClient dogs={dogs} />
}
