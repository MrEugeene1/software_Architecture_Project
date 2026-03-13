import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MarkNotificationAsReadUseCase } from './mark-notification-as-read.use-case';
import { NotificationRepository, NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';

describe('MarkNotificationAsReadUseCase', () => {
  let useCase: MarkNotificationAsReadUseCase;
  let notificationRepository: jest.Mocked<NotificationRepository>;

  const user = { id: 'user-1' } as unknown as UserEntity;

  const mockNotification = {
    id: 'notif-1',
    recipientId: 'user-1',
    markAsRead: jest.fn(),
  } as unknown as NotificationEntity;

  beforeEach(() => {
    notificationRepository = {
      findById: jest.fn().mockResolvedValue(mockNotification),
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<NotificationRepository>;

    useCase = new MarkNotificationAsReadUseCase(notificationRepository);
  });

  it('should mark notification as read when user is recipient', async () => {
    await useCase.execute('notif-1', user);

    expect(mockNotification.markAsRead).toHaveBeenCalled();
    expect(notificationRepository.save).toHaveBeenCalledWith(mockNotification);
  });

  it('should throw NotFoundException when notification does not exist', async () => {
    notificationRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', user))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when user is not the recipient', async () => {
    const otherUser = { id: 'user-999' } as unknown as UserEntity;

    await expect(useCase.execute('notif-1', otherUser))
      .rejects.toThrow(ForbiddenException);

    expect(notificationRepository.save).not.toHaveBeenCalled();
  });
});
