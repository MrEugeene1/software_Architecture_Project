import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { SQLiteSubscriptionEntity } from '../entities/subscription.sqlite.entity';

@Injectable()
export class SQLiteSubscriptionRepository implements SubscriptionRepository {
  constructor(
    @InjectRepository(SQLiteSubscriptionEntity)
    private readonly repository: Repository<SQLiteSubscriptionEntity>,
  ) {}

  public async save(subscription: SubscriptionEntity): Promise<void> {
    const json = subscription.toJSON();
    await this.repository.save({
      id: json.id as string,
      subscriberId: json.subscriberId as string,
      targetId: json.targetId as string,
      createdAt: json.createdAt as Date,
    });
  }

  public async findBySubscriberAndTarget(
    subscriberId: string,
    targetId: string,
  ): Promise<SubscriptionEntity | null> {
    const data = await this.repository.findOne({
      where: { subscriberId, targetId },
    });
    
    if (!data) return null;

    return SubscriptionEntity.reconstitute({
      id: data.id,
      subscriberId: data.subscriberId,
      targetId: data.targetId,
      createdAt: data.createdAt,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async getFollowers(userId: string): Promise<string[]> {
    const data = await this.repository.find({
      where: { targetId: userId },
      select: ['subscriberId'],
      order: { createdAt: 'DESC' },
    });
    return data.map((sub) => sub.subscriberId);
  }

  public async getFollowing(userId: string): Promise<string[]> {
    const data = await this.repository.find({
      where: { subscriberId: userId },
      select: ['targetId'],
      order: { createdAt: 'DESC' },
    });
    return data.map((sub) => sub.targetId);
  }
}
