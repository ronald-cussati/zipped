'use client'

/**
 * components/TimeCounter.tsx
 *
 * Hydration-safe live counter that shows time elapsed since a given ISO date.
 * 
 * Hydration strategy: renders null on the server (via isMounted guard),
 * then starts counting on the client — eliminates SSR/CSR mismatch entirely.
 * The useEffect starts the interval AFTER hydration completes.
 *
 * Math: correct breakdown using wall-clock subtraction, not getHours() on `now`.
 */

import { useState, useEffect, useCallback } from 'react'
import type { PaletaTema } from '@/lib/types'

interface TimeCounterProps {
  dataInicio: string
  paleta: PaletaTema
}

interface Elapsed {
  anos: number
  meses: number
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calcular(dataInicio: string): Elapsed {
  const inicio = new Date(dataInicio)
  const agora = new Date()

  if (isNaN(inicio.getTime()) || inicio > agora) {
    return { anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 }
  }

  let anos = agora.getFullYear() - inicio.getFullYear()
  let meses = agora.getMonth() - inicio.getMonth()
  let dias = agora.getDate() - inicio.getDate()

  if (dias < 0) {
    meses--
    dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate()
  }
  if (meses < 0) {
    anos--
    meses += 12
  }

  // Correct elapsed time within the current day
  const inicioNesteDia = new Date(
    agora.getFullYear(), agora.getMonth(), agora.getDate(),
    inicio.getHours(), inicio.getMinutes(), inicio.getSeconds()
  )
  const diffMs = agora.getTime() - inicioNesteDia.getTime()
  const diffSecs = Math.abs(Math.floor(diffMs / 1000))

  const horas = Math.floor(diffSecs / 3600)
  const minutos = Math.floor((diffSecs % 3600) / 60)
  const segundos = diffSecs % 60

  return { anos, meses, dias, horas, minutos, segundos }
}

export function TimeCounter({ dataInicio, paleta }: TimeCounterProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [elapsed, setElapsed] = useState<Elapsed>({
    anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0
  })

  const tick = useCallback(() => setElapsed(calcular(dataInicio)), [dataInicio])

  useEffect(() => {
    setIsMounted(true)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  // Render nothing during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex gap-2 justify-center opacity-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-2xl"
            style={{ background: `${paleta.primary}18` }}
          />
        ))}
      </div>
    )
  }

  const units = [
    { value: elapsed.anos,    label: elapsed.anos === 1 ? 'ano' : 'anos' },
    { value: elapsed.meses,   label: elapsed.meses === 1 ? 'mês' : 'meses' },
    { value: elapsed.dias,    label: elapsed.dias === 1 ? 'dia' : 'dias' },
    { value: elapsed.horas,   label: elapsed.horas === 1 ? 'hora' : 'horas' },
    { value: elapsed.minutos, label: 'min' },
    { value: elapsed.segundos,label: 'seg' },
  ]

  return (
    <div className="text-center w-full">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: paleta.textMuted }}
      >
        juntos há
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
        {units.map(({ value, label }) => (
          <div
            key={label}
            className="rounded-2xl py-2 px-1 text-center"
            style={{
              background: `${paleta.primary}15`,
              border: `1px solid ${paleta.primary}25`,
            }}
          >
            <div
              className="text-2xl font-bold leading-none tabular-nums"
              style={{
                color: paleta.primary,
                fontVariantNumeric: 'tabular-nums',
                fontFamily: "'DM Mono', 'Courier New', monospace",
              }}
            >
              {String(value).padStart(2, '0')}
            </div>
            <div
              className="text-[0.6rem] uppercase tracking-wider mt-1"
              style={{ color: paleta.textMuted }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeCounter
