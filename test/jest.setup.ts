import { PrismaService } from '@infra/database/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let app: INestApplication;
export let prisma: PrismaService;

export async function initApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  prisma = moduleRef.get(PrismaService);

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.init();
}

beforeAll(async () => {
  await initApp();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});
