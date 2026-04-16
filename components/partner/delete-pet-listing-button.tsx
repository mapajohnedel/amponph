'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'

type DeletePetListingButtonProps = {
  petId: string
  petName: string
}

export function DeletePetListingButton({
  petId,
  petName,
}: DeletePetListingButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${petName}"? This will also remove its uploaded Cloudinary images.`
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/partner/pets/${petId}`, {
        method: 'DELETE',
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to delete the pet listing.')
      }

      router.refresh()
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to delete the pet listing.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {errorMessage && (
        <p className="max-w-[12rem] text-xs leading-5 text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
