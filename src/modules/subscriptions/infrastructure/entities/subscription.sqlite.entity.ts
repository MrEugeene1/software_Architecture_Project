import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity('subscriptions')
@Unique(['subscriberId', 'targetId'])
export class SQLiteSubscriptionEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  subscriberId: string;

  @Column()
  targetId: string;

  @CreateDateColumn()
  createdAt: Date;
}
