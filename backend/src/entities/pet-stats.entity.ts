import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'pet_stats' })
export class PetStatsEntity {
  @PrimaryColumn({ name: 'pet_id', type: 'uuid' })
  petId!: string

  @Column({ default: 100 }) health!: number
  @Column({ default: 100 }) energy!: number
  @Column({ default: 100 }) hunger!: number
  @Column({ default: 100 }) thirst!: number
  @Column({ default: 100 }) mood!: number
  @Column({ default: 100 }) cleanliness!: number
  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) updatedAt!: Date
}
