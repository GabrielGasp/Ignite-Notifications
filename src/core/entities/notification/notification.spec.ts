import { Notification } from './notification.entity';
import { Content } from './content.entity';

describe('Notification', () => {
  it('it should be able to create a notification', () => {
    const notification = new Notification({
      recipientId: 'recipientId',
      category: 'category',
      content: new Content('content'),
    });

    expect(notification.recipientId).toBe('recipientId');
    expect(notification.category).toBe('category');
    expect(notification.content.value).toBe('content');
    expect(notification.readAt).toBeUndefined();
    expect(notification.createdAt).toBeInstanceOf(Date);
  });
});
