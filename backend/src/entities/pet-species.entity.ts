import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'pet_species' })
export class PetSpeciesEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  key!: string

  @Column({ name: 'display_name' })
  displayName!: string

  @Column({ name: 'asset_url', nullable: true })
  assetUrl?: string

  @Column({ default: true })
  active!: boolean
}
