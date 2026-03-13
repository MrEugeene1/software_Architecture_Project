import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import type { NotificationType } from '../../domain/entities/notification.entity';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  recipientId: string;

  @Column({ type: 'varchar' })
  type: NotificationType;

  @Column()
  message: string;

  @Column()
  referenceId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
