import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Check, Smartphone, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  detectLocalNetworkBaseUrl,
  getSavedPublicBaseUrl,
  isUsingLocalhostForQr,
  setSavedPublicBaseUrl,
} from '@/lib/mobile-app-url'

interface MobileQrUrlSettingsProps {
  onUrlChange?: () => void
}

export function MobileQrUrlSettings({ onUrlChange }: MobileQrUrlSettingsProps) {
  const [draft, setDraft] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [showWarning, setShowWarning] = useState(false)

  const refresh = useCallback(() => {
    const value = getSavedPublicBaseUrl()
    setSaved(value)
    setDraft(value ?? '')
    setShowWarning(isUsingLocalhostForQr())
  }, [])

  useEffect(() => {
    refresh()
    if (!getSavedPublicBaseUrl() && isUsingLocalhostForQr()) {
      void detectLocalNetworkBaseUrl(
        typeof window !== 'undefined' ? Number(window.location.port || 5173) : 5173,
      ).then((detected) => {
        if (detected) {
          setSavedPublicBaseUrl(detected)
          refresh()
          onUrlChange?.()
        }
      })
    }
  }, [refresh, onUrlChange])

  const handleSave = () => {
    if (!draft.trim()) return
    let url = draft.trim().replace(/\/$/, '')
    if (!/^https?:\/\//i.test(url)) url = `http://${url}`
    setSavedPublicBaseUrl(url)
    refresh()
    onUrlChange?.()
  }

  const handleDetect = async () => {
    setDetecting(true)
    const port = typeof window !== 'undefined' ? window.location.port || '5173' : '5173'
    const detected = await detectLocalNetworkBaseUrl(Number(port))
    setDetecting(false)
    if (detected) {
      setDraft(detected)
      setSavedPublicBaseUrl(detected)
      refresh()
      onUrlChange?.()
    }
  }

  if (!showWarning && saved) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-green-200 bg-green-50/80 px-3 py-2 text-xs text-green-900">
        <Smartphone className="h-4 w-4 shrink-0" />
        <span>Mobile QR uses: <strong className="font-mono">{saved}</strong></span>
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowWarning(true)}>
          Change
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold text-amber-950">Mobile scanning requires your network IP</p>
            <p className="mt-1 text-xs text-amber-900/90">
              Phones cannot open <code className="rounded bg-amber-100 px-1">localhost</code>. Enter your PC&apos;s Wi‑Fi IP
              (run <code className="rounded bg-amber-100 px-1">ipconfig</code> → IPv4 Address) with port{' '}
              <strong>:5173</strong>, then save. Phone and PC must be on the same Wi‑Fi.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="http://192.168.1.5:5173"
              className="bg-white font-mono text-sm"
            />
            <div className="flex shrink-0 gap-2">
              <Button type="button" size="sm" onClick={handleSave} className="gap-1">
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleDetect} disabled={detecting} className="gap-1">
                <Wifi className="h-3.5 w-3.5" />
                {detecting ? 'Detecting…' : 'Auto-detect'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
