/**
 * lib/supabase-server.ts
 *
 * Server-side Supabase client using @supabase/ssr.
 * Use this in Server Components, Route Handlers, and Server Actions.
 * Never import this in Client Components — use @/lib/supabase instead.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { PaginaCasalRow } from './types'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll is called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}

// ─── Typed query helpers ──────────────────────────────────────────────────────

/**
 * Fetches a single couple page by slug.
 * Returns null if not found.
 */
export async function getPaginaBySlug(slug: string): Promise<PaginaCasalRow | null> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('paginas_casal')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as PaginaCasalRow
}

/**
 * Checks whether a slug is already taken.
 */
export async function isSlugTaken(slug: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient()
  const { count } = await supabase
    .from('paginas_casal')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug)
  return (count ?? 0) > 0
}
