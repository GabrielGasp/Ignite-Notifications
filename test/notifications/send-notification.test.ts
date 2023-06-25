import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { makeDatabaseNotification } from '@test/factories/notification.factory';
import { mockPrismaService } from '@test/mock/prisma.service';
import crypto from 'node:crypto';
import request from 'supertest';

describe('POST /notifications', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  const validCreateBody = {
    recipientId: 'e68973c0-c3c8-40d4-91d6-cde61998042e',
    category: 'Test Category',
    content: 'Test Content',
  };

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send a notification', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));

    const uuid = 'e68973c0-c3c8-40d4-91d6-cde61998042e';
    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce(uuid);

    const createResolvedValue = makeDatabaseNotification({
      ...validCreateBody,
      id: uuid,
    });
    prisma.notification.create.mockResolvedValueOnce(createResolvedValue);

    const response = await request(app.getHttpServer())
      .post('/notifications')
      .send(validCreateBody)
      .expect(201);

    expect(response.body).toEqual({
      id: uuid,
      recipientId: validCreateBody.recipientId,
      category: validCreateBody.category,
      content: validCreateBody.content,
      readAt: null,
      canceledAt: null,
      createdAt: createResolvedValue.createdAt.toISOString(),
      updatedAt: createResolvedValue.updatedAt.toISOString(),
    });

    expect(prisma.notification.create).toHaveBeenCalledTimes(1);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        id: uuid,
        recipientId: validCreateBody.recipientId,
        category: validCreateBody.category,
        content: validCreateBody.content,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      },
    });

    jest.useRealTimers();
  });

  it('should not send a notification with invalid recipientId', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({ ...validCreateBody, recipientId: '' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'recipientId must be a UUID',
          'recipientId should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  it('should not send a notification with invalid category', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({ ...validCreateBody, category: '' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['category should not be empty'],
        error: 'Bad Request',
      });
  });

  it('should not send a notification with invalid content', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({ ...validCreateBody, content: '' })
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
      .post('/notifications')
      .send({ ...validCreateBody, content: longContent })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['content must be shorter than or equal to 200 characters'],
        error: 'Bad Request',
      });
  });

  it('should forbid non whitelisted properties', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({ ...validCreateBody, unknownProperty: 'unknown' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['property unknownProperty should not exist'],
        error: 'Bad Request',
      });
  });
});
