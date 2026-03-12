import { Inject, Injectable } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag.repository';
import type { TagRepository } from '../../domain/repositories/tag.repository';

@Injectable()
export class ListTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(): Promise<{ tags: Record<string, unknown>[] }> {
    const tags = await this.tagRepository.findAll();
    return {
      tags: tags.map((t) => t.toJSON()),
    };
  }
}
