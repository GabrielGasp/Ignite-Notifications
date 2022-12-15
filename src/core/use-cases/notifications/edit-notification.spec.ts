import { makeNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { EditNotification } from './edit-notification.use-case';

describe('Update notification', () => {
  it('it should be able to edit a notification', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const updateNotification = new EditNotification(notificationRepository);

    const originalNotification = makeNotification();

    await notificationRepository.create(originalNotification);

    const { notification } = await updateNotification.execute({
      notificationId: originalNotification.id,
      category: 'new category',
      content: 'new content',
    });

    expect(notification.category).toBe('new category');
    expect(notification.content.value).toBe('new content');
  });

  it('it should not be able to edit a notification that does not exist', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const updateNotification = new EditNotification(notificationRepository);

    await expect(
      updateNotification.execute({
        notificationId: 'non-existing-notification-id',
        category: 'new category',
        content: 'new content',
      }),
    ).rejects.toThrowError();
  });
});
