import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('comments')
export class SQLiteCommentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  authorId: string;

  @Column()
  postId: string;

  @CreateDateColumn()
  createdAt: Date;
}
