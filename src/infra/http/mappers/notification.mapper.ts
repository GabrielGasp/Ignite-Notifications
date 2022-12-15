import { Notification } from '@core/entities/notification/notification.entity';

export class NotificationMapper {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      category: notification.category,
      content: notification.content.value,
      readAt: notification.readAt,
      canceledAt: notification.canceledAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}
