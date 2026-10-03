import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { PartnershipsService } from './partnerships.service'
import { TelegramAuthGuard, type AuthenticatedRequest } from './telegram-auth.guard'
import { UsersService } from './users.service'
import { PetsService } from './pets.service'

@Controller('partnerships')
@UseGuards(TelegramAuthGuard)
export class PartnershipsController {
  constructor(private readonly partnerships: PartnershipsService, private readonly users: UsersService, private readonly pets: PetsService) {}

  @Post('invite')
  async createInvite(@Req() request: AuthenticatedRequest) {
    const user = await this.users.upsert(request.user)
    return this.partnerships.createInvite(user.id)
  }

  @Post('accept')
  async acceptInvite(@Req() request: AuthenticatedRequest, @Body('token') token: string) {
    const user = await this.users.upsert(request.user)
    const partnership = this.partnerships.acceptInvite(token, user.id)
    return { partnership, pet: this.pets.createStarterPet(partnership) }
  }
}
