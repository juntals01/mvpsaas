// apps/api/src/database/drop-schema.ts
import dataSource from './data-source';

(async () => {
  try {
    if (!dataSource.isInitialized) await dataSource.initialize();
    await dataSource.dropDatabase();
    console.log('Schema dropped.');
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
})();
