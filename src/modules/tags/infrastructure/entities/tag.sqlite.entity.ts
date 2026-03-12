import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
