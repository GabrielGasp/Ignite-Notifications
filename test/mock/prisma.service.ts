const mockedTableMethods = {
  aggregate: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  findFirst: jest.fn(),
  findFirstOrThrow: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findUniqueOrThrow: jest.fn(),
  groupBy: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
};

const mockedTables = {
  notification: mockedTableMethods,
};

export const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $executeRaw: jest.fn(),
  $executeRawUnsafe: jest.fn(),
  $queryRaw: jest.fn(),
  $queryRawUnsafe: jest.fn(),
  $on: jest.fn(),
  $use: jest.fn(),
  $transaction: jest.fn(),
  ...mockedTables,
};
