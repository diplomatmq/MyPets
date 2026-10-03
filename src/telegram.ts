export type TelegramWebApp = {
  initData: string
  initDataUnsafe: { user?: { id: number; first_name: string; username?: string } }
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  ready: () => void
  expand: () => void
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
  HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

export async function initTelegramWebApp(): Promise<TelegramWebApp | null> {
  await Promise.resolve()
  const webApp = window.Telegram?.WebApp
  if (!webApp) return null

  webApp.ready()
  webApp.expand()
  webApp.setHeaderColor?.('#f6f3ed')
  webApp.setBackgroundColor?.('#f6f3ed')
  document.documentElement.dataset.telegram = 'true'
  document.documentElement.style.setProperty('--tg-safe-top', 'env(safe-area-inset-top)')
  document.documentElement.style.setProperty('--tg-safe-bottom', 'env(safe-area-inset-bottom)')

  return webApp
}

export async function authenticateTelegram(webApp: TelegramWebApp): Promise<TelegramUserResponse | null> {
  if (!webApp.initData) return null
  const apiUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')
  try {
    const response = await fetch(`${apiUrl}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: webApp.initData }),
    })
    if (!response.ok) return null
    return await response.json() as TelegramUserResponse
  } catch {
    return null
  }
}

export async function createPartnershipInvite(webApp: TelegramWebApp): Promise<{ deepLink: string } | null> {
  const apiUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')
  try {
    const response = await fetch(`${apiUrl}/partnerships/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-telegram-init-data': webApp.initData },
    })
    if (!response.ok) return null
    return await response.json() as { deepLink: string }
  } catch {
    return null
  }
}

export async function submitPetAction(webApp: TelegramWebApp, partnershipId: string, action: string, idempotencyKey: string): Promise<boolean> {
  const apiUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')
  try {
    const response = await fetch(`${apiUrl}/pets/${partnershipId}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': webApp.initData,
        'idempotency-key': idempotencyKey,
      },
      body: JSON.stringify({ action }),
    })
    return response.ok
  } catch {
    return false
  }
}

export type TelegramUserResponse = {
  authenticated: boolean
  user: { id: number; first_name: string; last_name?: string; username?: string }
}

export function haptic(webApp: TelegramWebApp | null, style: 'light' | 'medium' | 'heavy' = 'light') {
  webApp?.HapticFeedback?.impactOccurred(style)
}
