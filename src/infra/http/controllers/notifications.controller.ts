import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SendNotification } from '@core/use-cases/notifications/send-notification.use-case';
import { CreateNotificationDto } from '../dto/notifications/create-notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';
import { EditNotification } from '@core/use-cases/notifications/edit-notification.use-case';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private sendNotification: SendNotification,
    private editNotification: EditNotification,
  ) {}

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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateNotificationDto) {
    const { category, content } = body;

    try {
      const { notification } = await this.editNotification.execute({
        notificationId: id,
        category,
        content,
      });

      return NotificationMapper.toHTTP(notification);
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }
  }
}
