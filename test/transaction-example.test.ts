import { INestApplication } from '@nestjs/common';
import { setup } from '@test/e2e.helpers';
import { mockPrismaService } from '@test/mock/prisma.service';

describe('Transaction Example', () => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await setup());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  async function run() {
    return prisma.$transaction(async (prisma: typeof mockPrismaService) => {
      await prisma.notification.create('create data');
      return await prisma.notification.findFirst('found data');
    });
  }

  it('success', async () => {
    prisma.$transaction.mockImplementationOnce((cb) => cb(prisma));
    prisma.notification.create.mockResolvedValueOnce('created');
    prisma.notification.findFirst.mockResolvedValueOnce('found');

    await expect(run()).resolves.toBe('found');

    expect(prisma.notification.create).toHaveBeenCalledTimes(1);
    expect(prisma.notification.create).toHaveBeenCalledWith('create data');

    expect(prisma.notification.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith('found data');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    await expect(prisma.$transaction.mock.results[0].value).resolves.toBe(
      'found',
    );
  });

  it('failure', async () => {
    prisma.$transaction.mockImplementationOnce((cb) => cb(prisma));
    prisma.notification.create.mockResolvedValueOnce('created');
    prisma.notification.findFirst.mockRejectedValueOnce(new Error('not found'));

    await expect(run()).rejects.toThrow('not found');

    expect(prisma.notification.create).toHaveBeenCalledTimes(1);
    expect(prisma.notification.create).toHaveBeenCalledWith('create data');

    expect(prisma.notification.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith('found data');

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    await expect(prisma.$transaction.mock.results[0].value).rejects.toThrow(
      'not found',
    );
  });
});
