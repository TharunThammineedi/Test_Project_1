// Verify Estimate index: Active toggle record count, sort, pagination
import testData from '../../test-data.json';
import { test, expect } from '@playwright/test';
const { prepareSession } = require('../../helpers/sessionData');

test('Verify Estimate Index Page Functionalities @regression @set1', async ({ page }) => {
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

  const signInConfirmButton = page.locator('[data-cy="btnLoginConfirm"]');
  await expect(signInConfirmButton).toBeEnabled();
  await signInConfirmButton.click();

  const estimateMenuLink = page.locator('(//button[normalize-space()="Estimating & Pricing"])[1]');
  await expect(estimateMenuLink).toBeVisible();
  await estimateMenuLink.click();

  const estimatesQuotesLink = page.getByRole('link', {
    name: 'Estimates/Quotes',
    exact: true
  });
  await expect(estimatesQuotesLink).toBeVisible();
  await expect(estimatesQuotesLink).toBeEnabled();
  await estimatesQuotesLink.click();

  await page.waitForLoadState('domcontentloaded');

  const newEstimateLink = page.getByRole('link', { name: 'New Estimate', exact: true });
  await expect(newEstimateLink).toBeVisible();

  const recordsCount = page.locator('//p[contains(normalize-space(),"Showing") and contains(normalize-space(),"records")]/span[2]');
  await expect(recordsCount).toBeVisible();
  const activeCount = Number((await recordsCount.innerText()).trim());

  const activeToggle = page.locator('//span[normalize-space()="Active Only"]//..//button');
  await activeToggle.click();
  await page.waitForTimeout(3000);

  const allCount = Number((await recordsCount.innerText()).trim());
  expect(allCount).toBeGreaterThan(activeCount);

  const sort0Button = page.getByRole('button', { name: 'Sort 0', exact: true });
  await expect(sort0Button).toBeEnabled();
  await sort0Button.click();

  const columnSelect = page.locator('select[name="column"]');
  await expect(columnSelect).toBeVisible();
  await columnSelect.selectOption({ value: 'modelCode' });

  const directionSelect = page.locator('select[name="direction"]');
  await expect(directionSelect).toBeVisible();
  await directionSelect.selectOption({ value: 'desc' });

  const applyButton = page.getByRole('button', { name: 'Apply', exact: true });
  await expect(applyButton).toBeEnabled();
  await applyButton.click();
  await page.waitForTimeout(2000);

  const sort1Button = page.getByRole('button', { name: 'Sort 1', exact: true });
  await expect(sort1Button).toBeEnabled();

  const row1Number = ((await page.locator('//tbody//tr[1]//td[2]').innerText()) || '').split(/\s*\|\s*/)[0].trim();
  const row2Number = ((await page.locator('//tbody//tr[2]//td[2]').innerText()) || '').split(/\s*\|\s*/)[0].trim();
  expect(row1Number.localeCompare(row2Number)).toBeGreaterThanOrEqual(0);

  const currentPage = page.locator('//span[@class="pagination-item"]//span[@aria-current="page"]');
  await expect(currentPage).toHaveText('1');

  const firstRow = page.locator('//tbody//tr[1]//td[2]');
  await expect(firstRow).toBeVisible();
  const page1FirstRow = ((await firstRow.innerText()) || '').trim();

  const page2Button = page.locator('button[aria-label="Go to page 2"]');
  await expect(page2Button).toBeEnabled();
  await page2Button.click();
  await page.waitForTimeout(2000);

  await expect(currentPage).toHaveText('2');
  const page2FirstRow = ((await firstRow.innerText()) || '').trim();
  expect(page2FirstRow).not.toBe(page1FirstRow);

  const nextPaginationButton = page.locator('button[aria-label="Next"]');
  await expect(nextPaginationButton).toBeEnabled();
  await nextPaginationButton.click();
  await page.waitForTimeout(2000);
  await expect(currentPage).not.toHaveText('2');

  const lastPageButton = page.locator('//span[@class="pagination-item"]//button').last();
  await expect(lastPageButton).toBeEnabled();
  const lastPageLabel = (await lastPageButton.getAttribute('aria-label')) || '';
  const lastPageNumber = (lastPageLabel.match(/(\d+)/) || [])[1];
  await lastPageButton.click();
  await page.waitForTimeout(2000);
  if (lastPageNumber) {
    await expect(currentPage).toHaveText(lastPageNumber);
  }

  const previousPaginationButton = page.locator('button[aria-label="Previous"]');
  await expect(previousPaginationButton).toBeEnabled();
  await previousPaginationButton.click();
  await page.waitForTimeout(2000);
  if (lastPageNumber) {
    await expect(currentPage).not.toHaveText(lastPageNumber);
  }
});
