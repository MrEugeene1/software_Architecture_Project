import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class GetMyNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    user: UserEntity,
    skip: number = 0,
    take: number = 20,
    unreadOnly: boolean = false,
  ): Promise<{ data: Record<string, unknown>[]; total: number; unreadCount: number }> {
    const [notifications, total] = await this.notificationRepository.findByRecipientId(
      user.id,
      skip,
      take,
      unreadOnly,
    );

    const unreadCount = await this.notificationRepository.countUnread(user.id);

    return {
      data: notifications.map((n) => n.toJSON()),
      total,
      unreadCount,
    };
  }
}
