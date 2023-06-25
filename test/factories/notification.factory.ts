import { Content } from '@core/entities/notification/content.entity';
import {
  Notification,
  NotificationProps,
} from '@core/entities/notification/notification.entity';

type EntityDataOverride = Partial<NotificationProps>;

export function makeEntityNotification(
  override: EntityDataOverride = {},
): Notification {
  return new Notification({
    recipientId: 'recipientId',
    category: 'category',
    content: new Content('content'),
    ...override,
  });
}

interface DatabaseNotification {
  id: string;
  recipientId: string;
  content: string;
  category: string;
  canceledAt: Date | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type DatabaseDataOverride = Partial<DatabaseNotification>;

export function makeDatabaseNotification(
  override?: DatabaseDataOverride,
): DatabaseNotification {
  return {
    id: 'any_id',
    recipientId: 'any_recipient_id',
    content: 'any_content',
    category: 'any_category',
    canceledAt: null,
    readAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  };
}
