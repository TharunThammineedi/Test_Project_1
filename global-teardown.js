const { endSession } = require('./helpers/sessionData');

/**
 * Runs once after the test session.
 * Keeps data/session-data.json so later tests reuse the same data
 */
async function globalTeardown() {
  endSession();
  console.log('[data] Session kept (test-data.json not modified — parallel-safe)');
}

module.exports = globalTeardown;
