import { PrismaService } from '@infra/database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export async function setup() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const prisma = moduleRef.get(PrismaService);

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  return { app, prisma };
}
