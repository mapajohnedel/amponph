'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Heart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const DONATION_NUMBER = '09468328005'
const ACCOUNT_NAME = 'Johnedel M.'
const SUGGESTED_AMOUNTS = [20, 50, 100] as const

export function SupportPageClient() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_NUMBER)
      toast({ title: 'Number copied!' })
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Please copy the number manually.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-9rem)] bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_45%,#fffaf6_100%)] py-12 md:py-16">
      <div className="site-container max-w-5xl">
        <header className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Support AmponPH 🐾
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Help us continue connecting rescued dogs with loving homes.
          </p>
        </header>

        <Card className="gap-0 overflow-hidden rounded-[1.75rem] border-white/70 bg-white/90 p-0 shadow-[0_24px_70px_-40px_rgba(20,44,90,0.35)] backdrop-blur">
          <CardHeader className="border-b border-border/60 bg-gradient-to-br from-[#f0f7ff] to-white pb-6 pt-6">
            <CardTitle className="text-xl font-semibold text-foreground">GCash / Maya</CardTitle>
            <p className="text-sm text-muted-foreground">
              Send to this number using GCash or Maya. Thank you for supporting our mission.
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <div className="min-w-0 flex-1 space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Mobile number
                    </p>
                    <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-foreground">
                      {DONATION_NUMBER}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Account name: <span className="font-medium text-foreground">{ACCOUNT_NAME}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-full border-[#d6e8fb] bg-white shadow-sm"
                    onClick={copyNumber}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Number
                  </Button>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Suggested amounts</p>
                  <div className="flex flex-wrap gap-3">
                    {SUGGESTED_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setSelectedAmount(amount)}
                        className={cn(
                          'rounded-full border px-6 py-2.5 text-sm font-semibold transition-all',
                          selectedAmount === amount
                            ? 'border-primary bg-primary text-primary-foreground shadow-md'
                            : 'border-border bg-white/80 text-foreground hover:border-primary/50 hover:bg-[#f0f7ff]',
                        )}
                      >
                        ₱{amount}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    For reference only — choose the same amount in your GCash or Maya app.
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground lg:max-w-md">
                  Open GCash, tap <span className="font-medium text-foreground">Scan QR</span>, and point your
                  camera at the code on the right. Maya users can send to the mobile number above.
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-center lg:sticky lg:top-24 lg:w-[min(100%,280px)] lg:items-stretch">
                <p className="mb-3 w-full text-center text-sm font-medium text-foreground lg:text-left">
                  Scan with GCash
                </p>
                {/* GCash blue matches the asset edges so rounding never shows white letterboxing */}
                <div className="relative w-full max-w-[280px] overflow-hidden rounded-[1.35rem] bg-[#0073e6] leading-none shadow-[0_28px_64px_-24px_rgba(0,115,254,0.55),0_12px_32px_-12px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06] lg:max-w-none">
                  <Image
                    src="/support/gcash-qr.png"
                    alt="GCash QR code — scan to send a donation to AmponPH"
                    width={528}
                    height={1024}
                    className="block h-auto w-full align-top"
                    sizes="(max-width: 1024px) 280px, 280px"
                    priority
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#e3eef8] bg-white/70 p-6 shadow-sm backdrop-blur md:mt-12 md:p-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Heart className="h-5 w-5" strokeWidth={2} />
          </div>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Every small amount helps feed, rescue, and rehome dogs in need. Thank you for being part
            of AmponPH.
          </p>
        </div>
      </div>
    </div>
  )
}
