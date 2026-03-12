import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggingService } from '../../../shared/logging/domain/services/logging.service';
import { PostRepository } from '../../domain/repositories/post.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly loggingService: LoggingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(id: string): Promise<void> {
    this.loggingService.log('DeletePostUseCase.execute');
    const post = await this.postRepository.getPostById(id);
    
    if (post) {
      await this.postRepository.deletePost(id);
      
      this.eventEmitter.emit('post.deleted', {
        postId: id,
        authorId: post.authorId,
      });
    }
  }
}
