import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TAG_REPOSITORY } from '../../domain/repositories/tag.repository';
import type { TagRepository } from '../../domain/repositories/tag.repository';
import { CreateTagDto } from '../dtos/tag.dto';

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(dto: CreateTagDto): Promise<Record<string, unknown>> {
    const existing = await this.tagRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Tag name already exists');
    }

    const tag = TagEntity.create(dto.name);
    await this.tagRepository.save(tag);

    return tag.toJSON();
  }
}
