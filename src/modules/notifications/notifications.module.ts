import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../shared/auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository';
import { SQLiteNotificationEntity } from './infrastructure/entities/notification.sqlite.entity';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { NotificationController } from './infrastructure/controllers/notification.controller';

import { GetMyNotificationsUseCase } from './application/use-cases/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-cases/mark-all-notifications-as-read.use-case';
import { NotificationListener } from './application/listeners/notification.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteNotificationEntity]),
    AuthModule,
    SubscriptionsModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: SQLiteNotificationRepository,
    },
    GetMyNotificationsUseCase,
    MarkNotificationAsReadUseCase,
    MarkAllNotificationsAsReadUseCase,
    NotificationListener,
  ],
  exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
