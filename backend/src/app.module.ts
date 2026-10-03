import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthController } from './health.controller'
import { PetsController } from './pets.controller'
import { AuthController } from './auth.controller'
import { TelegramAuthService } from './telegram-auth.service'
import { TelegramAuthGuard } from './telegram-auth.guard'
import { PartnershipsController } from './partnerships.controller'
import { PartnershipsService } from './partnerships.service'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { PetSpeciesEntity } from './entities/pet-species.entity'
import { PartnershipEntity } from './entities/partnership.entity'
import { PetEntity } from './entities/pet.entity'
import { PetStatsEntity } from './entities/pet-stats.entity'
import { PetsService } from './pets.service'

@Module({
  imports: process.env.DATABASE_URL ? [TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [UserEntity, PetSpeciesEntity, PartnershipEntity, PetEntity, PetStatsEntity],
    synchronize: false,
    retryAttempts: 2,
  }), TypeOrmModule.forFeature([UserEntity])] : [],
  controllers: [HealthController, PetsController, AuthController, PartnershipsController],
  providers: [TelegramAuthService, TelegramAuthGuard, PartnershipsService, UsersService, PetsService],
})
export class AppModule {}
