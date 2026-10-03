import { Injectable, UnauthorizedException } from '@nestjs/common'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

@Injectable()
export class TelegramAuthService {
  validateInitData(initData: string): TelegramUser {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken || !initData) throw new UnauthorizedException('Telegram authentication is not configured')

    const params = new URLSearchParams(initData)
    const receivedHash = params.get('hash')
    const authDate = Number(params.get('auth_date'))
    if (!receivedHash || !Number.isFinite(authDate)) throw new UnauthorizedException('Invalid Telegram init data')

    const age = Math.floor(Date.now() / 1000) - authDate
    if (age < 0 || age > 86400) throw new UnauthorizedException('Telegram init data expired')

    const dataCheckString = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
    const calculatedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
    const receivedBuffer = Buffer.from(receivedHash, 'hex')
    const calculatedBuffer = Buffer.from(calculatedHash, 'hex')
    if (receivedBuffer.length !== calculatedBuffer.length || !timingSafeEqual(receivedBuffer, calculatedBuffer)) {
      throw new UnauthorizedException('Telegram signature mismatch')
    }

    const userValue = params.get('user')
    if (!userValue) throw new UnauthorizedException('Telegram user is missing')
    try {
      return JSON.parse(userValue) as TelegramUser
    } catch {
      throw new UnauthorizedException('Telegram user payload is invalid')
    }
  }
}
