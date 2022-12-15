import { Module } from '@nestjs/common';
import { SendNotification } from '@core/use-cases/notifications/send-notification.use-case';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationsController } from '../controllers/notifications.controller';
import { EditNotification } from '@core/use-cases/notifications/edit-notification.use-case';
import { CancelNotification } from '@core/use-cases/notifications/cancel-notification.use-case';
import { ReadNotification } from '@core/use-cases/notifications/read-notification.use-case';
import { UnreadNotification } from '@core/use-cases/notifications/unread-notification.use-case';
import { CountRecipientNotifications } from '@core/use-cases/notifications/count-recipient-notifications.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    SendNotification,
    EditNotification,
    CancelNotification,
    ReadNotification,
    UnreadNotification,
    CountRecipientNotifications,
  ],
})
export class NotificationsModule {}
