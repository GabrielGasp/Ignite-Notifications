import { makeEntityNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { NotificationNotFoundError } from '../errors/notifications/notification-not-found.error';
import { CancelNotification } from './cancel-notification.use-case';

describe('Cancel notification', () => {
  it('it should be able to cancel a notification', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const cancelNotification = new CancelNotification(notificationRepository);

    const notification = makeEntityNotification();

    await notificationRepository.create(notification);

    await cancelNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationRepository.notifications).toHaveLength(1);
    expect(notificationRepository.notifications[0].canceledAt).toEqual(
      expect.any(Date),
    );
  });

  it('it should not be able to cancel a notification that does not exist', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const cancelNotification = new CancelNotification(notificationRepository);

    await expect(
      cancelNotification.execute({
        notificationId: 'notificationId',
      }),
    ).rejects.toThrowError(NotificationNotFoundError);
  });
});
