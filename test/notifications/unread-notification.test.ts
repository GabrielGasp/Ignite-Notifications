import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { makeDatabaseNotification } from '@test/factories/notification.factory';
import { mockPrismaService } from '@test/mock/prisma.service';
import request from 'supertest';

describe('PATCH /notifications/:id/unread', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  const notification = makeDatabaseNotification();

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should unread a notification', async () => {
    prisma.notification.update.mockResolvedValueOnce('whatever');

    await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}/unread`)
      .expect(200)
      .expect({
        message: 'Notification unread',
      });

    expect(prisma.notification.update).toHaveBeenCalledTimes(1);
    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: notification.id },
      data: { readAt: null },
    });
  });

  it('should not found a notification with invalid id', async () => {
    prisma.notification.update.mockRejectedValueOnce('whatever');

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
