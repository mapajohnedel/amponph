'use client'

import { useEffect, useState } from 'react'
import { type Dog, mockDogs } from '@/lib/mock-dogs'

const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random'
const GALLERY_IMAGES_PER_DOG = 3

type DogApiResponse = {
  message: string | string[]
  status: 'success' | 'error'
}

let cachedDogCatalog: Dog[] | null = null
let dogCatalogPromise: Promise<Dog[]> | null = null

async function fetchDogImages(total: number): Promise<string[]> {
  const response = await fetch(`${DOG_API_URL}/${total}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Dog CEO request failed with status ${response.status}`)
  }

  const data = (await response.json()) as DogApiResponse

  if (data.status !== 'success') {
    throw new Error('Dog CEO API returned an error response')
  }

  return Array.isArray(data.message) ? data.message : [data.message]
}

async function loadDogCatalog(): Promise<Dog[]> {
  if (cachedDogCatalog) {
    return cachedDogCatalog
  }

  if (!dogCatalogPromise) {
    dogCatalogPromise = (async () => {
      try {
        const imagePool = await fetchDogImages(mockDogs.length * GALLERY_IMAGES_PER_DOG)

        cachedDogCatalog = mockDogs.map((dog, index) => {
          const start = index * GALLERY_IMAGES_PER_DOG
          const images = Array.from({ length: GALLERY_IMAGES_PER_DOG }, (_, offset) => {
            return imagePool[start + offset] ?? dog.images[offset] ?? dog.image
          })

          return {
            ...dog,
            image: images[0],
            images,
          }
        })

        return cachedDogCatalog
      } catch (error) {
        console.error('Failed to load Dog CEO images.', error)
        cachedDogCatalog = mockDogs
        return cachedDogCatalog
      }
    })()
  }

  return dogCatalogPromise
}

export function useDogCatalog() {
  const [dogs, setDogs] = useState<Dog[]>(cachedDogCatalog ?? mockDogs)

  useEffect(() => {
    let isActive = true

    void loadDogCatalog().then((nextDogs) => {
      if (isActive) {
        setDogs(nextDogs)
      }
    })

    return () => {
      isActive = false
    }
  }, [])

  return dogs
}
