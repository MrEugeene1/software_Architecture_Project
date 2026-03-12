import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagRepository } from '../../domain/repositories/tag.repository';
import { SQLiteTagEntity } from '../entities/tag.sqlite.entity';

@Injectable()
export class SQLiteTagRepository implements TagRepository {
  constructor(
    @InjectRepository(SQLiteTagEntity)
    private readonly repository: Repository<SQLiteTagEntity>,
  ) {}

  async save(tag: TagEntity): Promise<void> {
    const json = tag.toJSON();
    await this.repository.save({
      id: json.id as string,
      name: json.name as string,
      createdAt: json.createdAt as unknown as Date,
    });
  }

  async findById(id: string): Promise<TagEntity | null> {
    const raw = await this.repository.findOne({ where: { id } });
    if (!raw) return null;
    return TagEntity.reconstitute({
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt.toISOString(),
    });
  }

  async findByName(name: string): Promise<TagEntity | null> {
    const raw = await this.repository.findOne({ where: { name } });
    if (!raw) return null;
    return TagEntity.reconstitute({
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt.toISOString(),
    });
  }

  async findAll(): Promise<TagEntity[]> {
    const rawTags = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return rawTags.map((raw) =>
      TagEntity.reconstitute({
        id: raw.id,
        name: raw.name,
        createdAt: raw.createdAt.toISOString(),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
