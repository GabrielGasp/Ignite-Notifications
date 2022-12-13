import { Module } from '@nestjs/common';
import { NotificationsModule } from './modules/notification.module';

@Module({
  imports: [NotificationsModule],
})
export class HttpModule {}
