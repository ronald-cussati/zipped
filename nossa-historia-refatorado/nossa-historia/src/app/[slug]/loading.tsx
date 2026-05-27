/**
 * app/[slug]/loading.tsx
 *
 * Skeleton shown by Next.js while the Server Component fetches Supabase data.
 * Mirrors the layout of the hero section to minimize layout shift.
 */

export default function SlugLoading() {
  return (
    <div className="h-[100svh] bg-gray-900 flex flex-col items-center justify-center gap-8 animate-pulse">
      {/* Skeleton names */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-28 bg-white/10 rounded-2xl" />
        <div className="h-6 w-6 bg-white/10 rounded-full" />
        <div className="h-10 w-28 bg-white/10 rounded-2xl" />
      </div>

      {/* Skeleton subtitle */}
      <div className="h-3 w-48 bg-white/10 rounded-full" />

      {/* Skeleton counter grid */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-16 h-14 bg-white/10 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
