import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Verify Notes can be added to the Product Item @regression', async ({ page }) => {
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

  await heal(page, 'product items link', 'visible', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));
  await heal(page, 'product items link', 'click', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'product item row', 'visible', null,
    () => page.locator('td').filter({ hasText: new RegExp(`^FG339544 \\| ${testData.otp}$`) }).first());
  await heal(page, 'product item row', 'click', null,
    () => page.locator('td').filter({ hasText: new RegExp(`^FG339544 \\| ${testData.otp}$`) }).first());

  await heal(page, 'otp tooltip paragraph', 'visible', null,
    () => page.locator('p').filter({ hasText: new RegExp(`^${testData.otp}$`) }).first());
  await heal(page, 'otp tooltip paragraph', 'click', null,
    () => page.locator('p').filter({ hasText: new RegExp(`^${testData.otp}$`) }).first());

  await heal(page, 'product item detail heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^FG339544-Product Item$/ }).first());
  await heal(page, 'product item detail heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^FG339544-Product Item$/ }).first());

  await heal(page, 'notes new note section', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Notes New Note$/ }).first());
  await heal(page, 'notes new note section', 'click', null,
    () => page.locator('div').filter({ hasText: /^Notes New Note$/ }).first());

  await heal(page, 'new note button', 'click', null,
    () => page.locator('[data-cy="new-note-button"]'));

  await heal(page, 'note editor', 'visible', null,
    () => page.locator('.ql-editor'));
  await heal(page, 'note editor', 'fill', testData.awaitPageLocatorQlEditorFill,
    () => page.locator('.ql-editor'));

  await heal(page, 'save note button', 'click', null,
    () => page.locator('button[x-tooltip="Save"][wire\\:click="create"]'));

  await heal(page, 'note created message', 'visible', null,
    () => page.locator('p').filter({ hasText: /^Note created successfully\.$/ }).first());

  await heal(page, '8/25/26 2:23 pm div', 'click', null,
    () => page.locator('div').filter({ hasText: /^8\/25\/26 2:23 PM$/ }).first());

  await heal(page, '8/25/26 div', 'click', null,
    () => page.locator('div').filter({ hasText: /^8\/25\/26$/ }).first());

  await heal(page, 'rohith ranga div', 'click', null,
    () => page.locator('div').filter({ hasText: /^Rohith Ranga$/ }).first());

  await heal(page, 'rohith ranga span', 'click', null,
    () => page.locator('span').filter({ hasText: /^Rohith Ranga$/ }).first());

  await heal(page, 'note text paragraph', 'visible', null,
    () => page.locator('p').filter({ hasText: /^Test123$/ }).first());
  await heal(page, 'note text paragraph', 'click', null,
    () => page.locator('p').filter({ hasText: /^Test123$/ }).first());
});