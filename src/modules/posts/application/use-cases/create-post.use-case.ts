import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostCreatedEvent } from '../../domain/events/post-created.event';
import { UserCannotCreatePostException } from '../../domain/exceptions/user-cannot-create-post.exception';
import { PostRepository } from '../../domain/repositories/post.repository';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostSlug } from '../../domain/value-objects/post-slug.value-object';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly postRepository: PostRepository,
  ) {}

  public async execute(input: CreatePostDto, user: UserEntity): Promise<void> {
    if (!user.permissions.posts.canCreate()) {
      throw new UserCannotCreatePostException();
    }

    let baseSlug = input.slug || PostSlug.generateFromTitle(input.title);
    let currentSlug = baseSlug;
    let suffix = 2;
    
    // Auto-generate unique slug by appending number if exists
    while (await this.postRepository.getPostBySlug(currentSlug)) {
      currentSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const post = PostEntity.create(input.title, input.content, input.authorId, currentSlug);

    await this.postRepository.createPost(post);

    this.eventEmitter.emit(PostCreatedEvent, {
      postId: post.id,
      authorId: input.authorId,
    });
  }
}
