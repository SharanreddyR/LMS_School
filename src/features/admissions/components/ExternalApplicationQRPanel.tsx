import { useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { Copy, Check, QrCode, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getExternalApplicationUrl } from '../lib/external-application-url'
import { MobileQrUrlSettings } from './MobileQrUrlSettings'

interface ExternalApplicationQRPanelProps {
  academicYear: string
  refLeadId?: string
  leadName?: string
  compact?: boolean
}

export function ExternalApplicationQRPanel({
  academicYear,
  refLeadId,
  leadName,
  compact,
}: ExternalApplicationQRPanelProps) {
  const [copied, setCopied] = useState(false)
  const [urlVersion, setUrlVersion] = useState(0)

  const applyUrl = useMemo(
    () => getExternalApplicationUrl({ year: academicYear, ref: refLeadId }),
    [academicYear, refLeadId, urlVersion],
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(applyUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${refLeadId ?? 'general'}`)
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = refLeadId ? `external-apply-${refLeadId}.png` : 'external-application-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/20 p-4">
        <MobileQrUrlSettings onUrlChange={() => setUrlVersion((v) => v + 1)} />
        <div className="rounded-lg bg-white p-2 shadow-sm">
          <QRCode id={`qr-${refLeadId ?? 'general'}`} value={applyUrl} size={120} />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Scan to open external application form
          {leadName ? ` for ${leadName}` : ''}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={handleCopy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>
          <a
            href={applyUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'inline-flex')}
            aria-label="Open form"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border-brand-200/60 bg-gradient-to-br from-brand-50/40 to-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="h-5 w-5 text-brand-600" />
          External Application QR Code
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {refLeadId
            ? `Share this QR with ${leadName ?? 'the applicant'} to complete their transfer application on mobile.`
            : 'Parents and transfer students scan this QR to open the online admission form — no login required.'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <MobileQrUrlSettings onUrlChange={() => setUrlVersion((v) => v + 1)} />
        </div>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
          <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-border">
            <QRCode id={`qr-${refLeadId ?? 'general'}`} value={applyUrl} size={168} />
          </div>

          <div className="flex-1 space-y-4">
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">1</span>
                Print or display this QR at reception, brochures, or WhatsApp.
              </li>
              <li className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">2</span>
                Applicant scans with phone camera — form opens in browser.
              </li>
              <li className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">3</span>
                After submit, application appears under External Applications for fee & enrollment.
              </li>
            </ol>

            <div className="rounded-lg border border-border bg-background/80 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Application link</p>
              <p className="break-all font-mono text-xs text-foreground">{applyUrl}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="gap-2" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Link copied' : 'Copy link'}
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download QR
              </Button>
              <a
                href={applyUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'default' }), 'inline-flex gap-2')}
              >
                <ExternalLink className="h-4 w-4" />
                Preview form
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              Academic year: <span className="font-medium text-foreground">{academicYear}</span>
              {refLeadId && (
                <> · Reference: <span className="font-medium text-foreground">{refLeadId}</span></>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
