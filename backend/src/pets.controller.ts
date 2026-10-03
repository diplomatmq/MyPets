import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'
import { PetsService, type PetAction } from './pets.service'
import { TelegramAuthGuard } from './telegram-auth.guard'

@Controller('pets')
export class PetsController {
  constructor(private readonly pets: PetsService) {}

  @Get('species')
  listSpecies() {
    return [
      'cat', 'dog', 'monkey', 'crocodile', 'rabbit',
      'fox', 'panda', 'frog', 'bear', 'penguin',
    ].map((key) => ({ key, asset: `/assets/pets/${key}/body.glb` }))
  }

  @Post(':partnershipId/actions')
  @UseGuards(TelegramAuthGuard)
  performAction(@Param('partnershipId') partnershipId: string, @Body('action') action: PetAction, @Headers('idempotency-key') idempotencyKey?: string) {
    const allowed: PetAction[] = ['feed', 'drink', 'play', 'bath', 'sleep']
    if (!allowed.includes(action)) throw new BadRequestException('Unsupported pet action')
    const result = this.pets.performAction(partnershipId, action, idempotencyKey ?? `${partnershipId}:${action}:${Date.now()}`)
    if (!result) throw new NotFoundException('Pet not found')
    return result
  }
}
