import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Add Bill To Address in RFP @regression', async ({ page }) => {
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

  await heal(page, 'login confirm button', 'click', null,
    () => page.locator('[data-cy="btnLoginConfirm"]'));

  await heal(page, 'rfp link', 'visible', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));
  await heal(page, 'rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'mine label', 'visible', null,
    () => page.locator('label').filter({ hasText: /^Mine$/ }).first());
  await heal(page, 'mine label', 'click', null,
    () => page.locator('label').filter({ hasText: /^Mine$/ }).first());

  await heal(page, 'sioux cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^Sioux Preme Packing Co\.$/ }).first());
  await heal(page, 'sioux cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^Sioux Preme Packing Co\.$/ }).first());

  await heal(page, 'sioux div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Sioux Preme Packing Co\.$/ }).first());

  await heal(page, 'rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'rfp link', 'click', null,
    () => page.getByRole('link', { name: 'Request For Proposals', exact: true }));

  await heal(page, 'mine div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());
  await heal(page, 'mine div', 'click', null,
    () => page.locator('div').filter({ hasText: /^Mine$/ }).first());

  await heal(page, 'filters button', 'click', null,
    () => page.getByRole('button', { name: 'Filters 0', exact: true }));

  await heal(page, 'column field', 'visible', null,
    () => page.locator('input[name="rows.0.column"][type="text"]'));
  await heal(page, 'column field', 'click', null,
    () => page.locator('input[name="rows.0.column"][type="text"]'));

  await heal(page, 'status option', 'visible', null,
    () => page.locator('li[data-label="Status"]'));
  await heal(page, 'status option', 'click', null,
    () => page.locator('li[data-label="Status"]'));

  await heal(page, 'operator field', 'visible', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));
  await heal(page, 'operator field', 'click', null,
    () => page.locator('input[name="rows.0.operator"][type="text"]'));

  await heal(page, 'is option', 'visible', null,
    () => page.locator('li[data-label="is"]'));
  await heal(page, 'is option', 'click', null,
    () => page.locator('li[data-label="is"]'));

  await heal(page, 'value field', 'visible', null,
    () => page.locator('[data-cy="filter-select-value"]'));
  await heal(page, 'value field', 'click', null,
    () => page.locator('[data-cy="filter-select-value"]'));

  await heal(page, 'requested option', 'visible', null,
    () => page.locator('li[data-label="Requested"]'));
  await heal(page, 'requested option', 'click', null,
    () => page.locator('li[data-label="Requested"]'));

  await heal(page, 'apply button', 'click', null,
    () => page.getByRole('button', { name: 'Apply', exact: true }));

  await heal(page, 'charles cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^Charles Lecrec$/ }).first());
  await heal(page, 'charles cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^Charles Lecrec$/ }).first());

  await heal(page, 'charles div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Charles Lecrec$/ }).first());

  await heal(page, 'edit button', 'click', null,
    () => page.locator('button[x-tooltip="Edit"]'));

  await heal(page, 'customer address div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Customer Address Berlin , , ' + testData.otp + '$/ }).first());
  await heal(page, 'customer address div', 'click', null,
    () => page.locator('div').filter({ hasText: /^Customer Address Berlin , , ' + testData.otp + '$/ }).first());

  await heal(page, 'berlin button', 'click', null,
    () => page.getByRole('button', { name: 'Berlin , , ' + testData.otp, exact: true }));

  await heal(page, 'unlink button', 'click', null,
    () => page.getByRole('button', { name: 'Unlink', exact: true }));

  await heal(page, 'select address button', 'click', null,
    () => page.getByRole('button', { name: 'Select Address', exact: true }));

  await heal(page, 'selected id radio', 'visible', null,
    () => page.locator('#selectedid'));
  await heal(page, 'selected id radio', 'check', null,
    () => page.locator('#selectedid'));

  await heal(page, 'continue button', 'click', null,
    () => page.getByRole('button', { name: 'Continue', exact: true }));

  await heal(page, 'berlin button', 'click', null,
    () => page.getByRole('button', { name: 'Berlin , , ' + testData.otp, exact: true }));

  await heal(page, 'cancel button', 'click', null,
    () => page.getByRole('button', { name: 'Cancel', exact: true }));

  await heal(page, 'save button', 'click', null,
    () => page.locator('button[x-tooltip="Save"][wire\\:click="save"]'));

  await heal(page, 'bill to address text', 'visible', null,
    () => page.locator('span').filter({ hasText: /^Berlin , , ' + testData.otp + ' United Kingdom of Great Britain and Northern Ireland \\(the\\)$/ }).first());
});