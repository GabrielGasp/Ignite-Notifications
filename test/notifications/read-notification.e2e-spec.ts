import { app, prisma } from '@test/jest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

let originalNotificationId: string;

describe('Read notification', () => {
  beforeAll(async () => {
    await prisma.cleanDatabase();

    const notification = await prisma.notification.create({
      data: makeNotificationInput(),
    });

    originalNotificationId = notification.id;
  });

  it('should read a notification', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}/read`)
      .expect(200)
      .expect({
        message: 'Notification read',
      });

    const notification = await prisma.notification.findUnique({
      where: { id: originalNotificationId },
    });

    expect(notification?.readAt).not.toBeNull();
  });

  it('should not found a notification with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/notifications/invalid-id/read')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Notification not found',
        error: 'Not Found',
      });
  });
});
