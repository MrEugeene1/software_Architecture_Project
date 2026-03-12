import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { AllowAnonymous } from '../../../shared/auth/infrastructure/decorators/allow-anonymous.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';

import { CreateCommentDto, UpdateCommentDto } from '../../application/dtos/comment.dto';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { ListCommentsUseCase } from '../../application/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { CountCommentsUseCase } from '../../application/use-cases/count-comments.use-case';

@Controller()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly countCommentsUseCase: CountCommentsUseCase,
  ) {}

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Body() input: CreateCommentDto,
  ) {
    return this.createCommentUseCase.execute(postId, input, user);
  }

  @Get('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous()
  public async getComments(
    @Param('postId') postId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 10;
    return this.listCommentsUseCase.execute(postId, skipNum, takeNum);
  }

  @Get('posts/:postId/comments/count')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous()
  public async getCommentCount(@Param('postId') postId: string) {
    const count = await this.countCommentsUseCase.execute(postId);
    return { count };
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdateCommentDto,
  ) {
    return this.updateCommentUseCase.execute(id, input, user);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async deleteComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    await this.deleteCommentUseCase.execute(id, user);
  }
}
