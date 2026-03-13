import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { SUBSCRIPTION_REPOSITORY } from '../../../subscriptions/domain/repositories/subscription.repository';
import type { SubscriptionRepository } from '../../../subscriptions/domain/repositories/subscription.repository';
import type { PostCreatedEventPayload } from '../../../posts/domain/events/post-created.event';

// CommentCreated payload from create-comment.use-case.ts
export type CommentCreatedEventPayload = {
  commentId: string;
  postId: string;
  authorId: string;
  postAuthorId: string;
};

@Injectable()
export class NotificationListener {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  @OnEvent('post.created')
  public async handlePostCreatedEvent(payload: PostCreatedEventPayload) {
    // Notify all followers of the post author
    const followerIds = await this.subscriptionRepository.getFollowers(payload.authorId);

    const notifications = followerIds.map((followerId) => 
      NotificationEntity.create(
        followerId,
        'NEW_POST',
        `A user you follow just published a new post!`,
        payload.postId,
      )
    );

    // Save all notifications
    // Note: In a production app, this should be done in batches or pushed to a queue
    for (const notification of notifications) {
      await this.notificationRepository.save(notification);
    }
  }

  @OnEvent('comment.created')
  public async handleCommentCreatedEvent(payload: CommentCreatedEventPayload) {
    // Notify the post author that someone commented on their post
    if (payload.authorId === payload.postAuthorId) {
      return; // Don't notify if commenting on own post
    }

    const notification = NotificationEntity.create(
      payload.postAuthorId,
      'NEW_COMMENT',
      `Someone just commented on your post!`,
      payload.commentId, // or postId
    );

    await this.notificationRepository.save(notification);
  }
}
