import { v4 } from 'uuid';

export type NotificationType = 'NEW_POST' | 'NEW_COMMENT';

export class NotificationEntity {
  private readonly _recipientId: string;
  private readonly _type: NotificationType;
  private readonly _message: string;
  private readonly _referenceId: string; // ID of post or comment
  private _isRead: boolean;
  private readonly _createdAt: Date;

  private constructor(
    readonly id: string,
    recipientId: string,
    type: NotificationType,
    message: string,
    referenceId: string,
    isRead: boolean,
    createdAt: Date,
  ) {
    this._recipientId = recipientId;
    this._type = type;
    this._message = message;
    this._referenceId = referenceId;
    this._isRead = isRead;
    this._createdAt = createdAt;
  }

  public get recipientId() {
    return this._recipientId;
  }

  public get isRead() {
    return this._isRead;
  }

  public get createdAt() {
    return this._createdAt;
  }

  public markAsRead() {
    this._isRead = true;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new NotificationEntity(
      input.id as string,
      input.recipientId as string,
      input.type as NotificationType,
      input.message as string,
      input.referenceId as string,
      input.isRead as boolean,
      input.createdAt as Date,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      recipientId: this._recipientId,
      type: this._type,
      message: this._message,
      referenceId: this._referenceId,
      isRead: this._isRead,
      createdAt: this._createdAt,
    };
  }

  public static create(
    recipientId: string,
    type: NotificationType,
    message: string,
    referenceId: string,
  ): NotificationEntity {
    return new NotificationEntity(
      v4(),
      recipientId,
      type,
      message,
      referenceId,
      false,
      new Date(),
    );
  }
}
