import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'partnerships' })
export class PartnershipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_a_id', type: 'bigint' })
  userAId!: string

  @Column({ name: 'user_b_id', type: 'bigint' })
  userBId!: string

  @Column({ default: 'active' })
  status!: 'pending' | 'active' | 'rejected' | 'archived'

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date
}
