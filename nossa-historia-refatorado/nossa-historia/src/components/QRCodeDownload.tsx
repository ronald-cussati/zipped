'use client'

/**
 * components/QRCodeDownload.tsx
 *
 * Renders a QR Code for a given URL (qrcode.react) and provides a
 * one-click PNG download. Used in the checkout success screen.
 *
 * Install: npm install qrcode.react
 */

import { useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

interface QRCodeDownloadProps {
  url: string
  /** Size in pixels (default: 200) */
  size?: number
  /** Foreground color */
  fgColor?: string
  /** Background color */
  bgColor?: string
  /** Download filename without extension (default: 'qrcode') */
  fileName?: string
  className?: string
}

export function QRCodeDownload({
  url,
  size = 200,
  fgColor = '#111111',
  bgColor = '#ffffff',
  fileName = 'nossa-historia-qr',
  className = '',
}: QRCodeDownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleDownload = useCallback(() => {
    // The QRCodeCanvas renders a <canvas> element; find it via the wrapper
    const canvas = canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${fileName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [fileName])

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* QR Code canvas */}
      <div
        ref={canvasRef}
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{ padding: 12, background: bgColor }}
      >
        <QRCodeCanvas
          value={url}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level="M"
          includeMargin={false}
        />
      </div>

      {/* URL label */}
      <p className="text-xs text-gray-500 break-all text-center max-w-[220px]">{url}</p>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Baixar QR Code
      </button>
    </div>
  )
}

export default QRCodeDownload
