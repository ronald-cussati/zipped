'use client'

/**
 * app/dashboard/criar/page.tsx
 *
 * 4-step stepper form for creating a couple's page:
 *
 *  Step 0 — Básico: names, date, message, tagline
 *  Step 1 — Personalizar: theme, music URL, cover photo
 *  Step 2 — Momentos: timeline entries
 *  Step 3 — Revisão: live preview + checkout trigger
 *
 * State is held entirely in React (no external store needed).
 * The CheckoutModal handles PIX payment simulation.
 * On confirm, data is inserted into Supabase and the user is redirected.
 */

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { PALETAS, type Tema, type Momento, type DadosCriacao } from '@/lib/types'
import { TemplateCasal } from '@/components/TemplateCasal'
import { CheckoutModal } from '@/components/CheckoutModal'
import { Button, Input, Textarea, StepIndicator } from '@/components/ui'
import type { DadosTemplate } from '@/types/template'

// ─── Constants ────────────────────────────────────────────────────────────────

const TEMAS: { key: Tema; emoji: string; label: string }[] = [
  { key: 'rosa',    emoji: '🌸', label: 'Romântico' },
  { key: 'azul',   emoji: '💙', label: 'Moderno' },
  { key: 'dourado',emoji: '✨', label: 'Clássico' },
  { key: 'escuro', emoji: '🌙', label: 'Midnight' },
]

const STEPS = [
  { label: 'Básico',        icon: '1' },
  { label: 'Aparência',     icon: '2' },
  { label: 'Momentos',      icon: '3' },
  { label: 'Revisão',       icon: '4' },
]

const DEFAULT_DADOS: DadosCriacao = {
  nome_pessoa1: '',
  nome_pessoa2: '',
  contador_data: '',
  mensagem: '',
  titulo: '',
  tema: 'rosa',
  link_musica: '',
  foto_capa: '',
  fotos: [],
  momentos: [],
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CriarPaginaPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [step, setStep] = useState(0)
  const [dados, setDados] = useState<DadosCriacao>(DEFAULT_DADOS)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [slugFinal, setSlugFinal] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof DadosCriacao, string>>>({})

  // ── Helpers ──────────────────────────────────────────────────────────────

  const update = useCallback(
    <K extends keyof DadosCriacao>(key: K, value: DadosCriacao[K]) => {
      setDados((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    },
    []
  )

  const validateStep = useCallback((): boolean => {
    const errs: typeof errors = {}
    if (step === 0) {
      if (!dados.nome_pessoa1.trim()) errs.nome_pessoa1 = 'Obrigatório'
      if (!dados.nome_pessoa2.trim()) errs.nome_pessoa2 = 'Obrigatório'
      if (!dados.contador_data) errs.contador_data = 'Obrigatório'
      if (!dados.mensagem.trim()) errs.mensagem = 'Escreva uma mensagem ❤️'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [step, dados])

  const nextStep = useCallback(() => {
    if (!validateStep()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }, [validateStep])

  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 0)), [])

  // Maps form state → DadosTemplate for live preview
  const previewDados: DadosTemplate = {
    nomes: [dados.nome_pessoa1 || 'Parceiro A', dados.nome_pessoa2 || 'Parceiro B'],
    dataInicio: dados.contador_data || new Date().toISOString(),
    presetTema: dados.tema,
    coresCustomizadas: { bg: '#fff0f5', primary: '#c2185b', text: '#2d1b2e' },
    fonteFamilia: 'serif',
    fotos: dados.fotos,
    musicaUrl: dados.link_musica,
    mensagemPrincipal: dados.mensagem || 'Sua mensagem aparecerá aqui...',
    timelineMomentos: dados.momentos.map((m) => ({
      id: m.id,
      data: m.data,
      titulo: m.titulo,
      descricao: m.descricao,
    })),
  }

  // ── Supabase insert (called from CheckoutModal.onConfirm) ─────────────

  const handlePublicar = useCallback(async () => {
    const supabase = createClient()
    const slug = generateSlug(dados.nome_pessoa1, dados.nome_pessoa2)

    const { error } = await supabase.from('paginas_casal').insert([
      {
        nome_pessoa1: dados.nome_pessoa1,
        nome_pessoa2: dados.nome_pessoa2,
        contador_data: new Date(dados.contador_data).toISOString(),
        mensagem: dados.mensagem,
        titulo: dados.titulo || null,
        tema: dados.tema,
        link_musica: dados.link_musica || null,
        foto_capa: dados.foto_capa || null,
        fotos: dados.fotos.length > 0 ? dados.fotos : null,
        momentos: dados.momentos.length > 0 ? dados.momentos : null,
        slug,
        ativo: true,
      },
    ])

    if (error) throw new Error(error.message)

    setSlugFinal(`${window.location.origin}/${slug}`)
  }, [dados])

  const handleCheckoutClose = useCallback(() => {
    setCheckoutOpen(false)
    if (slugFinal) {
      startTransition(() => {
        router.push(slugFinal.replace(window.location.origin, ''))
      })
    }
  }, [slugFinal, router])

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-xl">💕</span>
          <h1 className="font-serif text-base font-semibold text-gray-800">
            Criar Nossa História
          </h1>
          <div className="ml-auto">
            <StepIndicator steps={STEPS} currentStep={step} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── Step 0: Básico ────────────────────────────────────────── */}
          {step === 0 && (
            <StepPanel key="basico" title="Informações básicas" emoji="💌">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Seu nome"
                  placeholder="Ex: Ana"
                  value={dados.nome_pessoa1}
                  onChange={(e) => update('nome_pessoa1', e.target.value)}
                  error={errors.nome_pessoa1}
                />
                <Input
                  label="Nome do parceiro(a)"
                  placeholder="Ex: Bruno"
                  value={dados.nome_pessoa2}
                  onChange={(e) => update('nome_pessoa2', e.target.value)}
                  error={errors.nome_pessoa2}
                />
              </div>

              <Input
                label="Data de início do relacionamento"
                type="date"
                value={dados.contador_data}
                onChange={(e) => update('contador_data', e.target.value)}
                error={errors.contador_data}
              />

              <Textarea
                label="Mensagem de amor"
                placeholder="Escreva algo bonito que representa vocês dois..."
                value={dados.mensagem}
                onChange={(e) => update('mensagem', e.target.value)}
                error={errors.mensagem}
                rows={4}
              />

              <Input
                label="Subtítulo (opcional)"
                placeholder="Ex: Sempre juntos ❤️"
                value={dados.titulo}
                onChange={(e) => update('titulo', e.target.value)}
                hint="Uma frase curta que aparece abaixo dos nomes na capa"
              />
            </StepPanel>
          )}

          {/* ── Step 1: Personalizar ─────────────────────────────────── */}
          {step === 1 && (
            <StepPanel key="personalizar" title="Personalize sua página" emoji="🎨">
              {/* Theme picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Tema de cor</label>
                <div className="grid grid-cols-2 gap-3">
                  {TEMAS.map((t) => {
                    const paleta = PALETAS[t.key]
                    const isSelected = dados.tema === t.key
                    return (
                      <button
                        key={t.key}
                        onClick={() => update('tema', t.key)}
                        className={`relative flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-pink-400 shadow-md shadow-pink-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          style={{ background: paleta.primary }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{t.emoji} {t.label}</p>
                          <p className="text-xs text-gray-400">{paleta.label}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-[8px]">✓</span>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Input
                label="Link da música (Spotify ou YouTube)"
                placeholder="https://open.spotify.com/track/..."
                value={dados.link_musica}
                onChange={(e) => update('link_musica', e.target.value)}
                hint="Cole o link de uma música especial de vocês"
              />

              <Input
                label="URL da foto de capa (opcional)"
                placeholder="https://..."
                value={dados.foto_capa}
                onChange={(e) => update('foto_capa', e.target.value)}
                hint="Uma foto bonita de vocês como plano de fundo da capa"
              />

              {/* Photo URLs */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  URLs das fotos da galeria (até 6)
                </label>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Input
                    key={i}
                    placeholder={`Foto ${i + 1}: https://...`}
                    value={dados.fotos[i] ?? ''}
                    onChange={(e) => {
                      const arr = [...dados.fotos]
                      arr[i] = e.target.value
                      // Remove trailing empty strings
                      update('fotos', arr.filter((v, idx) => v || idx < i))
                    }}
                  />
                ))}
              </div>
            </StepPanel>
          )}

          {/* ── Step 2: Momentos ─────────────────────────────────────── */}
          {step === 2 && (
            <StepPanel key="momentos" title="Momentos especiais" emoji="📖">
              <p className="text-sm text-gray-500">
                Adicione os momentos que marcaram a história de vocês. Eles aparecerão na linha do tempo.
              </p>

              <div className="flex flex-col gap-4">
                {dados.momentos.map((m, i) => (
                  <MomentoEditor
                    key={m.id}
                    momento={m}
                    index={i}
                    onChange={(updated) => {
                      const arr = [...dados.momentos]
                      arr[i] = updated
                      update('momentos', arr)
                    }}
                    onRemove={() => {
                      update('momentos', dados.momentos.filter((_, idx) => idx !== i))
                    }}
                  />
                ))}
              </div>

              <Button
                variant="secondary"
                onClick={() => {
                  update('momentos', [
                    ...dados.momentos,
                    {
                      id: `m-${Date.now()}`,
                      data: '',
                      titulo: '',
                      descricao: '',
                    },
                  ])
                }}
                className="w-full"
              >
                + Adicionar momento
              </Button>
            </StepPanel>
          )}

          {/* ── Step 3: Revisão ──────────────────────────────────────── */}
          {step === 3 && (
            <StepPanel key="revisao" title="Revise sua página" emoji="✨">
              <p className="text-sm text-gray-500 -mt-2">
                Veja como sua página ficará antes de publicar.
              </p>

              {/* Phone frame preview */}
              <div className="flex justify-center">
                <div className="w-[280px] h-[560px] bg-white rounded-[40px] shadow-2xl shadow-gray-300 border-4 border-gray-800 overflow-hidden relative flex-shrink-0">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-800 rounded-full z-10" />
                  <div className="h-full overflow-y-auto overflow-x-hidden">
                    <TemplateCasal dados={previewDados} isPreview ativo />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-pink-50 rounded-2xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-pink-800">📋 Resumo</p>
                <p className="text-gray-600">
                  <strong>Casal:</strong> {dados.nome_pessoa1} &amp; {dados.nome_pessoa2}
                </p>
                <p className="text-gray-600">
                  <strong>Tema:</strong> {PALETAS[dados.tema].label}
                </p>
                <p className="text-gray-600">
                  <strong>Momentos:</strong> {dados.momentos.length}
                </p>
                <p className="text-gray-600">
                  <strong>Fotos:</strong> {dados.fotos.filter(Boolean).length}
                </p>
                <p className="text-gray-600">
                  <strong>URL:</strong>{' '}
                  <span className="font-mono text-pink-600">
                    /{generateSlug(dados.nome_pessoa1, dados.nome_pessoa2)}
                  </span>
                </p>
              </div>

              {/* Publish CTA */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setCheckoutOpen(true)}
              >
                🎉 Publicar por R$ 9,90
              </Button>
            </StepPanel>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="secondary" onClick={prevStep} className="flex-1">
              ← Voltar
            </Button>
          )}
          {step < STEPS.length - 1 && (
            <Button variant="primary" onClick={nextStep} className="flex-1">
              Próximo →
            </Button>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCheckoutClose}
        slugUrl={
          slugFinal ||
          `${typeof window !== 'undefined' ? window.location.origin : ''}/${generateSlug(
            dados.nome_pessoa1,
            dados.nome_pessoa2
          )}`
        }
        onConfirm={handlePublicar}
      />

      {isPending && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 flex items-center gap-4 shadow-xl">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">Abrindo sua página…</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── StepPanel ────────────────────────────────────────────────────────────────

function StepPanel({
  title,
  emoji,
  children,
}: {
  title: string
  emoji: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col gap-5"
    >
      <div>
        <h2 className="text-xl font-serif font-semibold text-gray-800">
          {emoji} {title}
        </h2>
      </div>
      {children}
    </motion.div>
  )
}

// ─── MomentoEditor ────────────────────────────────────────────────────────────

function MomentoEditor({
  momento,
  index,
  onChange,
  onRemove,
}: {
  momento: Momento
  index: number
  onChange: (m: Momento) => void
  onRemove: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-500">
          Momento {index + 1}
        </p>
        <button
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remover
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Título"
          placeholder="Ex: Primeiro encontro"
          value={momento.titulo}
          onChange={(e) => onChange({ ...momento, titulo: e.target.value })}
        />
        <Input
          label="Data"
          type="date"
          value={momento.data}
          onChange={(e) => onChange({ ...momento, data: e.target.value })}
        />
      </div>

      <Textarea
        label="Descrição"
        placeholder="O que aconteceu nesse dia..."
        value={momento.descricao}
        onChange={(e) => onChange({ ...momento, descricao: e.target.value })}
        rows={2}
      />
    </div>
  )
}
