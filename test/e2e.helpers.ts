import { PrismaService } from '@infra/database/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }

  // Replace the DATABASE_URL env variable with a test database for each worker
  const url = new URL(process.env.DATABASE_URL);
  url.pathname = `test_${process.env.JEST_WORKER_ID}`;
  process.env.DATABASE_URL = url.toString();

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
