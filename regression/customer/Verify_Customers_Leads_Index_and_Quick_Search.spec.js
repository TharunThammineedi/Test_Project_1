// Verify Customers / Leads index chrome, toggles, and Quick Search
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Customers Leads Index and Quick Search @regression @set1', async ({ page }) => {
  test.setTimeout(300000);
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

  const customerSidebarButton = page.locator('(//button[normalize-space()="Customer"])[1]');
  await expect(customerSidebarButton).toBeVisible();
  await customerSidebarButton.click();

  const customersLink = page.getByRole('link', { name: 'Customers', exact: true });
  await expect(customersLink).toBeVisible();
  await expect(customersLink).toBeEnabled();
  await customersLink.click();
  await page.waitForLoadState('domcontentloaded');

  const customersLeadsLabel = page.locator('label').filter({ hasText: 'Customers / Leads' }).first();
  await expect(customersLeadsLabel).toBeVisible();

  const activeOnlyFilter = page.locator('span').filter({ hasText: 'Active Only' }).first();
  await expect(activeOnlyFilter).toBeVisible();

  const leadOnlyFilter = page.locator('span').filter({ hasText: 'Lead Only' }).first();
  await expect(leadOnlyFilter).toBeVisible();

  const customerOnlyFilter = page.locator('span').filter({ hasText: 'Customer Only' }).first();
  await expect(customerOnlyFilter).toBeVisible();
  await expect(customerOnlyFilter).toBeEnabled();
  await customerOnlyFilter.click();

  const quickSearchInput = page.getByPlaceholder('Quick Search');
  await expect(quickSearchInput).toBeVisible();

  const filtersButton = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButton).toBeVisible();

  const sortButton = page.getByRole('button', { name: 'Sort 0', exact: true });
  await expect(sortButton).toBeVisible();

  const savedSearchesButton = page.locator('button[x-tooltip="Saved Searches"]');
  await expect(savedSearchesButton).toBeVisible();

  const newLeadButton = page.getByRole('button', { name: 'New Lead', exact: true });
  await expect(newLeadButton).toBeVisible();

  const previousPagination = page.locator('span').filter({ hasText: 'Previous' }).first();
  await expect(previousPagination).toBeVisible();

  const nextPagination = page.locator('button[aria-label="Next"]');
  await expect(nextPagination).toBeVisible();

  const nameColumnHeader = page.locator('th').filter({ hasText: 'NAME' }).first();
  await expect(nameColumnHeader).toBeVisible();

  const additionalSupportColumnHeader = page.locator('th').filter({ hasText: 'ADDITIONAL SUPPORT' }).first();
  await expect(additionalSupportColumnHeader).toBeVisible();

  const activeOnlyToggle = page.locator('(//span[normalize-space()="Active Only"]//following::div/button)[1]');
  await expect(activeOnlyToggle).toBeVisible();
  await expect(activeOnlyToggle).toBeEnabled();
  await expect(activeOnlyToggle).toHaveClass(/bg-denim-blue-600/);

  const activeStatusRows = page.locator('//table/thead//th[7]//following::tbody//tr//td[7]//span');
  const statusTextsActive = await activeStatusRows.allTextContents();
  for (const status of statusTextsActive) {
    expect(status.trim()).toBe('Active');
  }

  const totalRecordsLocator = page.locator('//div[@aria-label="Pagination"]//p/span[2]');
  const totalRecordsAfterToggleOn = Number(await totalRecordsLocator.textContent());
  console.log(`[data] totalRecordsActiveOnlyOn: ${totalRecordsAfterToggleOn}`);

  await activeOnlyToggle.click();
  await page.waitForTimeout(3000);
  await expect(activeOnlyToggle).toHaveClass(/bg-gray-200/);

  const totalRecordsAfterToggleOff = Number(await totalRecordsLocator.textContent());
  console.log(`[data] totalRecordsActiveOnlyOff: ${totalRecordsAfterToggleOff}`);
  expect(totalRecordsAfterToggleOff).toBeGreaterThanOrEqual(totalRecordsAfterToggleOn);

  const leadsOnlyToggle = page.locator('(//span[normalize-space()="Lead Only"]//following::div/button)[1]');
  await expect(leadsOnlyToggle).toBeVisible();
  await expect(leadsOnlyToggle).toBeEnabled();
  await leadsOnlyToggle.click();
  await page.waitForTimeout(3000);
  await expect(leadsOnlyToggle).toHaveClass(/bg-denim-blue-600/);

  const leadStatusColumn = page.locator('//table/thead//th[12]//following::tbody//tr//td[12]//span');
  const statusTextsLead = await leadStatusColumn.allTextContents();
  for (const status of statusTextsLead) {
    expect(status.trim()).toBe('Lead');
  }

  await activeOnlyToggle.click();
  await page.waitForTimeout(3000);
  await expect(activeOnlyToggle).toHaveClass(/bg-denim-blue-600/);

  const activeStatusRowsLeadOnly = page.locator('//table/thead//th[7]//following::tbody//tr//td[7]//span');
  const statusTextsActiveLeadOnly = await activeStatusRowsLeadOnly.allTextContents();
  for (const status of statusTextsActiveLeadOnly) {
    expect(status.trim()).toBe('Active');
  }

  const customerOnlyToggle = page.locator('(//span[normalize-space()="Customer Only"]//following::div/button)[1]');
  await expect(customerOnlyToggle).toBeVisible();
  await expect(customerOnlyToggle).toBeEnabled();
  await customerOnlyToggle.click();
  await page.waitForTimeout(3000);
  await expect(customerOnlyToggle).toHaveClass(/bg-denim-blue-600/);
  await page.waitForTimeout(2000);
  await expect(leadsOnlyToggle).toHaveClass(/bg-gray-200/);

  const leadStatusAfterCustomerToggle = page.locator('//table/thead//th[12]//following::tbody//tr//td[12]//div');
  const statusTextsLeadAfterCustomerToggle = await leadStatusAfterCustomerToggle.allTextContents();
  for (const status of statusTextsLeadAfterCustomerToggle) {
    expect(status.trim()).toBe('');
  }

  const indexCustomerRowsCode = page.locator('//tbody/tr//td[2]//div[contains(@class,"text-left")]');
  const customerTextsCode = await indexCustomerRowsCode.allTextContents();
  for (const customerText of customerTextsCode) {
    expect(customerText.trim().startsWith('CUS')).toBe(true);
  }

  // Match standalone Quick Search defaults — Customer Only off so clear/search restore the list
  if (/bg-denim-blue-600/.test((await customerOnlyToggle.getAttribute('class')) || '')) {
    await customerOnlyToggle.click();
    await page.waitForTimeout(3000);
  }
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await expect(quickSearchInput).toBeEnabled();
  await quickSearchInput.click();
  await quickSearchInput.fill(testData.customerCode);
  await page.waitForTimeout(4000);

  const customerRowsCode = page.locator('//tbody/tr//td[2]//div[contains(@class,"text-left")]');
  await expect(customerRowsCode).toHaveCount(1);
  await expect(customerRowsCode).toHaveText(testData.customerCode);
  console.log(`[data] countOfCustomerRowsCode: 1`);

  await quickSearchInput.clear();
  await page.waitForTimeout(3000);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await quickSearchInput.fill(testData.customerName);
  await page.waitForTimeout(4000);

  const customerRowsName = page.locator('//tbody/tr//td[3]//div[contains(@class,"text-left")]');
  const customerNames = await customerRowsName.allTextContents();
  expect(customerNames.length).toBeGreaterThan(0);
  for (const customerName of customerNames) {
    expect(customerName.trim().toLowerCase()).toContain(testData.customerName.trim().toLowerCase());
  }

  await quickSearchInput.clear();
  await page.waitForTimeout(3000);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await quickSearchInput.fill(testData.CustomerCity);
  await page.waitForTimeout(4000);

  const customerRowsCity = page.locator('//tbody/tr//td[5]//div[contains(@class,"text-left")]');
  const customerCities = await customerRowsCity.allTextContents();
  expect(customerCities.length).toBeGreaterThan(0);
  for (const customerCity of customerCities) {
    expect(customerCity.trim().toLowerCase()).toContain(testData.CustomerCity.trim().toLowerCase());
  }

  await quickSearchInput.clear();
  await page.waitForTimeout(3000);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await quickSearchInput.fill(testData.CustomerState);
  await page.waitForTimeout(4000);

  // Quick Search matches any column — assert search term appears in the row
  const stateResultRows = page.locator('tbody tr');
  await expect(stateResultRows.first()).toBeVisible();
  const stateRowCount = await stateResultRows.count();
  console.log(`[data] stateSearchRows: ${stateRowCount}`);
  expect(stateRowCount).toBeGreaterThan(0);
  for (let i = 0; i < stateRowCount; i++) {
    const rowText = ((await stateResultRows.nth(i).innerText()) || '').toLowerCase();
    expect(rowText).toContain(testData.CustomerState.trim().toLowerCase());
  }

  await quickSearchInput.clear();
  await page.waitForTimeout(3000);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await quickSearchInput.fill(testData.CustomerTier);
  await page.waitForTimeout(4000);

  const customerTierFilter = page.locator('//tbody/tr//td[11]//div[contains(@class,"text-left")]');
  const customerTiers = await customerTierFilter.allTextContents();
  expect(customerTiers.length).toBeGreaterThan(0);
  for (const customerTier of customerTiers) {
    expect(customerTier.trim().toLowerCase()).toContain(testData.CustomerTier.trim().toLowerCase());
  }

  await quickSearchInput.clear();
  await page.waitForTimeout(3000);
  await expect(page.locator('tbody tr').first()).toBeVisible();

  await quickSearchInput.fill(testData.NoCustomerData);
  await page.waitForTimeout(4000);

  const customerRowsNoCustomerData = page.locator('//td[normalize-space()="No results found."]');
  await expect(customerRowsNoCustomerData).toBeVisible();

  const noCustomerDataRecordsCount = page.locator('//div[@aria-label="Pagination"]//p/span[2]');
  const noCustomerDataRecordsCountText = await noCustomerDataRecordsCount.textContent();
  console.log(`[data] noCustomerDataRecordsCount: ${noCustomerDataRecordsCountText}`);
  expect(noCustomerDataRecordsCountText).toBe('0');
});
