import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(targetUserId: string, currentUser: UserEntity): Promise<void> {
    const existingSubscription = await this.subscriptionRepository.findBySubscriberAndTarget(
      currentUser.id,
      targetUserId,
    );

    if (!existingSubscription) {
      throw new NotFoundException('You are not following this user');
    }

    await this.subscriptionRepository.delete(existingSubscription.id);
  }
}
