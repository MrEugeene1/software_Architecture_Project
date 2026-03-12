import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(id: string, user: UserEntity): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    
    if (!comment) {
      throw new NotFoundException('Comment doesn\'t exist');
    }

    const post = await this.postRepository.getPostById(comment.postId);
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    const isCommentAuthor = comment.authorId === user.id;
    const isPostAuthor = post.authorId === user.id;
    const isModeratorOrAdmin = user.permissions.posts.canDeleteOthers();

    if (!isCommentAuthor && !isPostAuthor && !isModeratorOrAdmin) {
       throw new ForbiddenException('Not authorized to delete this comment');
    }

    await this.commentRepository.delete(id);
  }
}
