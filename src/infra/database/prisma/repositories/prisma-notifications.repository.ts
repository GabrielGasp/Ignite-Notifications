import { Injectable } from '@nestjs/common';
import { Notification } from 'src/core/entities/notification/notification.entity';
import { NotificationsRepository } from 'src/core/repositories/notifications.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    await this.prismaService.notification.create({
      data: {
        id: notification.id,
        recipientId: notification.recipientId,
        category: notification.category,
        content: notification.content.value,
        createdAt: notification.createdAt,
      },
    });
  }
}
