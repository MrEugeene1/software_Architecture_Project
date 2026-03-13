import { v4 } from 'uuid';

export class SubscriptionEntity {
  private readonly _subscriberId: string;
  private readonly _targetId: string;
  private readonly _createdAt: Date;

  private constructor(
    readonly id: string,
    subscriberId: string,
    targetId: string,
    createdAt: Date,
  ) {
    this._subscriberId = subscriberId;
    this._targetId = targetId;
    this._createdAt = createdAt;
  }

  public get subscriberId() {
    return this._subscriberId;
  }

  public get targetId() {
    return this._targetId;
  }

  public get createdAt() {
    return this._createdAt;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new SubscriptionEntity(
      input.id as string,
      input.subscriberId as string,
      input.targetId as string,
      input.createdAt as Date,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      subscriberId: this._subscriberId,
      targetId: this._targetId,
      createdAt: this._createdAt,
    };
  }

  public static create(
    subscriberId: string,
    targetId: string,
  ): SubscriptionEntity {
    return new SubscriptionEntity(
      v4(),
      subscriberId,
      targetId,
      new Date(),
    );
  }
}
