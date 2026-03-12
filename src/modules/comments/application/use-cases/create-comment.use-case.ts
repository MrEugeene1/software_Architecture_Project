import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import type { CommentRepository } from '../../domain/repositories/comment.repository';
import { CreateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(
    postId: string,
    input: CreateCommentDto,
    user: UserEntity,
  ): Promise<Record<string, unknown>> {
    const post = await this.postRepository.getPostById(postId);
    
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    if (post.status !== 'accepted') {
       throw new Error('Can only comment on accepted posts');
    }

    const comment = CommentEntity.create(input.content, user.id, post.id);

    await this.commentRepository.save(comment);

    this.eventEmitter.emit('comment.created', {
      commentId: comment.id,
      postId: post.id,
      authorId: user.id,
      postAuthorId: post.authorId,
    });

    return comment.toJSON();
  }
}
