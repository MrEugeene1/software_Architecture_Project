import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetFollowersUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(userId: string): Promise<Record<string, unknown>[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User doesn\'t exist');
    }

    const followerIds = await this.subscriptionRepository.getFollowers(userId);
    
    // In a real scenario, you'd fetch user details efficiently. 
    // Here we'll map them using the repository in a Promise.all
    const followers = await Promise.all(
      followerIds.map((id) => this.userRepository.getUserById(id))
    );

    return followers.filter((u) => u !== undefined).map((u) => u!.toJSON());
  }
}
