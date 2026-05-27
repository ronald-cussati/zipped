/**
 * lib/types.ts
 *
 * Single source of truth for all domain types used across the application.
 * Resolves the broken @/lib/types imports in HeroParallax and LinhaDoTempo.
 */

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Tema = 'rosa' | 'azul' | 'dourado' | 'escuro'

export interface PaletaTema {
  label: string
  bg: string
  bgCard: string
  primary: string
  primaryLight: string
  text: string
  textMuted: string
  border: string
}

export const PALETAS: Record<Tema, PaletaTema> = {
  rosa: {
    label: 'Romântico',
    bg: '#fff0f5',
    bgCard: '#ffe0ec',
    primary: '#c2185b',
    primaryLight: '#f48fb1',
    text: '#2d1b2e',
    textMuted: '#7c4a6b',
    border: '#f8bbd9',
  },
  azul: {
    label: 'Moderno',
    bg: '#f0f4ff',
    bgCard: '#dbe4ff',
    primary: '#3b5bdb',
    primaryLight: '#74c0fc',
    text: '#0d1b4b',
    textMuted: '#4263eb',
    border: '#bac8ff',
  },
  dourado: {
    label: 'Clássico',
    bg: '#fffbeb',
    bgCard: '#fef3c7',
    primary: '#92400e',
    primaryLight: '#f59e0b',
    text: '#1c1003',
    textMuted: '#78350f',
    border: '#fcd34d',
  },
  escuro: {
    label: 'Midnight',
    bg: '#0d0d1a',
    bgCard: '#1a1a2e',
    primary: '#a855f7',
    primaryLight: '#818cf8',
    text: '#f1f0ff',
    textMuted: '#c4b5fd',
    border: '#4c1d95',
  },
}

// ─── Timeline Moment ─────────────────────────────────────────────────────────

export interface Momento {
  id: string
  data: string
  titulo: string
  descricao: string
  foto_url?: string | null
}

// ─── Supabase Row ─────────────────────────────────────────────────────────────

/**
 * PaginaCasalRow — mirrors the `paginas_casal` Supabase table schema.
 * Update this when you add columns to the table.
 */
export interface PaginaCasalRow {
  id: string
  slug: string
  nome_pessoa1: string
  nome_pessoa2: string
  contador_data: string          // ISO timestamp — relationship start date
  mensagem: string | null
  tema: Tema
  link_musica: string | null
  ativo: boolean
  fotos: string[] | null         // Array of public image URLs
  momentos: Momento[] | null     // JSONB column
  titulo: string | null          // Custom subtitle/tagline
  foto_capa: string | null       // Hero cover photo URL
  created_at: string
}

// ─── Step types (for the stepper dashboard form) ─────────────────────────────

export type EtapaCriacao = 'basico' | 'personalizar' | 'momentos' | 'revisao'

export interface DadosCriacao {
  // Step 1 — Básico
  nome_pessoa1: string
  nome_pessoa2: string
  contador_data: string
  mensagem: string
  titulo: string
  // Step 2 — Personalização
  tema: Tema
  link_musica: string
  foto_capa: string
  fotos: string[]
  // Step 3 — Momentos
  momentos: Momento[]
}
