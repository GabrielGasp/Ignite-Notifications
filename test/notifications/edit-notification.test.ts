import { makeDatabaseNotification } from '@test/factories/notification.factory';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { mockPrismaService } from '@test/mock/prisma.service';

describe('PATCH /notifications/:id', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  const notification = makeDatabaseNotification();
  const validUpdateBody = { content: 'New Content', category: 'New Category' };

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should edit a notification', async () => {
    prisma.notification.findUnique.mockResolvedValueOnce(notification);

    prisma.notification.update.mockResolvedValueOnce({
      ...notification,
      ...validUpdateBody,
    });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}`)
      .send({ content: 'New Content', category: 'New Category' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: notification.id,
      category: 'New Category',
      content: 'New Content',
    });

    expect(prisma.notification.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.notification.findUnique).toHaveBeenCalledWith({
      where: { id: notification.id },
    });

    expect(prisma.notification.update).toHaveBeenCalledTimes(1);
    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: notification.id },
      data: {
        id: notification.id,
        recipientId: notification.recipientId,
        category: validUpdateBody.category,
        content: validUpdateBody.content,
        createdAt: notification.createdAt,
      },
    });
  });

  it('should not edit a notification with invalid content', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}`)
      .send({ ...validUpdateBody, content: '' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'content must be longer than or equal to 5 characters',
          'content should not be empty',
        ],
        error: 'Bad Request',
      });

    const longContent = 'a'.repeat(201);
    await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}`)
      .send({ ...validUpdateBody, content: longContent })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['content must be shorter than or equal to 200 characters'],
        error: 'Bad Request',
      });
  });

  it('should forbid non whitelisted properties', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}`)
      .send({ unknownProperty: 'unknown' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['property unknownProperty should not exist'],
        error: 'Bad Request',
      });
  });

  it('should not found a notification with invalid id', async () => {
    prisma.notification.findUnique.mockResolvedValueOnce(null);

    await request(app.getHttpServer())
      .patch('/notifications/invalid-id')
      .send({ content: 'New Content' })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Notification not found',
        error: 'Not Found',
      });

    expect(prisma.notification.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.notification.findUnique).toHaveBeenCalledWith({
      where: { id: 'invalid-id' },
    });
  });
});
