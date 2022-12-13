import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  create(@Body() body: CreateNotificationDto) {
    const { recipientId, category, content } = body;
    return this.prisma.notification.create({
      data: {
        content,
        category,
        recipientId,
      },
    });
  }
}
