import { Injectable } from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import type { Partnership } from './partnerships.service'

export type PetRecord = {
  id: string
  partnershipId: string
  species: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic'
  variant: string
  level: number
  xp: number
  stats: { health: number; energy: number; hunger: number; thirst: number; mood: number; cleanliness: number }
}

export type PetAction = 'feed' | 'drink' | 'play' | 'bath' | 'sleep'

@Injectable()
export class PetsService {
  private readonly pets = new Map<string, PetRecord>()
  private readonly idempotentActions = new Map<string, { pet: PetRecord; coins: number }>()

  createStarterPet(partnership: Partnership): PetRecord {
    const existing = this.pets.get(partnership.id)
    if (existing) return existing
    const species = ['cat', 'dog', 'monkey', 'fox'][Math.floor(Math.random() * 4)]
    const pet: PetRecord = {
      id: randomBytes(16).toString('hex'),
      partnershipId: partnership.id,
      species,
      rarity: 'Common',
      variant: 'default',
      level: 1,
      xp: 0,
      stats: { health: 100, energy: 100, hunger: 100, thirst: 100, mood: 100, cleanliness: 100 },
    }
    this.pets.set(partnership.id, pet)
    return pet
  }

  findByPartnership(partnershipId: string) {
    return this.pets.get(partnershipId) ?? null
  }

  performAction(partnershipId: string, action: PetAction, idempotencyKey: string) {
    const previous = this.idempotentActions.get(idempotencyKey)
    if (previous) return previous
    const pet = this.pets.get(partnershipId)
    if (!pet) return null
    const changes: Record<PetAction, Partial<PetRecord['stats']>> = {
      feed: { hunger: 25, mood: 5 },
      drink: { thirst: 30 },
      play: { mood: 20, energy: -10 },
      bath: { cleanliness: 40, mood: 10 },
      sleep: { energy: 40 },
    }
    for (const [stat, amount] of Object.entries(changes[action])) {
      const key = stat as keyof PetRecord['stats']
      pet.stats[key] = Math.max(0, Math.min(100, pet.stats[key] + (amount ?? 0)))
    }
    pet.xp += 10
    const result = { pet, coins: 25 }
    this.idempotentActions.set(idempotencyKey, result)
    return result
  }
}
