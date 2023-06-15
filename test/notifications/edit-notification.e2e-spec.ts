import { app, prisma } from '@test/vitest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import request from 'supertest';

describe('PATCH /notifications/:id', () => {
  let originalNotificationId: string;

  beforeAll(async () => {
    await prisma.cleanDatabase();

    const notification = await prisma.notification.create({
      data: makeNotificationInput(),
    });

    originalNotificationId = notification.id;
  });

  it('should edit a notification', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}`)
      .send({ content: 'New Content', category: 'New Category' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: originalNotificationId,
      category: 'New Category',
      content: 'New Content',
    });

    const notification = await prisma.notification.findUnique({
      where: { id: originalNotificationId },
    });

    expect(notification).toMatchObject({
      id: originalNotificationId,
      category: 'New Category',
      content: 'New Content',
    });
  });

  it('should not edit a notification with invalid content', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}`)
      .send({ content: '' })
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
      .patch(`/notifications/${originalNotificationId}`)
      .send({ content: longContent })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['content must be shorter than or equal to 200 characters'],
        error: 'Bad Request',
      });
  });

  it('should forbid non whitelisted properties', async () => {
    await request(app.getHttpServer())
      .patch(`/notifications/${originalNotificationId}`)
      .send({ unknownProperty: 'unknown' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: ['property unknownProperty should not exist'],
        error: 'Bad Request',
      });
  });

  it('should not found a notification with invalid id', async () => {
    await request(app.getHttpServer())
      .patch('/notifications/invalid-id')
      .send({ content: 'New Content' })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Notification not found',
        error: 'Not Found',
      });
  });
});
