import { env } from '@/config/env'

const STORAGE_KEY = 'lms_public_app_base_url'

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

/** Saved base URL for QR codes (e.g. http://192.168.1.5:5173) — phones cannot open localhost. */
export function getSavedPublicBaseUrl(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setSavedPublicBaseUrl(url: string) {
  const trimmed = url.trim().replace(/\/$/, '')
  localStorage.setItem(STORAGE_KEY, trimmed)
}

export function clearSavedPublicBaseUrl() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Origin used in QR codes and share links.
 * Priority: VITE_PUBLIC_APP_URL → saved LAN URL → current origin (if not localhost).
 */
export function getPublicAppOrigin(): string {
  if (env.publicAppUrl) {
    return env.publicAppUrl.replace(/\/$/, '')
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5173'
  }

  const saved = getSavedPublicBaseUrl()
  if (saved) return saved

  const { protocol, hostname, port } = window.location
  if (!isLocalHost(hostname)) {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  return window.location.origin
}

export function isUsingLocalhostForQr(): boolean {
  if (typeof window === 'undefined') return false
  if (env.publicAppUrl) return false
  if (getSavedPublicBaseUrl()) return false
  return isLocalHost(window.location.hostname)
}

/** Best-effort LAN IP via WebRTC — works in Chrome/Edge on same Wi‑Fi. */
export function detectLocalNetworkBaseUrl(port = 5173): Promise<string | null> {
  if (typeof window === 'undefined' || !window.RTCPeerConnection) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    let resolved = false
    const finish = (value: string | null) => {
      if (resolved) return
      resolved = true
      try {
        pc.close()
      } catch {
        /* ignore */
      }
      resolve(value)
    }

    const pc = new RTCPeerConnection({ iceServers: [] })
    pc.createDataChannel('probe')
    pc.onicecandidate = (event) => {
      if (!event.candidate?.candidate) return
      const match = /(\d{1,3}(?:\.\d{1,3}){3})/.exec(event.candidate.candidate)
      const ip = match?.[1]
      if (ip && !ip.startsWith('127.') && !ip.startsWith('0.')) {
        finish(`http://${ip}:${port}`)
      }
    }

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => finish(null))

    setTimeout(() => finish(null), 3500)
  })
}
