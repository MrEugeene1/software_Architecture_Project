import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag.repository';
import type { TagRepository } from '../../domain/repositories/tag.repository';
import { UpdateTagDto } from '../dtos/tag.dto';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(id: string, dto: UpdateTagDto): Promise<Record<string, unknown>> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException('Tag doesn\'t exist');
    }

    // Check conflict if name is changed
    if (tag.name.value !== dto.name) {
      const existing = await this.tagRepository.findByName(dto.name);
      if (existing) {
        throw new ConflictException('New name already exists');
      }
    }

    tag.update(dto.name);
    await this.tagRepository.save(tag);

    return tag.toJSON();
  }
}
