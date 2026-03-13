import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.recipientId !== user.id) {
       throw new ForbiddenException('Not authorized to mark this notification as read');
    }

    notification.markAsRead();
    await this.notificationRepository.save(notification);
  }
}
