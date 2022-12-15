import { Injectable } from '@nestjs/common';
import { Notification } from '@core/entities/notification/notification.entity';
import { NotificationsRepository } from '@core/repositories/notifications.repository';
import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification.mapper';
import { NotificationNotFoundError } from '@core/use-cases/errors/notifications/notification-not-found.error';

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) return null;

    return PrismaNotificationMapper.toDomain(notification);
  }

  async countByRecipientId(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientId },
    });
  }

  async getByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async create(notification: Notification): Promise<Notification> {
    const mappedData = PrismaNotificationMapper.toPersistence(notification);
    const createdNotification = await this.prisma.notification.create({
      data: mappedData,
    });

    return PrismaNotificationMapper.toDomain(createdNotification);
  }

  async update(notification: Notification): Promise<Notification> {
    const mappedData = PrismaNotificationMapper.toPersistence(notification);
    const updatedNotification = await this.prisma.notification
      .update({
        where: { id: notification.id },
        data: mappedData,
      })
      .catch(() => {
        throw new NotificationNotFoundError();
      });

    return PrismaNotificationMapper.toDomain(updatedNotification);
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await this.prisma.notification
      .update({
        where: { id: notificationId },
        data: { canceledAt: new Date() },
      })
      .catch(() => {
        throw new NotificationNotFoundError();
      });
  }

  async readNotification(notificationId: string): Promise<void> {
    await this.prisma.notification
      .update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      })
      .catch(() => {
        throw new NotificationNotFoundError();
      });
  }

  async unreadNotification(notificationId: string): Promise<void> {
    await this.prisma.notification
      .update({
        where: { id: notificationId },
        data: { readAt: null },
      })
      .catch(() => {
        throw new NotificationNotFoundError();
      });
  }
}
