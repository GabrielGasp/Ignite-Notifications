import { Injectable } from '@nestjs/common';
import { Notification } from '@core/entities/notification/notification.entity';
import { NotificationsRepository } from '@core/repositories/notifications.repository';
import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification.mapper';

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

  async create(notification: Notification): Promise<void> {
    const mappedData = PrismaNotificationMapper.toPersistence(notification);
    await this.prisma.notification.create({
      data: mappedData,
    });
  }

  async update(notification: Notification): Promise<void> {
    const mappedData = PrismaNotificationMapper.toPersistence(notification);

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: mappedData,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { canceledAt: new Date() },
    });
  }

  async readNotification(notificationId: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async unreadNotification(notificationId: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: null },
    });
  }
}
