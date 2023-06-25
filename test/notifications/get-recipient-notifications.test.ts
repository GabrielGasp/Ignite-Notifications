import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { makeDatabaseNotification } from '@test/factories/notification.factory';
import { mockPrismaService } from '@test/mock/prisma.service';
import request from 'supertest';

describe('GET /notifications/recipient/:id', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  const [notification1, notification2, _notificaton3] = [
    makeDatabaseNotification(),
    makeDatabaseNotification(),
    makeDatabaseNotification({ recipientId: 'another-recipient-id' }),
  ];

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get recipient notifications', async () => {
    prisma.notification.findMany.mockResolvedValueOnce([
      notification1,
      notification2,
    ]);

    const response = await request(app.getHttpServer())
      .get(`/notifications/recipient/${notification1.recipientId}`)
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: notification1.id,
          recipientId: notification1.recipientId,
          category: notification1.category,
          content: notification1.content,
          readAt: notification1.readAt,
          canceledAt: notification1.canceledAt,
          createdAt: notification1.createdAt.toISOString(),
          updatedAt: notification1.updatedAt.toISOString(),
        }),
      ]),
    );

    expect(prisma.notification.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { recipientId: notification1.recipientId },
    });
  });
});
