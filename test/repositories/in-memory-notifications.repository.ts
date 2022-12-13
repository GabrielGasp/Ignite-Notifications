import { Notification } from 'src/core/entities/notification/notification.entity';
import { NotificationsRepository } from 'src/core/repositories/notifications.repository';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = [];

  async create(notification: Notification) {
    this.notifications.push(notification);
  }
}
