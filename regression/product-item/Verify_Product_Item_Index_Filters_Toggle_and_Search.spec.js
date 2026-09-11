// Verify Product Item index: page load, Active Only toggle, Filters, quick search, show page
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Product Item Index Filters, Toggle and Search @regression @set2', async ({ page }) => {
  const session = prepareSession({ force: true });
  Object.assign(testData, session);
  console.log(`[data] Creation override → nameRequired: ${session.nameRequired}`);

  // 1. Go to login page
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

  const productItemsLabel = page.locator('label').filter({ hasText: 'Product Items' }).first();
  await expect(productItemsLabel).toBeVisible();
  await expect(productItemsLabel).toBeEnabled();

  const activeOnlyLabel = page.locator('span').filter({ hasText: 'Active Only' }).first();
  await expect(activeOnlyLabel).toBeVisible();
  await expect(activeOnlyLabel).toBeEnabled();

  const saveSearchButton = page.getByRole('button', { name: 'Save Search', exact: true });
  await expect(saveSearchButton).toBeVisible();

  const resetButton = page.getByRole('button', { name: 'Reset', exact: true }).first();
  await expect(resetButton).toBeVisible();

  const quickSearchInput = page.locator('input[placeholder="Quick Search"][data-flux-control]');
  await expect(quickSearchInput).toBeVisible();
  await expect(quickSearchInput).toBeEnabled();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeVisible();
  await expect(filtersButton).toBeEnabled();

  const sortButton = page.getByRole('button', { name: 'Sort 1', exact: true });
  await expect(sortButton).toBeVisible();
  await expect(sortButton).toBeEnabled();

  const newProductItemLink = page.getByRole('link', {
    name: 'New Product Item',
    exact: true
  });
  await expect(newProductItemLink).toBeVisible();
  await expect(newProductItemLink).toBeEnabled();

  const productItemCustomerHeader = page
    .locator('th')
    .filter({ hasText: 'PRODUCT ITEM # | CUSTOMER PART #' })
    .first();
  await expect(productItemCustomerHeader).toBeVisible();

  const customerHeader = page
    .locator('th')
    .filter({ hasText: 'CUSTOMER' })
    .first();
  await expect(customerHeader).toBeVisible();

  const descriptionHeader = page
    .locator('th')
    .filter({ hasText: 'DESCRIPTION' })
    .first();
  await expect(descriptionHeader).toBeVisible();

  const unitTemplateSummaryHeader = page
    .locator('th')
    .filter({ hasText: 'UNIT TEMPLATE ID | SUMMARY' })
    .first();
  await expect(unitTemplateSummaryHeader).toBeVisible();

  const productClassText = page
    .locator('th')
    .filter({ hasText: 'PRODUCT CLASS' })
    .first();
  await expect(productClassText).toBeVisible();

  const statusHeader = page
    .locator('th')
    .filter({ hasText: 'STATUS' })
    .first();
  await expect(statusHeader).toBeVisible();

  const productItemsRowCount = await page.locator('//th[normalize-space()="Customer"]//following::tbody//tr//td[2]').count();
  if (productItemsRowCount === 0) {
    await page.waitForLoadState('domcontentloaded');
    const noProductItemsText = page.locator('//div[normalize-space()="No product items created yet"]');
    await expect(noProductItemsText).toBeVisible();
  } else {
    await expect(productItemsRowCount).toBeGreaterThan(0);
    console.log('productItemsRowCount: ' + productItemsRowCount);
  }

  const activeOnlyToggle = page.locator(
    '//span[normalize-space()="Active Only"]//following::button[1]'
  );

  const isActiveOnlyEnabled = await activeOnlyToggle.evaluate((button) =>
    button.classList.contains('bg-denim-blue-600')
  );
  await expect(isActiveOnlyEnabled).toBe(true);

  const activeOnlyCount = Number(
    await page.locator('//div[@aria-label="Pagination"]//span[2]').innerText()
  );
  console.log(`[data] activeOnlyCount: ${activeOnlyCount}`);

  await activeOnlyToggle.click();
  await page.waitForTimeout(3000);

  const isActiveOnlyEnabledAfterToggleOff = await activeOnlyToggle.evaluate((button) =>
    button.classList.contains('bg-denim-blue-600')
  );
  await expect(isActiveOnlyEnabledAfterToggleOff).toBe(false);

  const allItemsCount = Number(
    await page.locator('//div[@aria-label="Pagination"]//span[2]').innerText()
  );
  console.log(`[data] allItemsCount: ${allItemsCount}`);

  await expect(allItemsCount).toBeGreaterThan(activeOnlyCount);

  await activeOnlyToggle.click();
  await page.waitForTimeout(3000);

  await expect(filtersButton).toBeEnabled();
  await filtersButton.click();

  const columnSelect = page.locator('select[data-flux-select-native][x-model="selection.column"]').first();
  await columnSelect.selectOption('Customer');

  const operatorSelect = page.locator("xpath=//div[normalize-space(.)='Operator is equal tocontains']//select");
  await operatorSelect.selectOption('contains');

  const valueSelect = page.getByPlaceholder('value');
  await valueSelect.fill(testData.quickSearch);

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const filteredRows = page.locator('//th[normalize-space()="Customer"]//following::tbody//tr');
  await expect(filteredRows.first()).toBeVisible();
  const filteredRowTexts = await filteredRows.allTextContents();
  for (const text of filteredRowTexts) {
    expect(text.toLowerCase()).toContain(testData.quickSearch.toLowerCase());
  }

  await expect(resetButton).toBeEnabled();
  await resetButton.click();
  await page.waitForTimeout(2000);
  await expect(page.getByRole('button', { name: 'Filters 0', exact: true })).toBeVisible();

  const firstProductCell = page.locator('//tbody//tr[1]//td[2]//p[1]');
  await expect(firstProductCell).toBeVisible();
  const productItemSearch = (await firstProductCell.textContent() || '').split(/\s*\|\s*/)[0].trim().replace(/\|/g, '').trim();
  console.log(`[data] productItemSearch: ${productItemSearch}`);

  await quickSearchInput.fill(productItemSearch);

  const productItemsRow = page.locator('//th[normalize-space()="Customer"]//following::tbody//tr//td[2]');
  await expect(productItemsRow).toHaveCount(1);

  const searchedItem = page.locator('//tbody//tr[1]//td[2]//p[1]');
  await expect(searchedItem).toBeVisible();
  await searchedItem.click();

  const productItemHeading = page.locator('div').filter({ hasText: `${productItemSearch}-Product Item` }).first();
  await expect(productItemHeading).toBeVisible();

  const productItemInfoSection = page.locator('div').filter({ hasText: 'Product Item Information' }).first();
  await expect(productItemInfoSection).toBeVisible();

  const detailsTabButton = page.locator('[data-cy="hub-tab-details"]');
  await expect(detailsTabButton).toBeVisible();

  const productRouteHeading = page.locator('h3').filter({ hasText: 'Product Route' }).first();
  await expect(productRouteHeading).toBeVisible();
});
