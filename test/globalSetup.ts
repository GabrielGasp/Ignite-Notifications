import os from 'os';
import exec from 'shell-exec';

export const setup = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }

  const url = new URL(process.env.DATABASE_URL);

  const maxThreads = os.cpus().length / 2;

  const testDbUrls: string[] = [];

  for (let i = 1; i <= maxThreads; i++) {
    url.pathname = `test_${i}`;
    testDbUrls.push(url.toString());
  }

  await Promise.all(
    testDbUrls.map((testDbUrl) =>
      exec('prisma migrate reset --force', {
        env: {
          ...process.env,
          DATABASE_URL: testDbUrl,
        },
      }),
    ),
  );
};
