import { makeNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { CountRecipientNotifications } from './count-recipient-notifications.use-case';

describe('Count recipient notifications', () => {
  it('it should be able to count recipient notifications', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const countRecipientNotifications = new CountRecipientNotifications(
      notificationRepository,
    );

    const notificationFromRecipient1 = makeNotification({
      recipientId: 'recipientId-1',
    });

    const notificationFromRecipient2 = makeNotification({
      recipientId: 'recipientId-2',
    });

    await Promise.all([
      notificationRepository.create(notificationFromRecipient1),
      notificationRepository.create(notificationFromRecipient2),
    ]);

    const { count } = await countRecipientNotifications.execute({
      recipientId: 'recipientId-1',
    });

    expect(count).toEqual(1);
  });
});
