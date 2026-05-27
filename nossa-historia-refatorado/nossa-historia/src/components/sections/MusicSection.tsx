'use client'

/**
 * components/sections/MusicSection.tsx
 *
 * Scroll-snap section wrapping the MusicaEmbed component.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MusicaEmbed } from '@/components/MusicaEmbed'
import type { PaletaTema } from '@/lib/types'

interface MusicSectionProps {
  musicaUrl: string
  paleta: PaletaTema
}

export function MusicSection({ musicaUrl, paleta }: MusicSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px 0px' })

  if (!musicaUrl) return null

  return (
    <section
      className="min-h-[100svh] w-full flex flex-col items-center justify-center px-6 py-16"
      style={{ scrollSnapAlign: 'start', backgroundColor: paleta.bg }}
    >
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-xs font-bold uppercase tracking-[0.18em] mb-8"
        style={{ color: paleta.primary }}
      >
        Nossa Música 🎵
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="w-full max-w-md"
      >
        <MusicaEmbed musicaUrl={musicaUrl} />
      </motion.div>
    </section>
  )
}
