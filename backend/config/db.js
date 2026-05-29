/**
 * backend/config/db.js
 * ------------------------------------------------------------
 * MongoDB connection helper.
 *
 * Why logging matters:
 * - MongoDB Atlas often fails due to SRV DNS/network/auth issues.
 * - Detailed logs make it obvious which stage fails (URI parse vs SRV lookup vs auth).
 */

const mongoose = require('mongoose');

function redactMongoUri(uri) {
  // Redact username/password portion: mongodb+srv://user:pass@host/... -> mongodb+srv://***:***@host/...
  return uri.replace(/^(mongodb\+srv:\/\/)([^:/?#]+):([^@/?#]+)@/, '$1***:***@');
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  console.log('[db] Connecting to MongoDB...');
  console.log('[db] URI:', redactMongoUri(uri));
  console.log('[db] Mongoose version:', mongoose.version);
  console.log('[db] Node version:', process.version);

  // These options help with Atlas connectivity debugging.
  // If SRV resolution is failing, you'll see it quickly in the error message.
  const start = Date.now();

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      // Keep user-friendly logging; mongoose handles most options internally.
      // Note: If you use srv://, driver will do DNS SRV + TXT lookups.
    });

    const ms = Date.now() - start;
    console.log(`[db] ✅ Connected in ${ms}ms`);
    console.log('[db] Connected DB name:', conn.connection?.name);

    return conn;
  } catch (err) {
    console.error('[db] ❌ MongoDB connection error');
    console.error('[db] Message:', err?.message || err);
    console.error('[db] Name:', err?.name);
    console.error('[db] Code:', err?.code);

    // Helpful when SRV fails.
    if (err?.message) {
      console.error('[db] Full message:', err.message);
    }

    throw err;
  }
}

module.exports = { connectDB };

