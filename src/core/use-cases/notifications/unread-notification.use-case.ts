import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@core/repositories/notifications.repository';

interface UnreadNotificationRequest {
  notificationId: string;
}

type UnreadNotificationResponse = void;

@Injectable()
export class UnreadNotification {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    request: UnreadNotificationRequest,
  ): Promise<UnreadNotificationResponse> {
    const { notificationId } = request;

    await this.notificationRepository.unreadNotification(notificationId);
  }
}
