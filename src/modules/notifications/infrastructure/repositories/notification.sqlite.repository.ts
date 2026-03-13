import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { SQLiteNotificationEntity } from '../entities/notification.sqlite.entity';

@Injectable()
export class SQLiteNotificationRepository implements NotificationRepository {
  constructor(
    @InjectRepository(SQLiteNotificationEntity)
    private readonly repository: Repository<SQLiteNotificationEntity>,
  ) {}

  public async save(notification: NotificationEntity): Promise<void> {
    const json = notification.toJSON();
    await this.repository.save({
      id: json.id as string,
      recipientId: json.recipientId as string,
      type: json.type as 'NEW_POST' | 'NEW_COMMENT',
      message: json.message as string,
      referenceId: json.referenceId as string,
      isRead: json.isRead as boolean,
      createdAt: json.createdAt as Date,
    });
  }

  public async findById(id: string): Promise<NotificationEntity | null> {
    const data = await this.repository.findOne({ where: { id } });
    if (!data) return null;

    return NotificationEntity.reconstitute({
      id: data.id,
      recipientId: data.recipientId,
      type: data.type,
      message: data.message,
      referenceId: data.referenceId,
      isRead: data.isRead,
      createdAt: data.createdAt,
    });
  }

  public async findByRecipientId(
    recipientId: string,
    skip = 0,
    take = 20,
    unreadOnly = false,
  ): Promise<[NotificationEntity[], number]> {
    
    let whereClause: any = { recipientId };
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const [data, total] = await this.repository.findAndCount({
      where: whereClause,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const entities = data.map((d) =>
      NotificationEntity.reconstitute({
        id: d.id,
        recipientId: d.recipientId,
        type: d.type,
        message: d.message,
        referenceId: d.referenceId,
        isRead: d.isRead,
        createdAt: d.createdAt,
      }),
    );

    return [entities, total];
  }

  public async markAllAsRead(recipientId: string): Promise<void> {
    await this.repository.update({ recipientId, isRead: false }, { isRead: true });
  }

  public async countUnread(recipientId: string): Promise<number> {
    return this.repository.count({ where: { recipientId, isRead: false } });
  }
}
