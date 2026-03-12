import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string, input: UpdatePostDto): Promise<void> {
    this.loggingService.log('UpdatePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);

    if (post) {
      post.update(input.title, input.content);
      await this.postRepository.updatePost(id, post);
      
      this.eventEmitter.emit('post.updated', {
        postId: post.id,
        authorId: post.authorId,
      });
    }
  }
}
