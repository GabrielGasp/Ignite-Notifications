import { InMemoryNotificationsRepository } from '../../../../test/repositories/in-memory-notifications.repository';
import { SendNotification } from './send-notification.use-case';

describe('Send notification', () => {
  it('it should be able to send a notification', async () => {
    const notificationRepository = new InMemoryNotificationsRepository();
    const sendNotification = new SendNotification(notificationRepository);
    const { notification } = await sendNotification.execute({
      recipientId: 'recipientId',
      category: 'category',
      content: 'content',
    });

    expect(notificationRepository.notifications).toHaveLength(1);
    expect(notificationRepository.notifications[0]).toEqual(notification);
  });
});
