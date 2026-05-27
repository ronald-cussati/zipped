'use client'

/**
 * components/sections/TimelineSection.tsx
 *
 * Vertical timeline stepper with scroll-triggered entrance animations.
 * Each moment card slides in from the correct side using Framer Motion.
 */

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Momento, PaletaTema } from '@/lib/types'

interface TimelineSectionProps {
  momentos: Momento[]
  paleta: PaletaTema
}

function formatarData(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function MomentoCard({
  momento,
  index,
  paleta,
}: {
  momento: Momento
  index: number
  paleta: PaletaTema
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-60px 0px' })
  const lado = index % 2 === 0 ? 'esquerda' : 'direita'

  return (
    <div
      ref={ref}
      className="relative flex items-start gap-0"
    >
      {/* Left column */}
      <div className="flex-1 pr-6 flex justify-end">
        {lado === 'esquerda' ? (
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
            className="w-full max-w-[160px]"
          >
            <CardContent momento={momento} paleta={paleta} />
          </motion.div>
        ) : (
          <div className="w-full max-w-[160px]" />
        )}
      </div>

      {/* Center dot */}
      <div className="flex flex-col items-center z-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : {}}
          transition={{ duration: 0.35, delay: index * 0.05 + 0.15 }}
          className="w-4 h-4 rounded-full ring-4"
          style={{
            background: paleta.primary,
            ringColor: `${paleta.primary}35`,
          }}
        />
      </div>

      {/* Right column */}
      <div className="flex-1 pl-6">
        {lado === 'direita' ? (
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
            className="w-full max-w-[160px]"
          >
            <CardContent momento={momento} paleta={paleta} />
          </motion.div>
        ) : (
          <div className="w-full max-w-[160px]" />
        )}
      </div>
    </div>
  )
}

function CardContent({ momento, paleta }: { momento: Momento; paleta: PaletaTema }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: paleta.bgCard,
        border: `1px solid ${paleta.border}`,
        boxShadow: `0 8px 24px ${paleta.primary}10`,
      }}
    >
      {momento.foto_url && (
        <div className="relative h-28 w-full">
          <Image
            src={momento.foto_url}
            alt={momento.titulo}
            fill
            className="object-cover"
            sizes="160px"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-3">
        <p
          className="text-[0.6rem] font-bold uppercase tracking-wider mb-1"
          style={{ color: paleta.primary }}
        >
          {formatarData(momento.data)}
        </p>
        <h3
          className="text-xs font-semibold leading-snug mb-1"
          style={{ color: paleta.text }}
        >
          {momento.titulo}
        </h3>
        {momento.descricao && (
          <p className="text-[0.7rem] leading-relaxed" style={{ color: paleta.textMuted }}>
            {momento.descricao}
          </p>
        )}
      </div>
    </div>
  )
}

export function TimelineSection({ momentos, paleta }: TimelineSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleVisible = useInView(ref, { once: true })

  if (!momentos.length) return null

  const sorted = [...momentos].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  )

  return (
    <section
      className="min-h-[100svh] w-full flex flex-col items-center px-4 py-16"
      style={{ scrollSnapAlign: 'start', backgroundColor: paleta.bg }}
    >
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-xs font-bold uppercase tracking-[0.18em] mb-12"
        style={{ color: paleta.primary }}
      >
        Nossa História 📖
      </motion.h2>

      <div className="relative w-full max-w-sm mx-auto">
        {/* Vertical line */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px"
          style={{
            background: `linear-gradient(to bottom, ${paleta.primary}80, ${paleta.border})`,
          }}
        />

        {/* Moments */}
        <div className="flex flex-col gap-8">
          {sorted.map((momento, i) => (
            <MomentoCard
              key={momento.id ?? i}
              momento={momento}
              index={i}
              paleta={paleta}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
