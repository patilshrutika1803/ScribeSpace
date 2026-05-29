/**
 * backend/testMongo.js
 * ------------------------------------------------------------
 * Standalone MongoDB connectivity test.
 * Run with:
 *   node testMongo.js
 */

const mongoose = require('mongoose');

async function main() {
  // Load .env for standalone runs (server.js also loads it).
  // This ensures `node testMongo.js` works even if dotenv isn't loaded elsewhere.
  require('dotenv').config();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[testMongo] Missing MONGODB_URI. Ensure backend/.env has MONGODB_URI=...');
    process.exit(1);
  }


  console.log('[testMongo] Using Mongo URI (redacted credentials):');
  console.log('[testMongo]', uri.replace(/:(.*?)@/, ':***@'));

  // Lower-level connection sanity checks.
  // Note: We intentionally avoid deprecated options; mongoose v8 uses defaults.
  const start = Date.now();

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
    });

    const connTime = Date.now() - start;

    // Simple command to confirm we can run operations
    const result = await mongoose.connection.db.admin().ping();

    console.log('[testMongo] ✅ Connected. ping result:', result);
    console.log('[testMongo] Connection time (ms):', connTime);

    // List databases (read-only) to confirm authentication
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log('[testMongo] Databases:', dbs.databases.map((d) => d.name));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[testMongo] ❌ Connection failed.');
    console.error('[testMongo] Message:', err?.message || err);
    console.error('[testMongo] Name:', err?.name);
    console.error('[testMongo] Stack:', err?.stack);
    process.exit(1);
  }
}

main();

