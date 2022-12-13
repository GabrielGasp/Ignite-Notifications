import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
