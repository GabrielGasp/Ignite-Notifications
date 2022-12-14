import { Module } from '@nestjs/common';
import { SendNotification } from '@core/use-cases/notifications/send-notification.use-case';
import { DatabaseModule } from '@infra/database/database.module';
import { NotificationsController } from '../controllers/notifications.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [SendNotification],
})
export class NotificationsModule {}
