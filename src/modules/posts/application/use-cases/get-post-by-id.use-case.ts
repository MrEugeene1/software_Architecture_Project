import { Injectable } from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
  ) {}

  public async execute(
    idOrSlug: string,
    user?: UserEntity, // Make user optional for unauthenticated readers
  ): Promise<PostEntity | undefined> {
    this.loggingService.log('GetPostByIdUseCase.execute');
    
    let post = await this.postRepository.getPostById(idOrSlug);
    if (!post) {
      post = await this.postRepository.getPostBySlug(idOrSlug);
    }
    
    if (!post) return;

    if (user) {
      if (!user.permissions.posts.canReadPost(post)) {
        throw new Error('Cannot read this post');
      }
    } else {
      // Unauthenticated user can only read accepted posts
      if (post.status !== 'accepted') {
        throw new Error('Cannot read this post');
      }
    }

    return post;
  }
}
