import { app, prisma } from '@test/vitest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import request from 'supertest';

describe('GET /notifications/recipient/:id/count', () => {
  const notificationData = makeNotificationInput();

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
