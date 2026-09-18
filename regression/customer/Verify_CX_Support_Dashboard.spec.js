// Verify CX Support Dashboard columns and Mine / Active Opportunities toggles
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
  expect(mineFilteredPageCount).toBeLessThan(mineUnfilteredPageCount);

  const activeOpportunitiesOnlyButton = page.locator("//label[normalize-space()='Active Opportunities Only']/following-sibling::button");
  await expect(activeOpportunitiesOnlyButton).toBeEnabled();
  const activeFilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] activeFilteredPageCount: ${activeFilteredPageCount}`);

  await activeOpportunitiesOnlyButton.click();
  await page.waitForTimeout(2000);
  await expect(lastPageButton).toBeVisible();
  const activeUnfilteredPageCount = Number((await lastPageButton.innerText()).trim());
  console.log(`[data] activeUnfilteredPageCount: ${activeUnfilteredPageCount}`);
  expect(activeFilteredPageCount).toBeLessThan(activeUnfilteredPageCount);
});
