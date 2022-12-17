import { PrismaService } from '@infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { initApp } from '@test/app-setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

let originalNotificationId: string;

describe('Unread notification', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    app = await initApp();
    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    const notification = await prisma.notification.create({
      data: {
        ...makeNotificationInput(),
        readAt: new Date(),
      },
    });

    originalNotificationId = notification.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should unread a notification', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}/unread`)
      .expect(200)
      .expect({
        message: 'Notification unread',
      });

    const notification = await prisma.notification.findUnique({
      where: { id: originalNotificationId },
    });

    expect(notification?.readAt).toBeNull();
  });

  it('should not found a notification with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/notifications/invalid-id/unread')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Notification not found',
        error: 'Not Found',
      });
  });
});
