/**
 * components/contador/ContadorTempo.tsx
 *
 * Compatibility re-export for HeroParallax.tsx which imports from this path.
 * The canonical implementation lives in @/components/TimeCounter.
 *
 * This version adapts the interface expected by HeroParallax:
 *  dataInicioISO: string
 *  tema: Tema
 */

'use client'

import { TimeCounter } from '@/components/TimeCounter'
import { PALETAS, type Tema } from '@/lib/types'

interface ContadorTempoProps {
  dataInicioISO: string
  tema: Tema
}

export function ContadorTempo({ dataInicioISO, tema }: ContadorTempoProps) {
  return <TimeCounter dataInicio={dataInicioISO} paleta={PALETAS[tema]} />
}

export default ContadorTempo
