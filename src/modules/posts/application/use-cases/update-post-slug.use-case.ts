import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostSlugDto } from '../dtos/update-post-slug.dto';

@Injectable()
export class UpdatePostSlugUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  public async execute(
    id: string,
    input: UpdatePostSlugDto,
    user: UserEntity,
  ): Promise<Record<string, unknown>> {
    const post = await this.postRepository.getPostById(id);
    
    if (!post) {
      throw new NotFoundException('Post doesn\'t exist');
    }

    const canEdit =
      post.authorId === user.id || user.permissions.posts.canDeleteOthers(); // Reusing canDeleteOthers or similar approach for Admin override, let's allow Admin.
      
    if (!canEdit) {
      const error = new Error('Not the post author or admin');
      (error as any).status = 403;
      throw error;
    }
    
    if (post.slug.value !== input.slug) {
      const existing = await this.postRepository.getPostBySlug(input.slug);
      if (existing) {
         throw new ConflictException('Slug already exists');
      }
    }

    post.updateSlug(input.slug);
    await this.postRepository.updatePost(id, post);

    return post.toJSON();
  }
}
