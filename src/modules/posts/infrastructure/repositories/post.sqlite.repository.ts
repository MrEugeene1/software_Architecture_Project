import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostEntity } from '../../domain/entities/post.entity';
import { PostRepository } from '../../domain/repositories/post.repository';
import { SQLitePostEntity } from '../entities/post.sqlite.entity';
import { SQLiteTagEntity } from '../../../tags/infrastructure/entities/tag.sqlite.entity';

@Injectable()
export class SQLitePostRepository implements PostRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async getPosts(): Promise<PostEntity[]> {
    const data = await this.dataSource.getRepository(SQLitePostEntity).find();

    return data.map((post) => PostEntity.reconstitute({
      ...post,
      tags: post.tags ? post.tags.map(t => ({ id: t.id, name: t.name })) : [],
    }));
  }

  public async getPostById(id: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { id } });

    if (!post) {
      return undefined;
    }

    return PostEntity.reconstitute({
      ...post,
      tags: post.tags ? post.tags.map(t => ({ id: t.id, name: t.name })) : [],
    });
  }

  public async getPostBySlug(slug: string): Promise<PostEntity | undefined> {
    const post = await this.dataSource
      .getRepository(SQLitePostEntity)
      .findOne({ where: { slug } });

    if (!post) {
      return undefined;
    }

    return PostEntity.reconstitute({
      ...post,
      tags: post.tags ? post.tags.map(t => ({ id: t.id, name: t.name })) : [],
    });
  }

  public async createPost(input: PostEntity): Promise<void> {
    const json = input.toJSON();
    
    await this.dataSource.getRepository(SQLitePostEntity).save({
      id: json.id as string,
      title: json.title as string,
      slug: json.slug as string,
      content: json.content as string,
      status: json.status as any,
      authorId: json.authorId as string,
      tags: json.tags as any[],
    });
  }

  public async updatePost(id: string, input: PostEntity): Promise<void> {
    const json = input.toJSON();

    const postRepo = this.dataSource.getRepository(SQLitePostEntity);
    
    const postToUpdate = await postRepo.findOne({ where: { id }});
    if (postToUpdate) {
      postToUpdate.title = json.title as string;
      postToUpdate.slug = json.slug as string;
      postToUpdate.content = json.content as string;
      postToUpdate.status = json.status as any;
      postToUpdate.tags = json.tags as any[];
      
      await postRepo.save(postToUpdate);
    }
  }

  public async deletePost(id: string): Promise<void> {
    await this.dataSource.getRepository(SQLitePostEntity).delete(id);
  }
}
