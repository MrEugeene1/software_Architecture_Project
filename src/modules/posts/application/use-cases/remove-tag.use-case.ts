import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

@Injectable()
export class RemoveTagFromPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postId: string, tagId: string, user: UserEntity): Promise<void> {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    const canEdit =
      post.authorId === user.id || user.permissions.posts.canManageTags();

    if (!canEdit) {
      const error = new Error('Not the post author or admin');
      (error as any).status = 403;
      throw error;
    }

    const tagExistsInPost = post.tags.find((t) => t.id === tagId);
    if (!tagExistsInPost) {
      throw new NotFoundException('Association doesn\'t exist');
    }

    post.removeTag(tagId);
    await this.postRepository.updatePost(postId, post);
  }
}
