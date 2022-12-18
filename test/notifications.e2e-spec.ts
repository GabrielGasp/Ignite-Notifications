import { app, prisma } from '@test/jest.setup';
import { makeNotificationInput } from '@test/factories/notification.factory';
import * as request from 'supertest';

describe('Notification E2E Tests', () => {
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

  describe('PATCH /notifications/:id/cancel', () => {
    let originalNotificationId: string;

    beforeAll(async () => {
      await prisma.cleanDatabase();

      const notification = await prisma.notification.create({
        data: makeNotificationInput(),
      });

      originalNotificationId = notification.id;
    });

    it('should cancel a notification', async () => {
      await request(app.getHttpServer())
        .patch(`/notifications/${originalNotificationId}/cancel`)
        .expect(200)
        .expect({
          message: 'Notification canceled',
        });

      const notification = await prisma.notification.findUnique({
        where: { id: originalNotificationId },
      });

      expect(notification?.canceledAt).not.toBeNull();
    });

    it('should not found a notification with invalid id', async () => {
      await request(app.getHttpServer())
        .patch('/notifications/invalid-id/cancel')
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'Notification not found',
          error: 'Not Found',
        });
    });
  });

  describe('PATCH /notifications/:id/read', () => {
    let originalNotificationId: string;

    beforeAll(async () => {
      await prisma.cleanDatabase();

      const notification = await prisma.notification.create({
        data: makeNotificationInput(),
      });

      originalNotificationId = notification.id;
    });

    it('should read a notification', async () => {
      await request(app.getHttpServer())
        .patch(`/notifications/${originalNotificationId}/read`)
        .expect(200)
        .expect({
          message: 'Notification read',
        });

      const notification = await prisma.notification.findUnique({
        where: { id: originalNotificationId },
      });

      expect(notification?.readAt).not.toBeNull();
    });

    it('should not found a notification with invalid id', async () => {
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

  describe('PATCH /notifications/:id/unread', () => {
    let originalNotificationId: string;

    beforeAll(async () => {
      await prisma.cleanDatabase();

      const notification = await prisma.notification.create({
        data: {
          ...makeNotificationInput(),
          readAt: new Date(),
        },
      });

      originalNotificationId = notification.id;
    });

    it('should unread a notification', async () => {
      await request(app.getHttpServer())
        .patch(`/notifications/${originalNotificationId}/unread`)
        .expect(200)
        .expect({
          message: 'Notification unread',
        });

      const notification = await prisma.notification.findUnique({
        where: { id: originalNotificationId },
      });

      expect(notification?.readAt).toBeNull();
    });

    it('should not found a notification with invalid id', async () => {
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

  describe('GET /notifications/recipient/:id', () => {
    const notificationData = makeNotificationInput();

    beforeAll(async () => {
      await prisma.cleanDatabase();

      await prisma.notification.createMany({
        data: [
          notificationData,
          notificationData,
          { ...notificationData, recipientId: 'another-recipient-id' },
        ],
      });
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

  describe('GET /notifications/recipient/:id/count', () => {
    const notificationData = makeNotificationInput();

    beforeAll(async () => {
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
});
