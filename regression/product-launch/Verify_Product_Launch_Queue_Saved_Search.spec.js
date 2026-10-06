// Verify Product Launch Queue: save search from sort, cancel delete, apply saved search
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Product Launch Queue Saved Search @regression @set2', async ({ page }) => {
  test.setTimeout(180000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  const savedSearchLabel = `PLQ ${session.brandName}`.trim().slice(0, 40);
  console.log(`[data] savedSearchLabel: ${savedSearchLabel}`);

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

  const loginConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(loginConfirmButton).toBeEnabled();
  await loginConfirmButton.click();
  await page.waitForLoadState('domcontentloaded');

  const estimatingPricingButton = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimatingPricingButton).toBeEnabled();
  await estimatingPricingButton.click();

  const productLaunchQueueLink = page.getByRole('link', { name: 'Product Launch Queue', exact: true });
  await expect(productLaunchQueueLink).toBeVisible();
  await expect(productLaunchQueueLink).toBeEnabled();
  await productLaunchQueueLink.click();
  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByPlaceholder('Quick Search').first()).toBeVisible();

  const sort1Button = page.getByRole('button', { name: 'Sort 1', exact: true });
  await expect(sort1Button).toBeEnabled();
  await sort1Button.click();

  const columnSelect = page.locator('select[name="column"]');
  await expect(columnSelect).toBeVisible();
  await columnSelect.selectOption({ value: 'routeIdAndRouteDescription' });

  const directionSelect = page.locator('select[name="direction"]');
  await expect(directionSelect).toBeVisible();
  await directionSelect.selectOption({ value: 'desc' });

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeEnabled();

  const saveSearchButton = page.getByRole('button', { name: 'Save Search', exact: true });
  await expect(saveSearchButton).toBeEnabled();
  await saveSearchButton.click();

  const saveCurrentButton = page.getByRole('button', { name: 'Save Current', exact: true });
  await expect(saveCurrentButton).toBeEnabled();
  await saveCurrentButton.click();

  const labelInput = page.locator('input[name="name"][type="text"]');
  await expect(labelInput).toBeVisible();
  await expect(labelInput).toBeEditable();
  await labelInput.fill(savedSearchLabel);

  const saveButton = page.getByRole('button', { name: 'Save', exact: true });
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
  await page.waitForTimeout(2000);

  const cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  await expect(cancelButton).toBeEnabled();
  await cancelButton.click();

  const savedSearchesButton = page.locator('button[x-tooltip="Saved Searches"]');
  await expect(savedSearchesButton).toBeEnabled();
  await savedSearchesButton.click();

  const savedSearchButton = page.getByRole('button', { name: savedSearchLabel, exact: true });
  await expect(savedSearchButton).toBeVisible();
  await expect(savedSearchButton).toBeEnabled();
  await savedSearchButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeEnabled();
  const sortedRow1 = ((await page.locator('//tbody//tr[1]//td[2]').innerText()) || '').split(/\s*\|\s*/)[0].trim();
  const sortedRow2 = ((await page.locator('//tbody//tr[2]//td[2]').innerText()) || '').split(/\s*\|\s*/)[0].trim();
  console.log(`[data] sortedRow1: ${sortedRow1}`);
  console.log(`[data] sortedRow2: ${sortedRow2}`);
  expect(sortedRow1.localeCompare(sortedRow2)).toBeGreaterThanOrEqual(0);

  await expect(savedSearchesButton).toBeEnabled();
  await savedSearchesButton.click();

  await expect(savedSearchButton).toBeVisible();
  const deleteButton = page.locator('button[x-tooltip="Delete"]').last();
  await expect(deleteButton).toBeEnabled();
  await deleteButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: savedSearchLabel, exact: true })).toHaveCount(0);
});
