import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { mockPrismaService } from '@test/mock/prisma.service';
import request from 'supertest';

describe('GET /notifications/recipient/:id/count', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should count recipient notifications', async () => {
    const recipientId = 'recipient-id';

    prisma.notification.count.mockResolvedValueOnce(2);

    await request(app.getHttpServer())
      .get(`/notifications/recipient/${recipientId}/count`)
      .expect(200)
      .expect({ count: 2 });

    expect(prisma.notification.count).toHaveBeenCalledTimes(1);
    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: { recipientId },
    });
  });
});
