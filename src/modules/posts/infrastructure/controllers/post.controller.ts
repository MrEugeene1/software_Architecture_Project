import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { AllowAnonymous } from '../../../shared/auth/infrastructure/decorators/allow-anonymous.decorator';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { UpdatePostSlugDto } from '../../application/dtos/update-post-slug.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { AddTagToPostUseCase } from '../../application/use-cases/add-tag.use-case';
import { RemoveTagFromPostUseCase } from '../../application/use-cases/remove-tag.use-case';
import { UpdatePostSlugUseCase } from '../../application/use-cases/update-post-slug.use-case';

@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly addTagToPostUseCase: AddTagToPostUseCase,
    private readonly removeTagFromPostUseCase: RemoveTagFromPostUseCase,
    private readonly updatePostSlugUseCase: UpdatePostSlugUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous()
  public async getPosts(
    @Query('tags') tags?: string,
    @Requester() user?: UserEntity,
  ) {
    const posts = await this.getPostsUseCase.execute();
    let result = posts.map((p) => p.toJSON());
    
    // Filter for non-authenticated users
    if (!user) {
       result = result.filter((p) => p.status === 'accepted');
    } else if (user.permissions.posts.canDeleteOthers()) {
      // Moderators and admins can see all
    } else {
      // Authors see their own + all accepted
       result = result.filter((p) => p.status === 'accepted' || p.authorId === user.id);
    }

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      result = result.filter(post => {
        const postTags: any[] = (post.tags as any[]) || [];
        return postTags.some(t => tagList.includes(t.name.toLowerCase()));
      });
    }

    return result;
  }

  @Get(':idOrSlug')
  @UseGuards(JwtAuthGuard)
  @AllowAnonymous() // Allow anonymous access for the slug read endpoint
  public async getPostById(
    @Param('idOrSlug') idOrSlug: string,
    @Requester() user?: UserEntity, // This could be undefined if unauthenticated
  ) {
    try {
      const post = await this.getPostByIdUseCase.execute(idOrSlug, user);
      if (!post) {
        throw new NotFoundException('Post doesn\'t exist');
      }
      return post?.toJSON();
    } catch (error: any) {
      if (error.message === 'Cannot read this post') {
        throw new ForbiddenException();
      }
      throw error;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    return this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
  }

  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }
  
  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  public async updatePostSlug(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdatePostSlugDto,
  ) {
    return this.updatePostSlugUseCase.execute(id, input, user);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }

  @Post(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  public async addTagToPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.addTagToPostUseCase.execute(postId, tagId, user);
  }

  @Delete(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async removeTagFromPost(
    @Requester() user: UserEntity,
    @Param('postId') postId: string,
    @Param('tagId') tagId: string,
  ) {
    await this.removeTagFromPostUseCase.execute(postId, tagId, user);
  }
}
