'use client'

/**
 * components/sections/HeroSection.tsx
 *
 * Full-screen hero with parallax-ready cover photo, names, date, and live counter.
 * Designed as the first scroll-snap section.
 */

import Image from 'next/image'
import { motion } from 'framer-motion'
import { TimeCounter } from '@/components/TimeCounter'
import type { PaletaTema, Tema } from '@/lib/types'

interface HeroSectionProps {
  nomePessoa1: string
  nomePessoa2: string
  contadorData: string
  titulo: string | null
  fotoCapa: string | null
  paleta: PaletaTema
  tema: Tema
}

const SEPARADORES: Record<Tema, string> = {
  rosa: '♡',
  azul: '✦',
  dourado: '✧',
  escuro: '✦',
}

const GRADIENTES: Record<Tema, string> = {
  rosa: 'from-rose-950/75 via-rose-900/40 to-transparent',
  azul: 'from-blue-950/75 via-blue-900/40 to-transparent',
  dourado: 'from-amber-950/75 via-amber-900/40 to-transparent',
  escuro: 'from-zinc-950/85 via-zinc-900/50 to-transparent',
}

const PLACEHOLDER_GRADIENTE: Record<Tema, string> = {
  rosa: 'from-rose-300 via-pink-400 to-rose-600',
  azul: 'from-blue-300 via-sky-400 to-blue-600',
  dourado: 'from-amber-200 via-yellow-400 to-amber-500',
  escuro: 'from-zinc-700 via-zinc-800 to-zinc-900',
}

export function HeroSection({
  nomePessoa1,
  nomePessoa2,
  contadorData,
  titulo,
  fotoCapa,
  paleta,
  tema,
}: HeroSectionProps) {
  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ scrollSnapAlign: 'start' }}
      aria-label="Capa do casal"
    >
      {/* Background */}
      {fotoCapa ? (
        <Image
          src={fotoCapa}
          alt={`Foto de capa de ${nomePessoa1} e ${nomePessoa2}`}
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_GRADIENTE[tema]}`}
        />
      )}

      {/* Gradient overlay for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-t ${GRADIENTES[tema]}`} />
      <div className="absolute inset-0 bg-black/25" />

      {/* Falling petals (light themes only) */}
      {tema !== 'escuro' && <PetalasCaindo tema={tema} paleta={paleta} />}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-lg mx-auto gap-4">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-px w-16 bg-white/50 mb-2"
        />

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4"
        >
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide text-white drop-shadow-lg">
            {nomePessoa1}
          </h1>
          <span className="text-3xl sm:text-4xl text-white/70 drop-shadow">
            {SEPARADORES[tema]}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide text-white drop-shadow-lg">
            {nomePessoa2}
          </h1>
        </motion.div>

        {/* Tagline */}
        {titulo && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 font-light"
          >
            {titulo}
          </motion.p>
        )}

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 w-full"
        >
          <TimeCounter
            dataInicio={contadorData}
            paleta={{
              ...paleta,
              primary: 'rgba(255,255,255,0.95)',
              primaryLight: 'rgba(255,255,255,0.6)',
              textMuted: 'rgba(255,255,255,0.6)',
            }}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/50">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  )
}

// ─── Petals ───────────────────────────────────────────────────────────────────

const CORES_PETALAS: Record<Exclude<Tema, 'escuro'>, string[]> = {
  rosa: ['#fda4af', '#fb7185', '#f9a8d4', '#f0abfc'],
  azul: ['#93c5fd', '#60a5fa', '#a5f3fc', '#818cf8'],
  dourado: ['#fcd34d', '#f59e0b', '#fde68a', '#fb923c'],
}

function PetalasCaindo({ tema }: { tema: Tema; paleta: PaletaTema }) {
  if (tema === 'escuro') return null
  const cores = CORES_PETALAS[tema as Exclude<Tema, 'escuro'>]

  const petalas = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    cor: cores[i % cores.length],
    delay: `${(i * 0.8).toFixed(1)}s`,
    duracao: `${7 + (i % 4)}s`,
    left: `${(i * 10.1) % 100}%`,
    size: `${8 + (i % 5)}px`,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.75; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes petalSway {
          0%, 100% { margin-left: 0; }
          50%       { margin-left: 28px; }
        }
      `}</style>
      {petalas.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50% 0 50% 0',
            backgroundColor: p.cor,
            animation: `petalFall ${p.duracao} ${p.delay} infinite linear, petalSway 3.5s ${p.delay} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  )
}
