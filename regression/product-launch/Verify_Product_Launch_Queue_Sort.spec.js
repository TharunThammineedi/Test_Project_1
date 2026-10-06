// Verify Product Launch Queue index sort for all columns (filters can be added here later)
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify sorting on Product Launch Queue page @regression @set2', async ({ page }) => {
  test.setTimeout(300000);
  const session = prepareSession({ force: true });
  Object.assign(testData, session);

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

  const queueRows = page.locator('tbody tr');
  await expect(queueRows.first()).toBeVisible();
  const rowCountBefore = await queueRows.count();
  console.log(`[data] rowCountBefore: ${rowCountBefore}`);
  expect(rowCountBefore).toBeGreaterThan(0);

  const sortColumns = [
    { value: 'routeIdAndRouteDescription', td: 2 },
    { value: 'productItemNumberAndItemDescription', td: 3 },
    { value: 'estimateNumber', td: 6 },
  ];

  for (const { value: column, td } of sortColumns) {
    console.log(`[data] sorting column: ${column}`);
    await page.getByRole('button', { name: 'Sort 1', exact: true }).click();

    const columnSelect = page.locator('select[name="column"]');
    await expect(columnSelect).toBeVisible();
    await columnSelect.selectOption({ value: column });

    const directionSelect = page.locator('select[name="direction"]');
    await expect(directionSelect).toBeVisible();
    await directionSelect.selectOption({ value: 'desc' });

    const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();
    await page.waitForTimeout(2000);

    await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeEnabled();
    expect(await queueRows.count()).toBe(rowCountBefore);

    const descRow1 = ((await page.locator(`//tbody//tr[1]//td[${td}]`).innerText()) || '').split(/\s*\|\s*/)[0].trim();
    const descRow2 = ((await page.locator(`//tbody//tr[2]//td[${td}]`).innerText()) || '').split(/\s*\|\s*/)[0].trim();
    console.log(`[data] descRow1: ${descRow1}`);
    console.log(`[data] descRow2: ${descRow2}`);
    expect(descRow1.localeCompare(descRow2)).toBeGreaterThanOrEqual(0);

    await expect(columnSelect).toHaveValue(column);
    await expect(directionSelect).toBeVisible();
    await directionSelect.selectOption({ value: 'asc' });

    await expect(applyButton).toBeEnabled();
    await applyButton.click();
    await page.waitForTimeout(2000);

    await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeEnabled();
    expect(await queueRows.count()).toBe(rowCountBefore);

    const ascRow1 = ((await page.locator(`//tbody//tr[1]//td[${td}]`).innerText()) || '').split(/\s*\|\s*/)[0].trim();
    const ascRow2 = ((await page.locator(`//tbody//tr[2]//td[${td}]`).innerText()) || '').split(/\s*\|\s*/)[0].trim();
    console.log(`[data] ascRow1: ${ascRow1}`);
    console.log(`[data] ascRow2: ${ascRow2}`);
    expect(ascRow1.localeCompare(ascRow2)).toBeLessThanOrEqual(0);

    await page.getByRole('button', { name: 'Sort 1', exact: true }).click();
  }

});
