import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';

@Injectable()
export class ListCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(
    postId: string,
    skip: number = 0,
    take: number = 10,
  ): Promise<{ data: Record<string, unknown>[]; total: number }> {
    const post = await this.postRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    const [comments, total] = await this.commentRepository.findByPostId(postId, skip, take);

    return {
      data: comments.map((c) => c.toJSON()),
      total,
    };
  }
}
