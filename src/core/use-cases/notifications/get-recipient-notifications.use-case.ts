import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@core/repositories/notifications.repository';
import { Notification } from '@core/entities/notification/notification.entity';

interface GetRecipientNotificationsRequest {
  recipientId: string;
}

interface GetRecipientNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class GetRecipientNotifications {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    request: GetRecipientNotificationsRequest,
  ): Promise<GetRecipientNotificationsResponse> {
    const { recipientId } = request;

    const notifications = await this.notificationRepository.getByRecipientId(
      recipientId,
    );

    return { notifications };
  }
}
