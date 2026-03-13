import { NotificationEntity } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepository {
  save(notification: NotificationEntity): Promise<void>;
  findById(id: string): Promise<NotificationEntity | null>;
  findByRecipientId(recipientId: string, skip?: number, take?: number, unreadOnly?: boolean): Promise<[NotificationEntity[], number]>;
  markAllAsRead(recipientId: string): Promise<void>;
  countUnread(recipientId: string): Promise<number>;
}
