import { Injectable, Optional } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { TelegramUser } from './telegram-auth.service'
import { UserEntity } from './entities/user.entity'

export type UserRecord = TelegramUser & { createdAt: string; lastSeenAt: string }

@Injectable()
export class UsersService {
  private readonly users = new Map<number, UserRecord>()

  constructor(@Optional() @InjectRepository(UserEntity) private readonly repository?: Repository<UserEntity>) {}

  async upsert(telegramUser: TelegramUser): Promise<UserRecord> {
    if (this.repository) {
      await this.repository.upsert({
        telegramId: String(telegramUser.id),
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        languageCode: telegramUser.language_code,
      }, ['telegramId'])
      const stored = await this.repository.findOneByOrFail({ telegramId: String(telegramUser.id) })
      return { ...telegramUser, createdAt: stored.createdAt.toISOString(), lastSeenAt: stored.lastSeenAt.toISOString() }
    }

    const now = new Date().toISOString()
    const current = this.users.get(telegramUser.id)
    const user = { ...current, ...telegramUser, createdAt: current?.createdAt ?? now, lastSeenAt: now }
    this.users.set(user.id, user)
    return user
  }
}
