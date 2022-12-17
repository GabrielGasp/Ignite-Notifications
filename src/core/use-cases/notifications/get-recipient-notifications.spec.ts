import { makeEntityNotification } from '@test/factories/notification.factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications.repository';
import { GetRecipientNotifications } from './get-recipient-notifications.use-case';

describe('Get recipient notifications', () => {
  it('it should be able to get recipient notifications', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const getRecipientNotifications = new GetRecipientNotifications(
      notificationRepository,
    );

    const firstNotificationFromRecipient1 = makeEntityNotification({
      recipientId: 'recipientId-1',
    });

    const secondNotificationFromRecipient1 = makeEntityNotification({
      recipientId: 'recipientId-1',
    });

    const notificationFromRecipient2 = makeEntityNotification({
      recipientId: 'recipientId-2',
    });

    await Promise.all([
      notificationRepository.create(firstNotificationFromRecipient1),
      notificationRepository.create(secondNotificationFromRecipient1),
      notificationRepository.create(notificationFromRecipient2),
    ]);

    const { notifications } = await getRecipientNotifications.execute({
      recipientId: 'recipientId-1',
    });

    expect(notifications).toHaveLength(2);
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: firstNotificationFromRecipient1.id }),
        expect.objectContaining({ id: secondNotificationFromRecipient1.id }),
      ]),
    );
  });
});
