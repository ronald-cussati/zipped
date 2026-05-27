/**
 * app/page.tsx
 *
 * Landing page — Server Component.
 * Presents the product value proposition and CTA to the creator flow.
 */

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Hero */}
      <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
        <div className="text-6xl animate-bounce">💕</div>

        <h1 className="font-serif text-4xl sm:text-5xl font-light text-gray-800 leading-tight">
          Conte sua história de amor
        </h1>

        <p className="text-base text-gray-500 max-w-sm leading-relaxed">
          Crie uma página única e emocionante para celebrar o relacionamento de vocês — com contador ao vivo, galeria de fotos e linha do tempo.
        </p>

        <Link
          href="/dashboard/criar"
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-base rounded-2xl shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-700 transition-all active:scale-[0.98]"
        >
          Criar minha página 🎉
        </Link>

        <p className="text-xs text-gray-400">
          Por apenas <strong className="text-gray-600">R$ 9,90</strong> · Pagamento via PIX · Publicação imediata
        </p>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
        {[
          { emoji: '⏱️', title: 'Contador ao vivo', desc: 'Mostra há quanto tempo vocês estão juntos, em tempo real.' },
          { emoji: '📸', title: 'Galeria de fotos', desc: 'Compartilhe os momentos mais especiais do casal.' },
          { emoji: '📖', title: 'Linha do tempo', desc: 'Registre os momentos que marcaram a história de vocês.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-left">
            <p className="text-3xl mb-3">{f.emoji}</p>
            <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-xs text-gray-400">
        Feito com ❤️ &nbsp;·&nbsp; CasalPages
      </footer>
    </main>
  )
}
