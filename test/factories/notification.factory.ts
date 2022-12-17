import { Content } from '@core/entities/notification/content.entity';
import {
  Notification,
  NotificationProps,
} from '@core/entities/notification/notification.entity';

type Override = Partial<NotificationProps>;

export function makeEntityNotification(override: Override = {}): Notification {
  return new Notification({
    recipientId: 'recipientId',
    category: 'category',
    content: new Content('content'),
    ...override,
  });
}

export function makeNotificationInput() {
  return {
    recipientId: 'e68973c0-c3c8-40d4-91d6-cde61998042e',
    category: 'Test Category',
    content: 'Test Content',
  };
}
