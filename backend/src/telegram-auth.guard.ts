import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { TelegramAuthService, type TelegramUser } from './telegram-auth.service'

export type AuthenticatedRequest = { headers: Record<string, string | undefined>; user: TelegramUser }

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  constructor(private readonly telegramAuth: TelegramAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const initData = request.headers['x-telegram-init-data']
    if (typeof initData !== 'string') throw new UnauthorizedException('Telegram init data header is required')
    request.user = this.telegramAuth.validateInitData(initData)
    return true
  }
}
