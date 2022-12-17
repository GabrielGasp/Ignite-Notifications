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
