import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Create Prepress from product item @regression', async ({ page }) => {
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

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'product items link', 'visible', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));
  await heal(page, 'product items link', 'click', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'product item cell', 'visible', null,
    () => page.locator('td').filter({ hasText: /^FG339556 \| 6574363$/ }).first());
  await heal(page, 'product item cell', 'click', null,
    () => page.locator('td').filter({ hasText: /^FG339556 \| 6574363$/ }).first());

  await heal(page, 'product item tooltip', 'visible', null,
    () => page.locator('p').filter({ hasText: /^6574363$/ }).first());
  await heal(page, 'product item tooltip', 'click', null,
    () => page.locator('p').filter({ hasText: /^6574363$/ }).first());

  await heal(page, 'product item heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^FG339556-Product Item$/ }).first());
  await heal(page, 'product item heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^FG339556-Product Item$/ }).first());

  await heal(page, 'new prepress request button', 'click', null,
    () => page.getByRole('button', { name: 'New Prepress Request', exact: true }));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'prepress success message', 'visible', null,
    () => page.locator('p').filter({ hasText: /^Prepress Request Created Successfully$/ }).first());

  await heal(page, 'request number span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^Request #PPR2768$/ }).first());
  await heal(page, 'request number span', 'click', null,
    () => page.locator('span').filter({ hasText: /^Request #PPR2768$/ }).first());

  await heal(page, 'ppr div', 'visible', null,
    () => page.locator('div').filter({ hasText: /^PPR2768$/ }).first());
  await heal(page, 'ppr div', 'click', null,
    () => page.locator('div').filter({ hasText: /^PPR2768$/ }).first());

  await heal(page, 'art span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^ART12107$/ }).first());
  await heal(page, 'art span', 'click', null,
    () => page.locator('span').filter({ hasText: /^ART12107$/ }).first());

  await heal(page, 'waiting for art badge', 'visible', null,
    () => page.locator('[id="badge-Waiting for Art"]'));
  await heal(page, 'waiting for art badge', 'click', null,
    () => page.locator('[id="badge-Waiting for Art"]'));

  await heal(page, 'draft badge', 'visible', null,
    () => page.locator('[id="badge-Draft"]'));
  await heal(page, 'draft badge', 'click', null,
    () => page.locator('[id="badge-Draft"]'));

  await heal(page, 'open link', 'visible', null,
    () => page.locator('a[x-tooltip="Open"]'));
  await heal(page, 'open link', 'click', null,
    () => page.locator('a[x-tooltip="Open"]'));

  await heal(page, 'request number span', 'visible', null,
    () => page.locator('span').filter({ hasText: /^Request #PPR2768$/ }).first());
  await heal(page, 'request number span', 'click', null,
    () => page.locator('span').filter({ hasText: /^Request #PPR2768$/ }).first());
});