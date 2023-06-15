import { app, prisma } from '@test/vitest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import request from 'supertest';

describe('PATCH /notifications/:id/cancel', () => {
  let originalNotificationId: string;

  beforeAll(async () => {
    await prisma.cleanDatabase();

    const notification = await prisma.notification.create({
      data: makeNotificationInput(),
    });

    originalNotificationId = notification.id;
  });

  it('should cancel a notification', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}/cancel`)
      .expect(200)
      .expect({
        message: 'Notification canceled',
      });

    const notification = await prisma.notification.findUnique({
      where: { id: originalNotificationId },
    });

    expect(notification?.canceledAt).not.toBeNull();
  });

  it('should not found a notification with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/notifications/invalid-id/cancel')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Notification not found',
        error: 'Not Found',
      });
  });
});
