import exec from 'shell-exec';

/**
 * This function is called once before all test suites.
 * It will create/reset a postgres database for each worker.
 * Databases names are composed of the test_ prefix and the worker id (1, 2, 3...).
 */
export default async ({ maxWorkers }: { maxWorkers: number }) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }

  const url = new URL(process.env.DATABASE_URL);

  const execPromises: Promise<any>[] = [];

  for (let i = 1; i <= maxWorkers; i++) {
    // i represents the worker id that can be retrieved in the test with process.env.JEST_WORKER_ID
    url.pathname = `test_${i}`;

    const execPromise = exec('prisma migrate reset --force', {
      env: { ...process.env, DATABASE_URL: url.toString() },
    });

    execPromises.push(execPromise);
  }

  await Promise.all(execPromises);
};
