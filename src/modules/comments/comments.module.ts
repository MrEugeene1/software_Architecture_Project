import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../shared/auth/auth.module';
import { PostModule } from '../posts/post.module';
import { COMMENT_REPOSITORY } from './domain/repositories/comment.repository';
import { SQLiteCommentEntity } from './infrastructure/entities/comment.sqlite.entity';
import { SQLiteCommentRepository } from './infrastructure/repositories/comment.sqlite.repository';
import { CommentController } from './infrastructure/controllers/comment.controller';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { ListCommentsUseCase } from './application/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { CountCommentsUseCase } from './application/use-cases/count-comments.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([SQLiteCommentEntity]),
    AuthModule,
    PostModule,
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: COMMENT_REPOSITORY,
      useClass: SQLiteCommentRepository,
    },
    CreateCommentUseCase,
    ListCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    CountCommentsUseCase,
  ],
  exports: [COMMENT_REPOSITORY],
})
export class CommentsModule {}
