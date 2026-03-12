import { Inject, Injectable } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';

@Injectable()
export class CountCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(postId: string): Promise<number> {
    return this.commentRepository.countByPostId(postId);
  }
}
