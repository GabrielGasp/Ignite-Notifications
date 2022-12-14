import { Notification } from '@core/entities/notification/notification.entity';

export abstract class NotificationsRepository {
  abstract create(notification: Notification): Promise<void>;
}
