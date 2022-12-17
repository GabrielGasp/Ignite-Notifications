import { app, prisma } from '@test/jest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

const notificationData = makeNotificationInput();

describe('Get recipient notifications', () => {
  beforeAll(async () => {
    await prisma.cleanDatabase();

    await prisma.notification.createMany({
      data: [
        notificationData,
        notificationData,
        { ...notificationData, recipientId: 'another-recipient-id' },
      ],
    });
  });

  it('should get recipient notifications', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notifications/recipient/${notificationData.recipientId}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recipientId: notificationData.recipientId,
          category: notificationData.category,
          content: notificationData.content,
        }),
      ]),
    );
  });
});
