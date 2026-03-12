import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { TAG_REPOSITORY } from '../../../tags/domain/repositories/tag.repository';
import type { TagRepository } from '../../../tags/domain/repositories/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class AddTagToPostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(postId: string, tagId: string, user: UserEntity): Promise<Record<string, unknown>> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    const canEdit =
      post.authorId === user.id || user.permissions.posts.canManageTags();

    if (!canEdit) {
      // Throw 403. Based on our requirements: Required (post author or ADMIN)
      const error = new Error('Not the post author or admin');
      (error as any).status = 403;
      throw error;
    }

    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new NotFoundException('Tag doesn\'t exist');
    }

    const tagJson = tag.toJSON();

    post.addTag({ id: tagJson.id as string, name: tagJson.name as string });
    await this.postRepository.updatePost(postId, post);

    return post.toJSON();
  }
}
