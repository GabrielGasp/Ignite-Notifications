import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '@core/repositories/notifications.repository';

interface ReadNotificationRequest {
  notificationId: string;
}

type ReadNotificationResponse = void;

@Injectable()
export class ReadNotification {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    request: ReadNotificationRequest,
  ): Promise<ReadNotificationResponse> {
    const { notificationId } = request;

    await this.notificationRepository.readNotification(notificationId);
  }
}
