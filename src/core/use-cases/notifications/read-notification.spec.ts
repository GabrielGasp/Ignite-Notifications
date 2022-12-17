import { makeEntityNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { NotificationNotFoundError } from '../errors/notifications/notification-not-found.error';
import { ReadNotification } from './read-notification.use-case';

describe('Read notification', () => {
  it('it should be able to read a notification', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationRepository);

    const notification = makeEntityNotification();

    await notificationRepository.create(notification);

    await readNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationRepository.notifications).toHaveLength(1);
    expect(notificationRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it('it should not be able to read a notification that does not exist', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationRepository);

    await expect(
      readNotification.execute({
        notificationId: 'notificationId',
      }),
    ).rejects.toThrowError(NotificationNotFoundError);
  });
});
