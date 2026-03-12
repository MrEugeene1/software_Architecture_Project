import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { type UserRole } from '../../domain/entities/user.entity';

@Entity('users')
export class SQLiteUserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  role: UserRole;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
