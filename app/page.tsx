'use client'

import Link from 'next/link'
import { DogCard } from '@/components/dog-card'
import { useDogCatalog } from '@/lib/dog-catalog'
import { ArrowRight, Heart, Users, Shield } from 'lucide-react'

export default function Home() {
  const dogs = useDogCatalog()
  const featuredDogs = dogs.slice(0, 3)
  const heroImage = featuredDogs[0]?.image ?? dogs[0]?.image

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-muted">
                <img
                  src={heroImage}
                  alt="Happy dogs"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight mb-8">
                Find Your Perfect Companion
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
                Browse adoptable dogs from rescues and shelters. Each dog deserves a loving home, and we're here to help you find yours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Start Browsing <ArrowRight size={20} />
                </Link>
                <Link
                  href="#learn"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dogs - Card-Based */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Featured Companions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Meet some of our wonderful dogs looking for their forever homes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredDogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:gap-3 transition-all duration-200"
            >
              View All Dogs <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Adopt Section */}
      <section id="learn" className="py-16 sm:py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
            Why Adopt?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Save a Life</h3>
              <p className="text-muted-foreground">
                By adopting, you free up shelter resources for other animals in need and give a deserving dog a second chance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Amazing Companions</h3>
              <p className="text-muted-foreground">
                Rescue dogs are grateful and loyal. They make wonderful family members and can provide unconditional love.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg border border-border">
              <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Health Checked</h3>
              <p className="text-muted-foreground">
                All our dogs are vaccinated, neutered/spayed, and health checked by veterinarians before adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
            Happy Families
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-secondary/5 p-6 rounded-lg border border-border">
              <div className="flex gap-1 mb-3">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;We adopted Max from PawMatch and he's completely transformed our lives! He's the sweetest, most loving family member.&quot;
              </p>
              <p className="font-semibold text-foreground">Sarah & John</p>
              <p className="text-sm text-muted-foreground">San Francisco, CA</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-secondary/5 p-6 rounded-lg border border-border">
              <div className="flex gap-1 mb-3">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Finding Luna through this platform was so easy. The whole process was smooth, and we got our perfect match!&quot;
              </p>
              <p className="font-semibold text-foreground">Emily Chen</p>
              <p className="text-sm text-muted-foreground">Seattle, WA</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-secondary/5 p-6 rounded-lg border border-border">
              <div className="flex gap-1 mb-3">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-muted-foreground mb-4">
                &quot;Charlie came to us as a shy rescue, but with love and patience, he's now our most confident and happy dog!&quot;
              </p>
              <p className="font-semibold text-foreground">Michael Rodriguez</p>
              <p className="text-sm text-muted-foreground">Portland, OR</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Find Your Match?</h2>
          <p className="text-lg mb-8 opacity-90">
            Browse our adoptable dogs today and start the journey to your new best friend.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Dogs Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">PawMatch</h3>
              <p className="text-sm opacity-80">Connecting loving homes with rescue dogs.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/browse" className="hover:opacity-100">Browse Dogs</Link></li>
                <li><Link href="#" className="hover:opacity-100">How It Works</Link></li>
                <li><Link href="#" className="hover:opacity-100">Shelters</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="#" className="hover:opacity-100">Privacy</Link></li>
                <li><Link href="#" className="hover:opacity-100">Terms</Link></li>
                <li><Link href="#" className="hover:opacity-100">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm opacity-80">hello@pawmatch.org</p>
              <p className="text-sm opacity-80">1-800-PAW-HELP</p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8">
            <p className="text-center text-sm opacity-80">
              © 2024 PawMatch. All rights reserved. Helping dogs find their forever homes. 🐾
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
