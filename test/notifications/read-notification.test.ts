import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { makeDatabaseNotification } from '@test/factories/notification.factory';
import { mockPrismaService } from '@test/mock/prisma.service';
import request from 'supertest';

describe('PATCH /notifications/:id/read', () => {
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

  it('should read a notification', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));

    prisma.notification.update.mockResolvedValueOnce('whatever');

    await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}/read`)
      .expect(200)
      .expect({
        message: 'Notification read',
      });

    expect(prisma.notification.update).toHaveBeenCalledTimes(1);
    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: notification.id },
      data: { readAt: new Date('2023-01-01T00:00:00.000Z') },
    });

    jest.useRealTimers();
  });

  it('should not found a notification with invalid id', async () => {
    prisma.notification.update.mockRejectedValueOnce('whatever');

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
