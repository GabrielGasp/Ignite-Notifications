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
}
