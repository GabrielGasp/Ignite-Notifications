import { Module } from '@nestjs/common';
import { SendNotification } from '@core/use-cases/notifications/send-notification.use-case';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationsController } from '../controllers/notifications.controller';
import { EditNotification } from '@core/use-cases/notifications/edit-notification.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [
    SendNotification,
    EditNotification,
  ],
})
export class NotificationsModule {}
