// Link Related Product Item on Product Item Links tab (TC63)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Link Related Product Item @regression @set2', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  await page.goto(testData.url);
  await page.waitForLoadState('domcontentloaded');

  const signInWithEmailButton = page.locator('[data-cy="btnLoginVisible"]');
  await expect(signInWithEmailButton).toBeEnabled();
  await signInWithEmailButton.click();

  const emailInput = page.locator('input[name="email"][type="email"]');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEditable();
  await emailInput.fill(testData.email);

  const passwordInput = page.locator('input[name="password"][type="password"]');
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toBeEditable();
  await passwordInput.fill(testData.password);

  const signInConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(signInConfirmButton).toBeEnabled();
  await signInConfirmButton.click();

  await page.waitForLoadState('domcontentloaded');

  const itemsMenuButton = page.locator('button').filter({ hasText: 'Items' }).first();
  await expect(itemsMenuButton).toBeEnabled();
  await itemsMenuButton.click();

  const productItemsLink = page.getByRole('link', { name: 'Product Items', exact: true });
  await expect(productItemsLink).toBeVisible();
  await expect(productItemsLink).toBeEnabled();
  await productItemsLink.click();

  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('main').getByText('Product Items')).toBeVisible();

  await page.waitForTimeout(2000);

  const firstProductItem = page.locator('//tbody//tr[1]//td[2]//p[1]');
  await expect(firstProductItem).toBeVisible();
  const firstProductItemText = (await firstProductItem.textContent() || '').split(/\s*\|\s*/)[0].trim().replace(/\|/g, '').trim();
  console.log(`[data] hostProductItemId: ${firstProductItemText}`);

  const secondProductItem = page.locator('//tbody//tr[2]//td[2]//p[1]');
  await expect(secondProductItem).toBeVisible();
  const relatedProductItemText = (await secondProductItem.textContent() || '').split(/\s*\|\s*/)[0].trim().replace(/\|/g, '').trim();
  console.log(`[data] relatedProductItemId: ${relatedProductItemText}`);

  await firstProductItem.click();

  await page.waitForTimeout(2000);
  const productItemHeading = page.locator('div').filter({ hasText: `${firstProductItemText}-Product Item` }).first();
  await expect(productItemHeading).toBeVisible();

  const newProductItemLink = page.getByRole('link', { name: 'New Product Item', exact: true });
  await expect(newProductItemLink).toBeVisible();

  const linksTabButton = page.locator('[data-cy="hub-tab-links"]');
  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();

  const relatedProductItemsHeading = page.locator('h3').filter({ hasText: 'Related Product Items' }).first();
  await expect(relatedProductItemsHeading).toBeVisible();

  const chooseProductItemsButton = page.locator('//h3[normalize-space()="Related Product Items"]//following::button[1]').first();
  await expect(chooseProductItemsButton).toBeEnabled();
  await chooseProductItemsButton.click();

  const chooseProductItemHeading = page.locator('h3').filter({ hasText: 'Choose Product Item' }).first();
  await expect(chooseProductItemHeading).toBeVisible();

  const quickSearchInput = page.locator('//h3[normalize-space()="Choose Product Item"]//following::input[1]').first();
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEditable();
  await quickSearchInput.fill(relatedProductItemText);

  await page.waitForTimeout(3000);

  const productItemRow = page.locator('td').filter({ hasText: relatedProductItemText }).first();
  await expect(productItemRow).toBeVisible();
  await expect(productItemRow).toBeEnabled();

  const productRow = page.locator('tbody tr').filter({ hasText: relatedProductItemText }).first();
  const checkbox = productRow.locator('input[type="checkbox"]').first();
  await expect(checkbox).toBeVisible();

  if (!(await checkbox.isChecked())) {
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(relatedProductItemsHeading).toBeVisible();

  const productText = page.locator(
    `//div[contains(@class, "text-ellipsis") and normalize-space()="${relatedProductItemText}"]`
  );
  await expect(productText).toBeVisible();
  await expect(productText).toHaveCount(1);

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  await expect(linksTabButton).toBeEnabled();
  await linksTabButton.click();
  await expect(relatedProductItemsHeading).toBeVisible();
  await expect(productText).toBeVisible();
  await expect(productText).toHaveCount(1);
});
