'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DogGalleryProps {
  images: string[]
  dogName: string
}

export function DogGallery({ images, dogName }: DogGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Main Image - Larger */}
      <div className="relative bg-muted h-96 sm:h-[600px] lg:h-[650px] flex items-center justify-center overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${dogName} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 dark:bg-card/95 hover:bg-white dark:hover:bg-card rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} className="text-foreground" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 dark:bg-card/95 hover:bg-white dark:hover:bg-card rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={28} className="text-foreground" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="p-6 bg-background border-t border-border">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
