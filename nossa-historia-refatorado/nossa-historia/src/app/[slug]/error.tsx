'use client'

/**
 * app/[slug]/error.tsx
 *
 * Error boundary for unexpected failures (Supabase down, network issues, etc).
 * Renders a friendly recovery UI without leaking technical details.
 */

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SlugError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error tracking (Sentry, etc) here
    console.error('[SlugPage Error]', error)
  }, [error])

  return (
    <div className="h-[100svh] flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <p className="text-5xl mb-6">💔</p>
      <h1 className="text-2xl font-serif font-light text-gray-800 mb-2">
        Algo deu errado
      </h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Não conseguimos carregar esta página no momento. Tente novamente em instantes.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-semibold text-sm hover:bg-pink-600 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
