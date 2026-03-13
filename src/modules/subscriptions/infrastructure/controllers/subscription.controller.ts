import { Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { AllowAnonymous } from '../../../shared/auth/infrastructure/decorators/allow-anonymous.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';

import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';

@Controller('users')
export class SubscriptionController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getFollowersUseCase: GetFollowersUseCase,
    private readonly getFollowingUseCase: GetFollowingUseCase,
  ) {}

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async followUser(
    @Requester() user: UserEntity,
    @Param('userId') targetId: string,
  ) {
    await this.followUserUseCase.execute(targetId, user);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async unfollowUser(
    @Requester() user: UserEntity,
    @Param('userId') targetId: string,
  ) {
    await this.unfollowUserUseCase.execute(targetId, user);
  }

  @Get(':userId/followers')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous()
  public async getFollowers(@Param('userId') userId: string) {
    return this.getFollowersUseCase.execute(userId);
  }

  @Get(':userId/following')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous()
  public async getFollowing(@Param('userId') userId: string) {
    return this.getFollowingUseCase.execute(userId);
  }
}
