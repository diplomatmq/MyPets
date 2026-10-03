import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'pets' })
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'partnership_id', type: 'uuid' })
  partnershipId!: string

  @Column({ name: 'species_id', type: 'uuid' })
  speciesId!: string

  @Column({ default: 'Common' })
  rarity!: string

  @Column({ default: 'default' })
  variant!: string

  @Column({ default: 1 })
  level!: number

  @Column({ default: 0 })
  xp!: number

  @Column({ default: true })
  active!: boolean
}
