import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import { UpdateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    id: string,
    input: UpdateCommentDto,
    user: UserEntity,
  ): Promise<Record<string, unknown>> {
    const comment = await this.commentRepository.findById(id);
    
    if (!comment) {
      throw new NotFoundException('Comment doesn\'t exist');
    }

    if (comment.authorId !== user.id) {
       throw new ForbiddenException('Only the comment author can update it');
    }

    comment.update(input.content);
    await this.commentRepository.save(comment);

    return comment.toJSON();
  }
}
