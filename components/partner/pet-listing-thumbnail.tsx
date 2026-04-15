'use client'

import { useState } from 'react'
import { PawPrint } from 'lucide-react'

type PetListingThumbnailProps = {
  src: string | null
  alt: string
}

export function PetListingThumbnail({ src, alt }: PetListingThumbnailProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#fff3e8_0%,#eef7ff_100%)] ring-1 ring-border">
        <PawPrint className="h-6 w-6 text-primary" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border"
      onError={() => setHasError(true)}
    />
  )
}
