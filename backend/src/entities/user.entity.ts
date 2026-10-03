import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({ name: 'telegram_id', type: 'bigint', unique: true })
  telegramId!: string

  @Column({ name: 'first_name' })
  firstName!: string

  @Column({ name: 'last_name', nullable: true })
  lastName?: string

  @Column({ nullable: true })
  username?: string

  @Column({ name: 'language_code', nullable: true })
  languageCode?: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt!: Date
}
