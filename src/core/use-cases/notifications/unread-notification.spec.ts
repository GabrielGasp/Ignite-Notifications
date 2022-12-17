import { makeEntityNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { NotificationNotFoundError } from '../errors/notifications/notification-not-found.error';
import { UnreadNotification } from './unread-notification.use-case';

describe('Unread notification', () => {
  it('it should be able to unread a notification', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationRepository);

    const notification = makeEntityNotification({
      readAt: new Date(),
    });

    await notificationRepository.create(notification);

    await unreadNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationRepository.notifications).toHaveLength(1);
    expect(notificationRepository.notifications[0].readAt).toBeNull();
  });

  it('it should not be able to unread a notification that does not exist', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationRepository);

    await expect(
      unreadNotification.execute({
        notificationId: 'notificationId',
      }),
    ).rejects.toThrowError(NotificationNotFoundError);
  });
});
