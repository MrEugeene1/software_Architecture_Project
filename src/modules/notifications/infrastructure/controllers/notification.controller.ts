import { Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';

import { GetMyNotificationsUseCase } from '../../application/use-cases/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../../application/use-cases/mark-all-notifications-as-read.use-case';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getMyNotificationsUseCase: GetMyNotificationsUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
  ) {}

  @Get()
  public async getMyNotifications(
    @Requester() user: UserEntity,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 20;
    const isUnreadOnly = unreadOnly === 'true';

    return this.getMyNotificationsUseCase.execute(user, skipNum, takeNum, isUnreadOnly);
  }

  @Patch(':id/read')
  @HttpCode(204)
  public async markAsRead(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.markNotificationAsReadUseCase.execute(id, user);
  }

  @Post('mark-all-read')
  @HttpCode(204)
  public async markAllAsRead(
    @Requester() user: UserEntity,
  ) {
    await this.markAllNotificationsAsReadUseCase.execute(user);
  }
}
