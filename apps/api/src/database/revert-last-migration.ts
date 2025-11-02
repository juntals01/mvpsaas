// apps/api/src/database/revert-last-migration.ts
import dataSource from './data-source';

(async () => {
  try {
    if (!dataSource.isInitialized) await dataSource.initialize();
    const migrations = await dataSource.showMigrations(); // note: showMigrations returns boolean in some versions
    // If you want a single-step revert:
    await dataSource.undoLastMigration();
    console.log('Last migration reverted.');
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
})();
