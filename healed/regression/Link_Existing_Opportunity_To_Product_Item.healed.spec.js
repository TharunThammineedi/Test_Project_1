import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Verify an existing Opportunity can be linked to a Product Item @regression', async ({ page }) => {
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

  await heal(page, 'product items link', 'visible', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));
  await heal(page, 'product items link', 'click', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));

  await heal(page, 'product item cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^FG339549 \| 6574363$/ }).first());
  await heal(page, 'product item cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^FG339549 \| 6574363$/ }).first());

  await heal(page, 'serial number cell', 'visible', null,
    () => page.locator('p').filter({ hasText: /^6574363$/ }).first());
  await heal(page, 'serial number cell', 'click', null,
    () => page.locator('p').filter({ hasText: /^6574363$/ }).first());

  await heal(page, 'product item heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^FG339549-Product Item$/ }).first());
  await heal(page, 'product item heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^FG339549-Product Item$/ }).first());

  await heal(page, 'links tab button', 'click', null,
    () => page.locator('[data-cy="hub-tab-links"]'));

  await heal(page, 'opportunities section', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Opportunities New Opportunity Choose Opportunities$/ }).first());
  await heal(page, 'opportunities section', 'click', null,
    () => page.locator('div').filter({ hasText: /^Opportunities New Opportunity Choose Opportunities$/ }).first());

  await heal(page, 'cancel button', 'click', null,
    () => page.getByRole('button', { name: 'Cancel', exact: true }));

  await heal(page, 'choose opportunities button', 'click', null,
    () => page.getByRole('button', { name: 'Choose Opportunities', exact: true }));

  await heal(page, 'quick search field', 'visible', null,
    () => page.getByPlaceholder('Quick Search'));
  await heal(page, 'quick search field', 'fill', testData.quickSearch,
    () => page.getByPlaceholder('Quick Search'));

  await heal(page, 'max verstappen cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^Max verstappen$/ }).first());
  await heal(page, 'max verstappen cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^Max verstappen$/ }).first());

  await heal(page, 'max verstappen div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Max verstappen$/ }).first());
  await heal(page, 'max verstappen div', 'click', null,
    () => page.locator('div').filter({ hasText: /^Max verstappen$/ }).first());

  await heal(page, 'opp code cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^OPP2276$/ }).first());
  await heal(page, 'opp code cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^OPP2276$/ }).first());

  await heal(page, 'continue button', 'click', null,
    () => page.getByRole('button', { name: 'Continue', exact: true }));

  await heal(page, 'opp code div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^OPP2276$/ }).first());
  await heal(page, 'opp code div', 'click', null,
    () => page.locator('div').filter({ hasText: /^OPP2276$/ }).first());

  await heal(page, 'code date description heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^CODE DATE DESCRIPTION$/ }).first());
  await heal(page, 'code date description heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^CODE DATE DESCRIPTION$/ }).first());

  await heal(page, 'description heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^DESCRIPTION$/ }).first());
  await heal(page, 'description heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^DESCRIPTION$/ }).first());

  await heal(page, 'sign in with email button', 'visible', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));
  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'open link', 'visible', null,
    () => page.locator('a[x-tooltip="Open"]'));
  await heal(page, 'open link', 'click', null,
    () => page.locator('a[x-tooltip="Open"]'));

  await heal(page, 'opp code div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^OPP2276$/ }).first());
  await heal(page, 'opp code div', 'click', null,
    () => page.locator('div').filter({ hasText: /^OPP2276$/ }).first());
});