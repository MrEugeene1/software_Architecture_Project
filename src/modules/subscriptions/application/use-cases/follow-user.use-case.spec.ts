import { ConflictException, NotFoundException } from '@nestjs/common';
import { FollowUserUseCase } from './follow-user.use-case';
import { SubscriptionRepository, SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

describe('FollowUserUseCase', () => {
  let useCase: FollowUserUseCase;
  let subscriptionRepository: jest.Mocked<SubscriptionRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const currentUser = { id: 'user-1' } as unknown as UserEntity;
  const targetUser = { id: 'user-2' } as unknown as UserEntity;

  beforeEach(() => {
    subscriptionRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findBySubscriberAndTarget: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<SubscriptionRepository>;

    userRepository = {
      getUserById: jest.fn().mockResolvedValue(targetUser),
    } as unknown as jest.Mocked<UserRepository>;

    useCase = new FollowUserUseCase(subscriptionRepository, userRepository);
  });

  it('should create a subscription when user follows another user', async () => {
    await useCase.execute('user-2', currentUser);

    expect(subscriptionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException when trying to follow yourself', async () => {
    await expect(useCase.execute('user-1', currentUser))
      .rejects.toThrow(ConflictException);

    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when target user does not exist', async () => {
    userRepository.getUserById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', currentUser))
      .rejects.toThrow(NotFoundException);

    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when already following user', async () => {
    subscriptionRepository.findBySubscriberAndTarget.mockResolvedValue({
      id: 'sub-1',
    } as any);

    await expect(useCase.execute('user-2', currentUser))
      .rejects.toThrow(ConflictException);

    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });
});
