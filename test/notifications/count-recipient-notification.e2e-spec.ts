import { PrismaService } from '@infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { initApp } from '@test/app-setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

const notificationData = makeNotificationInput();

describe('Count recipient notifications', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    app = await initApp();
    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    await prisma.notification.createMany({
      data: [
        notificationData,
        notificationData,
        { ...notificationData, recipientId: 'another-recipient-id' },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should count recipient notifications', async () => {
    await request(app.getHttpServer())
      .get(`/notifications/recipient/${notificationData.recipientId}/count`)
      .expect(200)
      .expect({ count: 2 });
  });
});
