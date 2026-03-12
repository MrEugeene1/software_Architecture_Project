import { TagEntity } from '../entities/tag.entity';

export interface TagRepository {
  save(tag: TagEntity): Promise<void>;
  findById(id: string): Promise<TagEntity | null>;
  findByName(name: string): Promise<TagEntity | null>;
  findAll(): Promise<TagEntity[]>;
  delete(id: string): Promise<void>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');
