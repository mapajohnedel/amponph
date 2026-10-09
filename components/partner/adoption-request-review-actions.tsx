'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AdoptionRequestReviewActionsProps = {
  requestId: string
}

export function AdoptionRequestReviewActions({
  requestId,
}: AdoptionRequestReviewActionsProps) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    setError(null)
    setIsApproving(true)

    try {
      const response = await fetch(`/api/adoption-requests/${requestId}/approve`, {
        method: 'POST',
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to approve adoption request.')
      }

      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to approve request.')
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setError(null)
    setIsRejecting(true)

    try {
      const response = await fetch(`/api/adoption-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to reject adoption request.')
      }

      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to reject request.')
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isApproving ? 'Approving...' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={isApproving || isRejecting}
          className="rounded-full border border-red-300 dark:border-red-500/30 px-4 py-2 text-xs font-semibold text-red-700 dark:text-red-300 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
