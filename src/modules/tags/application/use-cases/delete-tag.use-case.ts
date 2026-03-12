import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag.repository';
import type { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException('Tag doesn\'t exist');
    }

    await this.tagRepository.delete(id);
  }
}
