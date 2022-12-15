import { Notification as PrismaNotification } from '@prisma/client';
import { Notification } from '@core/entities/notification/notification.entity';
import { Content } from '@core/entities/notification/content.entity';

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

  static toDomain(prismaNotification: PrismaNotification) {
    return new Notification(
      {
        recipientId: prismaNotification.recipientId,
        category: prismaNotification.category,
        content: new Content(prismaNotification.content),
        readAt: prismaNotification.readAt,
        canceledAt: prismaNotification.canceledAt,
        createdAt: prismaNotification.createdAt,
        updatedAt: prismaNotification.updatedAt,
      },
      prismaNotification.id,
    );
  }
}
