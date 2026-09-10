const { prepareSession, hasSession } = require('./helpers/sessionData');

/**
 * Runs once before the test session.
 * Reuses data/session-data.json when present (not wiped by Playwright).
 * Create Draft RFP overrides via prepareSession({ force: true }).
 */
async function globalSetup() {
  const reused = hasSession();
  const session = prepareSession({ force: false });
  console.log(
    reused
      ? '[data] Reusing session → data/session-data.json'
      : '[data] New session created → data/session-data.json'
  );
  console.log('[data] test-data.json is read-only during runs (parallel-safe)');
  console.log(`[data] nameRequired: ${session.nameRequired}`);
  console.log(`[data] firstNameRequired: ${session.firstNameRequired}`);
  console.log(`[data] lastNameRequired: ${session.lastNameRequired}`);
}

module.exports = globalSetup;
