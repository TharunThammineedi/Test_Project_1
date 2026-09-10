import testData from '../../test-data.json';
const { test, expect } = require('../../fixtures/walker_fixture.js');
const { heal } = require('../../fixtures/inline_healer.js');

test('Verify Product Item General Information can be edited and saved successfully @regression', async ({ page }) => {
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

  await heal(page, 'confirm sign in button', 'click', null,
    () => page.locator('[data-cy="btnLoginConfirm"]'));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'sign in with email button', 'visible', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));
  await heal(page, 'sign in with email button', 'click', null,
    () => page.locator('[data-cy="btnLoginVisible"]'));

  await heal(page, 'product items link', 'visible', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));
  await heal(page, 'product items link', 'click', null,
    () => page.getByRole('link', { name: 'Product Items', exact: true }));

  await page.waitForLoadState('domcontentloaded');

  await heal(page, 'product item row', 'visible', null,
    () => page.locator('td').filter({ hasText: `FG339544 | ${testData.otp}` }).first());
  await heal(page, 'product item row', 'click', null,
    () => page.locator('td').filter({ hasText: `FG339544 | ${testData.otp}` }).first());

  await heal(page, 'otp tooltip', 'visible', null,
    () => page.locator('p[x-tooltip="' + testData.otp + '"]').first());
  await heal(page, 'otp tooltip', 'click', null,
    () => page.locator('p[x-tooltip="' + testData.otp + '"]').first());

  await heal(page, 'product item detail heading', 'visible', null,
    () => page.locator('div').filter({ hasText: /^FG339544-Product Item$/ }).first());
  await heal(page, 'product item detail heading', 'click', null,
    () => page.locator('div').filter({ hasText: /^FG339544-Product Item$/ }).first());

  await heal(page, 'edit button', 'click', null,
    () => page.locator('button[x-tooltip="Edit"][wire\\:click="openEdit"]'));

  // Edit the description textarea
  await heal(page, 'description field', 'fill', testData.estimate,
    () => page.locator('#productItem.description'));
  await expect(page.locator('#productItem.description')).toHaveValue('Testing123');

  // Edit Default Cost
  await heal(page, 'default cost field', 'fill', testData.itemDefaultCost,
    () => page.locator('input[name="item.default_cost"][type="text"]'));
  await expect(page.locator('input[name="item.default_cost"][type="text"]')).toHaveValue(testData.itemDefaultCost);

  // Edit Default Price
  await heal(page, 'default price field', 'fill', testData.itemDefaultPrice,
    () => page.locator('input[name="item.default_price"][type="text"]'));
  await expect(page.locator('input[name="item.default_price"][type="text"]')).toHaveValue(testData.itemDefaultPrice);

  await heal(page, 'save button', 'click', null,
    () => page.locator('[data-cy="hub-save-button"]'));

  await heal(page, 'saved description', 'visible', null,
    () => page.locator('span').filter({ hasText: /^Testing123$/ }).first());

  await heal(page, 'saved default cost', 'visible', null,
    () => page.locator('span').filter({ hasText: /^\$20\.00$/ }).first());

  await heal(page, 'saved default unit price', 'visible', null,
    () => page.locator('div').filter({ hasText: /^Default Unit Price \$30\.00$/ }).first());

  await heal(page, 'saved default price', 'visible', null,
    () => page.locator('span').filter({ hasText: /^\$30\.00$/ }).first());
});