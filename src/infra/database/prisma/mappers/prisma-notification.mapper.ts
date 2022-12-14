import { Notification } from '@core/entities/notification/notification.entity';

export class PrismaNotificationMapper {
  static toPersistence(notification: Notification) {
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      category: notification.category,
      content: notification.content.value,
      createdAt: notification.createdAt,
    };
  }
}
