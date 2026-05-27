'use client'

/**
 * components/sections/ContentSections.tsx
 *
 * Message and Gallery sections — scroll-snap aware, motion-enhanced.
 */

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { PaletaTema } from '@/lib/types'

// ─── Message Section ──────────────────────────────────────────────────────────

interface MessageSectionProps {
  mensagem: string
  nomePessoa1: string
  nomePessoa2: string
  paleta: PaletaTema
}

export function MessageSection({ mensagem, paleta }: MessageSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      ref={ref}
      className="min-h-[100svh] w-full flex items-center justify-center px-6 py-20"
      style={{ scrollSnapAlign: 'start', backgroundColor: paleta.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full"
      >
        <div
          className="relative rounded-3xl p-8 text-center"
          style={{
            background: paleta.bgCard,
            border: `1px solid ${paleta.border}`,
            boxShadow: `0 24px 64px ${paleta.primary}12`,
          }}
        >
          {/* Floating icon */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl leading-none">
            💌
          </div>

          <p
            className="text-base leading-relaxed mt-2"
            style={{ color: paleta.text, fontStyle: 'italic' }}
          >
            &ldquo;{mensagem}&rdquo;
          </p>

          <div
            className="mx-auto mt-5 rounded-full"
            style={{
              width: 40,
              height: 2,
              background: paleta.primary,
              opacity: 0.4,
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

interface GallerySectionProps {
  fotos: string[]
  paleta: PaletaTema
}

export function GallerySection({ fotos, paleta }: GallerySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px 0px' })

  if (!fotos.length) return null

  return (
    <section
      className="min-h-[100svh] w-full flex flex-col items-center justify-center px-5 py-16"
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
        Nossa Galeria 📸
      </motion.h2>

      <div
        className="w-full max-w-md grid gap-2"
        style={{
          gridTemplateColumns: fotos.length === 1 ? '1fr' : 'repeat(2, 1fr)',
        }}
      >
        {fotos.slice(0, 6).map((foto, i) => {
          const spanFull = i === 0 && fotos.length % 2 !== 0 && fotos.length !== 1
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-2xl"
              style={{
                aspectRatio: '1 / 1',
                background: paleta.bgCard,
                border: `1px solid ${paleta.border}`,
                gridColumn: spanFull ? '1 / -1' : undefined,
              }}
            >
              <Image
                src={foto}
                alt={`Foto ${i + 1}`}
                fill
                loading="lazy"
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
