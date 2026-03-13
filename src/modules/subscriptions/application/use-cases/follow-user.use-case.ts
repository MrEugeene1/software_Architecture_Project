import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(targetUserId: string, currentUser: UserEntity): Promise<void> {
    if (targetUserId === currentUser.id) {
       throw new ConflictException('You cannot follow yourself');
    }

    const targetUser = await this.userRepository.getUserById(targetUserId);
    if (!targetUser) {
      throw new NotFoundException('User to follow doesn\'t exist');
    }

    const existingSubscription = await this.subscriptionRepository.findBySubscriberAndTarget(
      currentUser.id,
      targetUserId,
    );

    if (existingSubscription) {
      throw new ConflictException('You are already following this user');
    }

    const subscription = SubscriptionEntity.create(
      currentUser.id,
      targetUserId,
    );

    await this.subscriptionRepository.save(subscription);
  }
}
