import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { SUBSCRIPTION_REPOSITORY } from './domain/repositories/subscription.repository';
import { SQLiteSubscriptionEntity } from './infrastructure/entities/subscription.sqlite.entity';
import { SQLiteSubscriptionRepository } from './infrastructure/repositories/subscription.sqlite.repository';
import { SubscriptionController } from './infrastructure/controllers/subscription.controller';

import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from './application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from './application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from './application/use-cases/get-following.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteSubscriptionEntity]),
    AuthModule,
    UserModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: SQLiteSubscriptionRepository,
    },
    FollowUserUseCase,
    UnfollowUserUseCase,
    GetFollowersUseCase,
    GetFollowingUseCase,
  ],
  exports: [SUBSCRIPTION_REPOSITORY],
})
export class SubscriptionsModule {}
