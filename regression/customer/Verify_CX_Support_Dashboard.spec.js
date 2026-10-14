// Verify CX Support Dashboard columns, Mine / Active toggles, and Customer Name sort
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify CX Support Dashboard @regression @set1', async ({ page }) => {
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

  const cxSupportDashboardLink = page.getByRole('link', { name: 'CX Support Dashboard', exact: true });
  await expect(cxSupportDashboardLink).toBeVisible();
  await expect(cxSupportDashboardLink).toBeEnabled();
  await cxSupportDashboardLink.click();
  await page.waitForLoadState('domcontentloaded');

  const defaultFiltersButton = page.getByRole('button', { name: 'Filters 1', exact: true });
  await expect(defaultFiltersButton).toBeVisible();
  await expect(defaultFiltersButton).toBeEnabled();
  await defaultFiltersButton.click();

  const resetFiltersButton = page.locator('button[wire\\:click="resetRows"]').first();
  await expect(resetFiltersButton).toBeVisible();
  await expect(resetFiltersButton).toBeEnabled();
  await resetFiltersButton.click();
  await page.waitForTimeout(2000);

  const filtersButtonAfterReset = page.getByRole('button', { name: 'Filters 0', exact: true });
  await expect(filtersButtonAfterReset).toBeVisible();
  await expect(filtersButtonAfterReset).toBeEnabled();
  await filtersButtonAfterReset.click();

  const filterColumnInput = page.locator('input[name="rows.0.column"][type="text"]').first();
  await expect(filterColumnInput).toBeVisible();
  await expect(filterColumnInput).toBeEnabled();
  await filterColumnInput.click();
  const opportunityManagerOption = page.locator('li[data-label="Opportunity Manager"]').first();
  await expect(opportunityManagerOption).toBeVisible();
  await opportunityManagerOption.click();

  const filterOperatorInput = page.locator('input[name="rows.0.operator"][type="text"]').first();
  await expect(filterOperatorInput).toBeVisible();
  await expect(filterOperatorInput).toBeEnabled();
  await filterOperatorInput.click();
  const isOption = page.locator('li[data-label="is"]').first();
  await expect(isOption).toBeVisible();
  await isOption.click();

  const filterValueInput = page.locator('input[name="rows.0.value"][type="text"]').first();
  await expect(filterValueInput).toBeVisible();
  await expect(filterValueInput).toBeEnabled();
  await filterValueInput.click();
  const opportunityManagerValueOption = page.locator(`li[data-label="${testData.userPicker}"]`).first();
  await expect(opportunityManagerValueOption).toBeVisible();
  await opportunityManagerValueOption.click();

  const applyFilterButton = page.getByRole('button', { name: 'Apply', exact: true }).first();
  await expect(applyFilterButton).toBeEnabled();
  await applyFilterButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Filters 1', exact: true })).toBeVisible();

  const productItemIdRouteHeader = page.locator('th').filter({ hasText: 'PRODUCT ITEM ID | ROUTE' }).first();
  await expect(productItemIdRouteHeader).toBeVisible();

  const descriptionHeader = page.locator('th').filter({ hasText: 'DESCRIPTION' }).first();
  await expect(descriptionHeader).toBeVisible();

  const unitTemplateIdSummaryHeader = page.locator('th').filter({ hasText: 'UNIT TEMPLATE ID | SUMMARY' }).first();
  await expect(unitTemplateIdSummaryHeader).toBeVisible();

  const productClassHeader = page.locator('th').filter({ hasText: 'PRODUCT CLASS' }).first();
  await expect(productClassHeader).toBeVisible();

  const lastPageButton = page.locator('//span[@class="pagination-item"]//button').last();
  await expect(lastPageButton).toBeVisible();

  const mineFilterButton = page.locator("//label[normalize-space()='Mine']/following-sibling::button");
  await expect(mineFilterButton).toBeEnabled();
  const mineFilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] mineFilteredPageCount: ${mineFilteredPageCount}`);

  await mineFilterButton.click();
  await page.waitForTimeout(2000);
  await expect(lastPageButton).toBeVisible();
  const mineUnfilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] mineUnfilteredPageCount: ${mineUnfilteredPageCount}`);
  expect(mineFilteredPageCount).toBeLessThanOrEqual(mineUnfilteredPageCount);

  const activeOpportunitiesOnlyButton = page.locator("//label[normalize-space()='Active Opportunities Only']/following-sibling::button");
  await expect(activeOpportunitiesOnlyButton).toBeEnabled();
  const activeFilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] activeFilteredPageCount: ${activeFilteredPageCount}`);

  await activeOpportunitiesOnlyButton.click();
  await page.waitForTimeout(2000);
  await expect(lastPageButton).toBeVisible();
  const activeUnfilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] activeUnfilteredPageCount: ${activeUnfilteredPageCount}`);
  expect(activeFilteredPageCount).toBeLessThanOrEqual(activeUnfilteredPageCount);

  const customerNameCells = page.locator(
    "//tr//td[2]//span[contains(normalize-space(),'Customer:')]/following-sibling::div//div[contains(@class,'text-ellipsis')]"
  );

  const sort0Button = page.getByRole('button', { name: 'Sort 0', exact: true });
  await expect(sort0Button).toBeEnabled();
  await sort0Button.click();

  const directionInput = page.locator('input[name="rows.0.direction"][type="text"]');
  await expect(directionInput).toBeVisible();
  await expect(directionInput).toBeEnabled();
  await directionInput.click();
  const descendingOption = page.locator('li[data-label="desc"]');
  await expect(descendingOption).toBeVisible();
  await expect(descendingOption).toBeEnabled();
  await descendingOption.click();

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Sort 1', exact: true })).toBeEnabled();

  const descRow1 = ((await customerNameCells.nth(0).innerText()) || '').trim();
  const descRow2 = ((await customerNameCells.nth(1).innerText()) || '').trim();
  console.log(`[data] descRow1: ${descRow1}, descRow2: ${descRow2}`);
  expect(descRow1.localeCompare(descRow2)).toBeGreaterThanOrEqual(0);

  await page.getByRole('button', { name: 'Sort 1', exact: true }).click();

  await expect(directionInput).toBeVisible();
  await expect(directionInput).toBeEnabled();
  await directionInput.click();
  const ascendingOption = page.locator('li[data-label="asc"]');
  await expect(ascendingOption).toBeVisible();
  await expect(ascendingOption).toBeEnabled();
  await ascendingOption.click();

  await expect(applyButton).toBeEnabled();
  await applyButton.click();
  await page.waitForTimeout(2000);

  const noCustomerFirst = page.locator("//tbody/tr[1]//td[2]//span[contains(normalize-space(),'No Customer')]");
  if (await noCustomerFirst.isVisible()) {
    await expect(noCustomerFirst).toBeVisible();
  } else {
    const ascRow1 = ((await customerNameCells.nth(0).innerText()) || '').trim();
    const ascRow2 = ((await customerNameCells.nth(1).innerText()) || '').trim();
    console.log(`[data] ascRow1: ${ascRow1}, ascRow2: ${ascRow2}`);
    expect(ascRow1.localeCompare(ascRow2)).toBeLessThanOrEqual(0);
  }

  await page.getByRole('button', { name: 'Sort 1', exact: true }).click();

  const resetSortButton = page.locator("//p[normalize-space()='Reset']/parent::button").last();
  await expect(resetSortButton).toBeEnabled();
  await resetSortButton.click();
  await page.waitForTimeout(2000);

  await expect(page.getByRole('button', { name: 'Sort 0', exact: true })).toBeVisible();
});
