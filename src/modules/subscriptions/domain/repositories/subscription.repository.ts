import { SubscriptionEntity } from '../entities/subscription.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export interface SubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<void>;
  findBySubscriberAndTarget(subscriberId: string, targetId: string): Promise<SubscriptionEntity | null>;
  delete(id: string): Promise<void>;
  getFollowers(userId: string): Promise<string[]>; // Returns list of subscriber user IDs
  getFollowing(userId: string): Promise<string[]>; // Returns list of target user IDs
}
