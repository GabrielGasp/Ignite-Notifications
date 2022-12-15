import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@core/repositories/notifications.repository';
import { NotificationNotFoundError } from '../errors/notifications/notification-not-found.error';
import { Notification } from '@core/entities/notification/notification.entity';
import { Content } from '@core/entities/notification/content.entity';

interface EditNotificationRequest {
  notificationId: string;
  category?: string;
  content?: string;
}

interface EditNotifcationResponse {
  notification: Notification;
}

@Injectable()
export class EditNotification {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    request: EditNotificationRequest,
  ): Promise<EditNotifcationResponse> {
    const { notificationId, category, content } = request;

    const notification = await this.notificationRepository.findById(
      notificationId,
    );

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    notification.category = category ?? notification.category;
    notification.content = content
      ? new Content(content)
      : notification.content;

    const updatedNotification = await this.notificationRepository.update(
      notification,
    );

    return {
      notification: updatedNotification,
    };
  }
}
