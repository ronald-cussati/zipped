/**
 * app/[slug]/page.tsx
 *
 * Public couple page — Server Component.
 *
 * Data flow:
 *  1. Fetch `paginas_casal` row from Supabase (server-side, no client waterfall)
 *  2. Return 404 if not found or not ativo
 *  3. Generate metadata for SEO
 *  4. Render scroll-snap "Stories" layout with section components
 *
 * Scroll-snap strategy: the outer container uses `scroll-snap-type: y mandatory`
 * and each section uses `scroll-snap-align: start`. This creates the Instagram
 * Stories-like vertical scroll experience on mobile.
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPaginaBySlug } from '@/lib/supabase-server'
import { PALETAS } from '@/lib/types'
import { HeroSection } from '@/components/sections/HeroSection'
import { MessageSection, GallerySection } from '@/components/sections/ContentSections'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { MusicSection } from '@/components/sections/MusicSection'

// ─── Metadata ─────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pagina = await getPaginaBySlug(slug)

  if (!pagina || !pagina.ativo) {
    return { title: 'Página não encontrada — Nossa História' }
  }

  const title = `${pagina.nome_pessoa1} & ${pagina.nome_pessoa2} — Nossa História`
  const description =
    pagina.mensagem?.slice(0, 155) ??
    `A história de amor de ${pagina.nome_pessoa1} e ${pagina.nome_pessoa2}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(pagina.foto_capa && { images: [{ url: pagina.foto_capa, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  const pagina = await getPaginaBySlug(slug)

  // 404 for missing or inactive pages
  if (!pagina || !pagina.ativo) {
    notFound()
  }

  const paleta = PALETAS[pagina.tema]
  const fotos = pagina.fotos ?? []
  const momentos = pagina.momentos ?? []

  return (
    /**
     * Scroll-snap container.
     * - `overflow-y-scroll` (not `auto`) ensures snap works on iOS Safari.
     * - `scroll-snap-type: y mandatory` locks each section to the viewport.
     * - `h-[100svh]` uses small viewport height to account for mobile toolbars.
     */
    <main
      className="h-[100svh] overflow-y-scroll"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
        backgroundColor: paleta.bg,
      }}
    >
      {/* Section 1: Hero Cover */}
      <HeroSection
        nomePessoa1={pagina.nome_pessoa1}
        nomePessoa2={pagina.nome_pessoa2}
        contadorData={pagina.contador_data}
        titulo={pagina.titulo}
        fotoCapa={pagina.foto_capa}
        paleta={paleta}
        tema={pagina.tema}
      />

      {/* Section 2: Love Message */}
      {pagina.mensagem && (
        <MessageSection
          mensagem={pagina.mensagem}
          nomePessoa1={pagina.nome_pessoa1}
          nomePessoa2={pagina.nome_pessoa2}
          paleta={paleta}
        />
      )}

      {/* Section 3: Photo Gallery */}
      {fotos.length > 0 && (
        <GallerySection fotos={fotos} paleta={paleta} />
      )}

      {/* Section 4: Music Player */}
      {pagina.link_musica && (
        <MusicSection musicaUrl={pagina.link_musica} paleta={paleta} />
      )}

      {/* Section 5: Timeline */}
      {momentos.length > 0 && (
        <TimelineSection momentos={momentos} paleta={paleta} />
      )}

      {/* Footer section */}
      <footer
        className="min-h-[40svh] flex flex-col items-center justify-center px-6 text-center"
        style={{ scrollSnapAlign: 'start', backgroundColor: paleta.bg }}
      >
        <p className="text-3xl mb-4">❤️</p>
        <p
          className="font-serif text-xl font-light mb-2"
          style={{ color: paleta.text }}
        >
          {pagina.nome_pessoa1} &amp; {pagina.nome_pessoa2}
        </p>
        <p
          className="text-xs uppercase tracking-widest"
          style={{ color: paleta.textMuted }}
        >
          nossa história
        </p>
        <p
          className="text-[0.65rem] mt-8 opacity-40"
          style={{ color: paleta.textMuted }}
        >
          Feito com ❤️ &nbsp;·&nbsp; CasalPages
        </p>
      </footer>
    </main>
  )
}
