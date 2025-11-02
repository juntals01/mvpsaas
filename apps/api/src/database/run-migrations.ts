// apps/api/src/database/run-migrations.ts
import dataSource from './data-source';

(async () => {
  try {
    if (!dataSource.isInitialized) await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('Migrations ran.');
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
})();
