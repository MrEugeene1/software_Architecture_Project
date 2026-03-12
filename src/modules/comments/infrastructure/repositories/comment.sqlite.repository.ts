import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { CommentRepository } from '../../domain/repositories/comment.repository';
import { SQLiteCommentEntity } from '../entities/comment.sqlite.entity';

@Injectable()
export class SQLiteCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(SQLiteCommentEntity)
    private readonly repository: Repository<SQLiteCommentEntity>,
  ) {}

  public async save(comment: CommentEntity): Promise<void> {
    const json = comment.toJSON();
    await this.repository.save({
      id: json.id as string,
      content: json.content as string,
      authorId: json.authorId as string,
      postId: json.postId as string,
      createdAt: json.createdAt as Date,
    });
  }

  public async findById(id: string): Promise<CommentEntity | null> {
    const data = await this.repository.findOne({ where: { id } });
    if (!data) return null;

    return CommentEntity.reconstitute({
      id: data.id,
      content: data.content,
      authorId: data.authorId,
      postId: data.postId,
      createdAt: data.createdAt,
    });
  }

  public async findByPostId(
    postId: string,
    skip = 0,
    take = 10,
  ): Promise<[CommentEntity[], number]> {
    const [data, total] = await this.repository.findAndCount({
      where: { postId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const entities = data.map((d) =>
      CommentEntity.reconstitute({
        id: d.id,
        content: d.content,
        authorId: d.authorId,
        postId: d.postId,
        createdAt: d.createdAt,
      }),
    );

    return [entities, total];
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async countByPostId(postId: string): Promise<number> {
    return this.repository.count({ where: { postId } });
  }
}
