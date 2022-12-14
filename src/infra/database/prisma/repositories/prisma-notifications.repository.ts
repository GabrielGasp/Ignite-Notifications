import { Injectable } from '@nestjs/common';
import { Notification } from '@core/entities/notification/notification.entity';
import { NotificationsRepository } from '@core/repositories/notifications.repository';
import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification.mapper';

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const mappedData = PrismaNotificationMapper.toPersistence(notification);
    await this.prismaService.notification.create({
      data: mappedData,
    });
  }
}
