'use client'

import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuthUser() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return
      }

      if (error) {
        console.error('Failed to load Supabase user.', error)
      }

      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return
      }

      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    supabase,
    user,
    loading,
    isAuthenticated: Boolean(user),
  }
}
