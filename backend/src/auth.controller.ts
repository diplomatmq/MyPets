import { Body, Controller, Post } from '@nestjs/common'
import { TelegramAuthService } from './telegram-auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly telegramAuth: TelegramAuthService) {}

  @Post('telegram')
  authenticate(@Body('initData') initData: string) {
    const user = this.telegramAuth.validateInitData(initData)
    return { authenticated: true, user }
  }
}
