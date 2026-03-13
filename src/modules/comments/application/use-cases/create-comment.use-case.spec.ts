import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateCommentUseCase } from './create-comment.use-case';
import { CommentRepository, COMMENT_REPOSITORY } from '../../domain/repositories/comment.repository';
import { PostRepository } from '../../../posts/domain/repositories/post.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';

describe('CreateCommentUseCase', () => {
  let useCase: CreateCommentUseCase;
  let commentRepository: jest.Mocked<CommentRepository>;
  let postRepository: jest.Mocked<PostRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockUser = {
    id: 'user-1',
  } as unknown as UserEntity;

  const mockPost = {
    id: 'post-1',
    authorId: 'author-1',
    status: 'accepted',
  };

  beforeEach(() => {
    commentRepository = {
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CommentRepository>;

    postRepository = {
      getPostById: jest.fn().mockResolvedValue(mockPost),
    } as unknown as jest.Mocked<PostRepository>;

    eventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;

    useCase = new CreateCommentUseCase(commentRepository, postRepository, eventEmitter);
  });

  it('should create a comment and emit event for accepted posts', async () => {
    const dto = { content: 'Great post!' };

    const result = await useCase.execute('post-1', dto, mockUser);

    expect(commentRepository.save).toHaveBeenCalledTimes(1);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'comment.created',
      expect.objectContaining({ postId: 'post-1', authorId: 'user-1' }),
    );
    expect(result).toMatchObject({ content: 'Great post!', authorId: 'user-1', postId: 'post-1' });
  });

  it('should throw NotFoundException when post does not exist', async () => {
    postRepository.getPostById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', { content: 'Hello' }, mockUser))
      .rejects.toThrow(NotFoundException);

    expect(commentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when post is not accepted', async () => {
    postRepository.getPostById.mockResolvedValue({
      ...mockPost,
      status: 'pending',
    } as any);

    await expect(useCase.execute('post-1', { content: 'Hello' }, mockUser))
      .rejects.toThrow('Can only comment on accepted posts');

    expect(commentRepository.save).not.toHaveBeenCalled();
  });
});
