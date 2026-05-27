/**
 * lib/utils.ts
 *
 * Utility functions.
 */

/** Merge class names (lightweight, no clsx/tailwind-merge needed) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Generate a URL-safe slug from two names */
export function generateSlug(nome1: string, nome2: string): string {
  return `${nome1}-${nome2}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
