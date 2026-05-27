'use client'

/**
 * components/CheckoutModal.tsx
 *
 * Elegant PIX checkout modal with:
 *  - Frosted-glass backdrop
 *  - Framer Motion entrance/exit
 *  - Fake PIX QR Code (qrcode.react)
 *  - Copia-e-cola key with copy feedback
 *  - Simulated payment confirmation
 *  - Success screen with final URL + QR Code download
 */

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { QRCodeDownload } from '@/components/QRCodeDownload'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fake PIX payload — replace with real payment gateway in production */
const PIX_CHAVE = '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.905802BR5913CasalPages6009SAO PAULO62070503***6304ABCD'
const PIX_PRECO = 'R$ 9,90'
const PIX_DESTINATARIO = 'CasalPages'

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalStep = 'pix' | 'aguardando' | 'sucesso'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  /** The final slug URL that will be activated after payment */
  slugUrl: string
  /** Called when user confirms payment — save the page here */
  onConfirm: () => Promise<void>
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutModal({
  isOpen,
  onClose,
  slugUrl,
  onConfirm,
}: CheckoutModalProps) {
  const [step, setStep] = useState<ModalStep>('pix')
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep('pix')
  }, [isOpen])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(PIX_CHAVE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }, [])

  const handleConfirm = useCallback(async () => {
    setConfirming(true)
    setStep('aguardando')
    try {
      await onConfirm()
      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 1500))
      setStep('sucesso')
    } catch {
      setStep('pix')
    } finally {
      setConfirming(false)
    }
  }, [onConfirm])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.55)' }}
            onClick={(e) => { if (e.target === e.currentTarget && step === 'pix') onClose() }}
          >
            {/* Modal panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {step === 'pix' && (
                  <PixStep
                    key="pix"
                    onCopy={handleCopy}
                    copied={copied}
                    onConfirm={handleConfirm}
                    onClose={onClose}
                  />
                )}
                {step === 'aguardando' && (
                  <AguardandoStep key="aguardando" />
                )}
                {step === 'sucesso' && (
                  <SucessoStep
                    key="sucesso"
                    slugUrl={slugUrl}
                    onClose={onClose}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── PIX Step ─────────────────────────────────────────────────────────────────

function PixStep({
  onCopy,
  copied,
  onConfirm,
  onClose,
}: {
  onCopy: () => void
  copied: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 flex flex-col items-center gap-5"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Finalizar Pagamento</h2>
          <p className="text-xs text-gray-500">Pague via PIX para publicar sua página</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Price badge */}
      <div className="bg-green-50 text-green-700 font-bold text-2xl px-6 py-2 rounded-2xl border border-green-200">
        {PIX_PRECO}
      </div>

      {/* QR Code */}
      <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100">
        <QRCodeCanvas
          value={PIX_CHAVE}
          size={180}
          fgColor="#111111"
          bgColor="#ffffff"
          level="M"
        />
      </div>

      <p className="text-xs text-gray-500 text-center -mt-2">
        Escaneie com o app do seu banco
      </p>

      {/* Copy key */}
      <div className="w-full">
        <p className="text-xs font-semibold text-gray-600 mb-1.5">
          Ou use o código copia e cola:
        </p>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 font-mono truncate">
            {PIX_CHAVE.slice(0, 40)}…
          </div>
          <button
            onClick={onCopy}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Destinatário */}
      <p className="text-xs text-gray-400 text-center -mt-2">
        Destinatário: <strong className="text-gray-600">{PIX_DESTINATARIO}</strong>
      </p>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-base shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-700 transition-all active:scale-[0.98]"
      >
        Já realizei o pagamento ✓
      </button>

      <p className="text-[0.65rem] text-gray-400 text-center">
        Ao confirmar, sua página será publicada imediatamente. <br />
        O pagamento é verificado automaticamente em produção.
      </p>
    </motion.div>
  )
}

// ─── Aguardando Step ──────────────────────────────────────────────────────────

function AguardandoStep() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-10 flex flex-col items-center gap-4 min-h-[300px] justify-center"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-pink-100" />
        <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-700 font-semibold">Verificando pagamento…</p>
      <p className="text-xs text-gray-400">Isso leva apenas alguns segundos</p>
    </motion.div>
  )
}

// ─── Sucesso Step ─────────────────────────────────────────────────────────────

function SucessoStep({ slugUrl, onClose }: { slugUrl: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', damping: 22 }}
      className="p-6 flex flex-col items-center gap-5"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1, damping: 12 }}
        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl"
      >
        🎉
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Página publicada!</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sua história agora está no ar. Compartilhe com quem você ama.
        </p>
      </div>

      {/* URL box */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-2">
        <span className="text-xs font-mono text-gray-700 flex-1 break-all">{slugUrl}</span>
        <button
          onClick={() => navigator.clipboard.writeText(slugUrl)}
          className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          Copiar
        </button>
      </div>

      {/* QR Code for the page */}
      <QRCodeDownload
        url={slugUrl}
        size={160}
        fgColor="#111111"
        fileName="nossa-historia-link"
      />

      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all"
      >
        Ver minha página →
      </button>
    </motion.div>
  )
}
