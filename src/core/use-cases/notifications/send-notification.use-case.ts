import { Injectable } from '@nestjs/common';
import { Content } from '@core/entities/notification/content.entity';
import { Notification } from '@core/entities/notification/notification.entity';
import { NotificationsRepository } from '@core/repositories/notifications.repository';

interface SendNotificationRequest {
  recipientId: string;
  category: string;
  content: string;
}

interface SendNotifcationResponse {
  notification: Notification;
}

@Injectable()
export class SendNotification {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    request: SendNotificationRequest,
  ): Promise<SendNotifcationResponse> {
    const { recipientId, category, content } = request;

    const notification = new Notification({
      recipientId,
      category,
      content: new Content(content),
    });

    const newNotification = await this.notificationRepository.create(
      notification,
    );

    return {
      notification: newNotification,
    };
  }
}
