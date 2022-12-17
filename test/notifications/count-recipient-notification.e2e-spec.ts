import { app, prisma } from '@test/jest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

const notificationData = makeNotificationInput();

describe('Count recipient notifications', () => {
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

  it('should count recipient notifications', async () => {
    await request(app.getHttpServer())
      .get(`/notifications/recipient/${notificationData.recipientId}/count`)
      .expect(200)
      .expect({ count: 2 });
  });
});
