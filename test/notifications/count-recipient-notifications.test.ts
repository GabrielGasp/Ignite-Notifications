import { PrismaService } from '@infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { makeNotificationInput } from '@test/factories/notification.factory';
import request from 'supertest';

describe('GET /notifications/recipient/:id/count', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const notificationData = makeNotificationInput();

  beforeAll(async () => {
    ({ app, prisma } = await setup());

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
