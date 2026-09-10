import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Verify General Information fields can be edited after RFP creation @regression', async ({ page }) => {
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

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'rfp link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

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
    () => page.locator('td').filter({ hasText: /^RFP2941$/ }).first());
  await heal(page, 'rfp cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^RFP2941$/ }).first());

  await heal(page, 'rfp span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2941$/ }).first());
  await heal(page, 'rfp span', 'click', null,
    () => page.locator('span').filter({ hasText: /^RFP2941$/ }).first());

  await heal(page, 'rfp header span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^RFP2941 - Request for Proposal$/ }).first());
  await heal(page, 'rfp header span', 'click', null,
    () => page.locator('span').filter({ hasText: /^RFP2941 - Request for Proposal$/ }).first());

  await heal(page, 'description div', 'visible', null,
    () => page.locator('div').filter({ hasText: new RegExp(`^Description ${testData.otp} Book reprint for Ragan & Massey$`) }).first());
  await heal(page, 'description div', 'click', null,
    () => page.locator('div').filter({ hasText: new RegExp(`^Description ${testData.otp} Book reprint for Ragan & Massey$`) }).first());

  await heal(page, 'description span', 'visible', null,
    () => page.locator('span').filter({ hasText: new RegExp(`^${testData.otp} Book reprint for Ragan & Massey$`) }).first());
  await heal(page, 'description span', 'click', null,
    () => page.locator('span').filter({ hasText: new RegExp(`^${testData.otp} Book reprint for Ragan & Massey$`) }).first());

  await heal(page, 'edit button', 'click', null,
    () => page.locator('[data-cy="estimateEditButton"]'));

  // 22. Edit Description textarea
  await heal(page, 'estimate description textarea', 'visible', null,
    () => page.locator('#estimate.description'));
  await heal(page, 'estimate description textarea', 'click', null,
    () => page.locator('#estimate.description'));
  await heal(page, 'estimate description textarea', 'fill', testData.estimate,
    () => page.locator('#estimate.description'));

  // The following assertion is not a locator action, so it is preserved as-is
  await expect(page.locator('#estimate.description')).toHaveValue('Updated Test');

  await heal(page, 'order type field', 'visible', null,
    () => page.locator('input[name="orderType"][type="text"]'));
  await heal(page, 'order type field', 'click', null,
    () => page.locator('input[name="orderType"][type="text"]'));

  await heal(page, 'stock list item', 'visible', null,
    () => page.locator('li[data-label="Stock"]'));
  await heal(page, 'stock list item', 'click', null,
    () => page.locator('li[data-label="Stock"]'));

  await heal(page, 'save button', 'click', null,
    () => page.locator('[id="estimate::edit-save-' + testData.otp + '"]'));
  await page.locator('[id="estimate::edit-save-' + testData.otp + '"]').scrollIntoViewIfNeeded();

  await heal(page, 'order type stock div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Order Type Stock$/ }).first());

  await heal(page, 'description updated test div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Description Updated Test$/ }).first());

  await heal(page, 'updated test div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Updated Test$/ }).first());
});