import { Notification } from '@core/entities/notification/notification.entity';

export abstract class NotificationsRepository {
  abstract findById(notificationId: string): Promise<Notification | null>;
  abstract countByRecipientId(recipientId: string): Promise<number>;
  abstract getByRecipientId(recipientId: string): Promise<Notification[]>;
  abstract create(notification: Notification): Promise<Notification>;
  abstract update(notification: Notification): Promise<Notification>;
  abstract cancelNotification(notificationId: string): Promise<void>;
  abstract readNotification(notificationId: string): Promise<void>;
  abstract unreadNotification(notificationId: string): Promise<void>;
}
