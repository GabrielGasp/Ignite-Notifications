import { Body, Controller, Post } from '@nestjs/common';
import { SendNotification } from '@core/use-cases/notifications/send-notification.use-case';
import { CreateNotificationDto } from '../dto/notifications/create-notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

@Controller('notifications')
export class NotificationsController {
  constructor(private sendNotification: SendNotification) {}

  @Post()
  async create(@Body() body: CreateNotificationDto) {
    const { recipientId, category, content } = body;

    const { notification } = await this.sendNotification.execute({
      recipientId,
      category,
      content,
    });

    return NotificationMapper.toHTTP(notification);
  }
}
