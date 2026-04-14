import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseConfig } from '@/lib/supabase/config'

export function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig()

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Touch the auth session on every matched request so refresh tokens stay current.
  void supabase.auth.getUser()

  return response
}
