import { PrismaService } from '@infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { initApp } from '@test/app-setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

const notificationData = makeNotificationInput();

describe('Get recipient notifications', () => {
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
