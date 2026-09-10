import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Verify the Summary icon in the RFP Show page @regression', async ({ page }) => {
  // 1. Go to login page
  await page.goto(testData.url);
  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'email field', 'visible', null,
    () => page.locator('input[name="email"][type="email"]'));
  await heal(page, 'email field', 'fill', testData.email,
    () => page.locator('input[name="email"][type="email"]'));

  await heal(page, 'password field', 'visible', null,
    () => page.locator('input[name="password"][type="password"]'));
  await heal(page, 'password field', 'fill', testData.password,
    () => page.locator('input[name="password"][type="password"]'));

  await heal(page, 'sign in confirm button', 'click', null,
    () => page.locator('[data-cy="btnLoginConfirm"]'));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'rfp link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'filters button', 'click', null,
    () => page.getByRole('button', { name: 'Filters 0', exact: true }));

  await heal(page, 'column field', 'visible', null,
    () => page.locator('input[name="rows.0.column"][type="text"]'));
  await heal(page, 'column field', 'click', null,
    () => page.locator('input[name="rows.0.column"][type="text"]'));

  await heal(page, 'status list item', 'visible', null,
    () => page.locator('li[data-label="Status"]'));
  await heal(page, 'status list item', 'click', null,
    () => page.locator('li[data-label="Status"]'));

  await heal(page, 'operator field', 'visible', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));
  await heal(page, 'operator field', 'click', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));

  await heal(page, 'is list item', 'visible', null,
    () => page.locator('li[data-label="is"]'));
  await heal(page, 'is list item', 'click', null,
    () => page.locator('li[data-label="is"]'));

  await heal(page, 'value field', 'visible', null,
    () => page.locator('[data-cy="filter-select-value"]'));
  await heal(page, 'value field', 'click', null,
    () => page.locator('[data-cy="filter-select-value"]'));

  await heal(page, 'requested list item', 'visible', null,
    () => page.locator('li[data-label="Requested"]'));
  await heal(page, 'requested list item', 'click', null,
    () => page.locator('li[data-label="Requested"]'));

  await heal(page, 'apply button', 'click', null,
    () => page.getByRole('button', { name: 'Apply', exact: true }));

  await heal(page, 'rfp cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^RFP2416$/ }).first());
  await heal(page, 'rfp cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^RFP2416$/ }).first());

  await heal(page, 'rfp span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2416$/ }).first());
  await heal(page, 'rfp span', 'click', null,
    () => page.locator('span').filter({ hasText: /^RFP2416$/ }).first());

  await heal(page, 'rfp show heading', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2416 - Request for Proposal$/ }).first());
  await heal(page, 'rfp show heading', 'click', null,
    () => page.locator('span').filter({ hasText: /^RFP2416 - Request for Proposal$/ }).first());

  await heal(page, 'summary button', 'click', null,
    () => page.locator('[data-cy="summary-button"]'));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'summary heading', 'visible', null,
    () => page.locator('h1').filter({ hasText: /^REQUEST FOR PROPOSAL #RFP2416 SUMMARY$/ }).first());

  await heal(page, 'description div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^DESCRIPTION: Testing123$/ }).first());

  await heal(page, 'description value span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^Testing123$/ }).first());
});