import { app, prisma } from '@test/jest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import request from 'supertest';

describe('POST /notifications', () => {
  const validNotification = makeNotificationInput();

  beforeAll(async () => {
    await prisma.cleanDatabase();
  });

  it('should send a notification', async () => {
    const response = await request(app.getHttpServer())
      .post('/notifications')
      .send(validNotification)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      recipientId: validNotification.recipientId,
      category: validNotification.category,
      content: validNotification.content,
      readAt: null,
      canceledAt: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    const notification = await prisma.notification.findUnique({
      where: { id: response.body.id },
    });

    expect(notification).toEqual({
      id: response.body.id,
      recipientId: response.body.recipientId,
      category: response.body.category,
      content: response.body.content,
      readAt: null,
      canceledAt: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should not send a notification with invalid recipientId', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({ ...validNotification, recipientId: '' })
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
      .send({ ...validNotification, category: '' })
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
      .send({ ...validNotification, content: '' })
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
      .send({ ...validNotification, content: longContent })
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
      .send({ ...validNotification, unknownProperty: 'unknown' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['property unknownProperty should not exist'],
        error: 'Bad Request',
      });
  });
});
