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
import { CancelNotification } from '@core/use-cases/notifications/cancel-notification.use-case';
import { ReadNotification } from '@core/use-cases/notifications/read-notification.use-case';
import { UnreadNotification } from '@core/use-cases/notifications/unread-notification.use-case';
import { NotificationNotFoundError } from '@core/use-cases/errors/notifications/notification-not-found.error';
import { UpdateNotificationDto } from '../dto/notifications/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private sendNotification: SendNotification,
    private editNotification: EditNotification,
    private cancelNotification: CancelNotification,
    private readNotification: ReadNotification,
    private unreadNotification: UnreadNotification,
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

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    try {
      await this.cancelNotification.execute({ notificationId: id });

      return { message: 'Notification canceled' };
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Patch(':id/read')
  async read(@Param('id') id: string) {
    try {
      await this.readNotification.execute({ notificationId: id });

      return { message: 'Notification read' };
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Patch(':id/unread')
  async unread(@Param('id') id: string) {
    try {
      await this.unreadNotification.execute({ notificationId: id });

      return { message: 'Notification unread' };
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw new NotFoundException(error.message);
      }
    }
  }
}
