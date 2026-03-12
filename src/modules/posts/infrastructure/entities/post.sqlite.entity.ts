import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, CreateDateColumn } from 'typeorm';
import type { PostStatus } from '../../domain/entities/post.entity';
import { SQLiteTagEntity } from '../../../tags/infrastructure/entities/tag.sqlite.entity';

@Entity('posts')
export class SQLitePostEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  content: string;

  @Column()
  status: PostStatus;

  @Column()
  authorId: string;

  @ManyToMany(() => SQLiteTagEntity, { eager: true, cascade: false })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: SQLiteTagEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
